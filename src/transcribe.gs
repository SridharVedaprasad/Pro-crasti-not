/**
 * Pro-crasti-not — Voice capture pipeline
 *
 * Runs entirely in Google Apps Script (no Mac dependency).
 * Polls a Drive folder every 1 minute for new audio files, transcribes
 * via Groq Whisper, appends to inbox.md, logs every attempt to audit.jsonl.
 *
 * SETUP — Script Properties (Project Settings > Script Properties):
 *   GROQ_API_KEY        - from console.groq.com
 *   VOICE_INBOX_FOLDER_ID
 *   PROCESSED_FOLDER_ID
 *   FAILED_FOLDER_ID
 *   INBOX_FILE_ID        - the brain.md-sibling inbox.md file in Drive
 *   AUDIT_FILE_ID         - audit.jsonl file in Drive
 *
 * None of these IDs or the key are hardcoded here — this file is safe to
 * publish. Personal configuration lives in Script Properties, which are
 * per-user and never appear in git.
 */

const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/mp4', 'audio/wav'];

/**
 * Entry point. Wired to a time-driven trigger (every 1 minute) via
 * setupTrigger(). Processes every audio file currently in voice-inbox/.
 */
function processVoiceInbox() {
  const props = PropertiesService.getScriptProperties();
  const inboxFolder = DriveApp.getFolderById(props.getProperty('VOICE_INBOX_FOLDER_ID'));
  const processedFolder = DriveApp.getFolderById(props.getProperty('PROCESSED_FOLDER_ID'));
  const failedFolder = DriveApp.getFolderById(props.getProperty('FAILED_FOLDER_ID'));

  const files = inboxFolder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    if (!isAudioFile(file)) continue;

    processOneFile(file, processedFolder, failedFolder);
  }
}

function isAudioFile(file) {
  return AUDIO_MIME_TYPES.indexOf(file.getMimeType()) !== -1;
}

function processOneFile(file, processedFolder, failedFolder) {
  const fileName = file.getName();
  const startedAt = new Date();

  try {
    const transcript = transcribeWithGroq(file);

    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Empty transcript returned');
    }

    appendTranscriptToInbox(fileName, transcript, startedAt);
    moveFile(file, processedFolder);

    logAudit({
      action_type: 'inbox_transcribe',
      trust_tier: 'supervised', // see note in docs/audit-schema.md — no per-instance approval happens; flagging rather than inventing a tier unilaterally
      trigger: 'voice_note',
      input_summary: `mp3 '${fileName}', ${file.getSize()} bytes`,
      output_summary: `transcript appended to inbox.md, ${transcript.length} chars`,
      outcome: 'success',
      ambiguity_flag: false,
      reversed_at: null,
      notes: 'trust_tier is a placeholder — transcription has no per-instance human approval, revisit in Week 3 tier design'
    });

  } catch (err) {
    moveFile(file, failedFolder);

    logAudit({
      action_type: 'inbox_transcribe',
      trust_tier: 'supervised',
      trigger: 'voice_note',
      input_summary: `mp3 '${fileName}', ${file.getSize ? file.getSize() : 'unknown'} bytes`,
      output_summary: '',
      outcome: 'failure',
      ambiguity_flag: false,
      reversed_at: null,
      notes: String(err)
    });
  }
}

/**
 * Calls Groq's Whisper endpoint (OpenAI-compatible) with the audio blob.
 * Returns the transcript text, or throws on failure.
 */
function transcribeWithGroq(file) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
  if (!apiKey) throw new Error('GROQ_API_KEY not set in Script Properties');

  const blob = file.getBlob();
  const boundary = '----ProCrastiNotBoundary' + Utilities.getUuid();

  const payload = buildMultipartPayload(boundary, blob, file.getName());

  const response = UrlFetchApp.fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + apiKey
    },
    contentType: 'multipart/form-data; boundary=' + boundary,
    payload: payload,
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code !== 200) {
    throw new Error('Groq API error ' + code + ': ' + response.getContentText());
  }

  const json = JSON.parse(response.getContentText());
  return json.text;
}

/**
 * Builds a multipart/form-data payload by hand — Apps Script's UrlFetchApp
 * doesn't have a native multipart helper for mixing a file blob with
 * regular form fields.
 */
function buildMultipartPayload(boundary, blob, fileName) {
  const nl = '\r\n';
  const parts = [];

  parts.push(Utilities.newBlob(
    '--' + boundary + nl +
    'Content-Disposition: form-data; name="model"' + nl + nl +
    'whisper-large-v3' + nl +
    '--' + boundary + nl +
    'Content-Disposition: form-data; name="response_format"' + nl + nl +
    'json' + nl +
    '--' + boundary + nl +
    'Content-Disposition: form-data; name="file"; filename="' + fileName + '"' + nl +
    'Content-Type: ' + blob.getContentType() + nl + nl
  ).getBytes());

  parts.push(blob.getBytes());
  parts.push(Utilities.newBlob(nl + '--' + boundary + '--' + nl).getBytes());

  return combineByteArrays(parts);
}

function combineByteArrays(arrays) {
  let totalLength = 0;
  arrays.forEach(a => totalLength += a.length);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach(a => {
    combined.set(a, offset);
    offset += a.length;
  });
  return Array.from(combined);
}

/**
 * Appends a timestamped transcript entry to inbox.md, under the
 * "Today's dump" section, matching the format from templates/inbox.template.md.
 */
function appendTranscriptToInbox(fileName, transcript, timestamp) {
  const fileId = PropertiesService.getScriptProperties().getProperty('INBOX_FILE_ID');
  const file = DriveApp.getFileById(fileId);

  const ts = formatSGT(timestamp);
  const entry = '\n## [' + ts + '] ' + fileName + '\n' + transcript.trim() + '\n';

  const existing = file.getBlob().getDataAsString();
  file.setContent(existing + entry);
}

/**
 * Appends one JSON line to audit.jsonl. Never rewrites — always appends,
 * per docs/audit-schema.md.
 */
function logAudit(entry) {
  entry.timestamp = formatSGT(new Date());

  const fileId = PropertiesService.getScriptProperties().getProperty('AUDIT_FILE_ID');
  const file = DriveApp.getFileById(fileId);

  const existing = file.getBlob().getDataAsString();
  const line = JSON.stringify(entry);
  file.setContent(existing + (existing.length > 0 ? '\n' : '') + line);
}

function formatSGT(date) {
  return Utilities.formatDate(date, 'Asia/Singapore', "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function moveFile(file, targetFolder) {
  const parents = file.getParents();
  while (parents.hasNext()) {
    const parent = parents.next();
    parent.removeFile(file);
  }
  targetFolder.addFile(file);
}

/**
 * One-time setup: run this manually once from the Apps Script editor
 * to install the 1-minute polling trigger. Safe to re-run — clears any
 * existing trigger for this function first, so it never double-fires.
 */
function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction() === 'processVoiceInbox') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('processVoiceInbox')
    .timeBased()
    .everyMinutes(1)
    .create();

  Logger.log('Trigger installed: processVoiceInbox runs every 1 minute.');
}

/**
 * Manual recovery: re-attempt every file currently sitting in failed/.
 * Run manually from the Apps Script editor when needed — not on a trigger.
 */
function recoverFailed() {
  const props = PropertiesService.getScriptProperties();
  const failedFolder = DriveApp.getFolderById(props.getProperty('FAILED_FOLDER_ID'));
  const processedFolder = DriveApp.getFolderById(props.getProperty('PROCESSED_FOLDER_ID'));

  const files = failedFolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (!isAudioFile(file)) continue;
    processOneFile(file, processedFolder, failedFolder);
  }
}

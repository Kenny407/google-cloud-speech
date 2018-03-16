const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

const filename = '<path_to_local_audio';
const encoding = 'LINEAR16, FLAC, etc';
// For WAV and FLAC files, the sampleRate and encoding can be retrieved from the header of the file
const sampleRateHertz = 16000; 
const languageCode = 'en-US, fr-FR, en-GB';
const speechContext = {
  "phrases": ['lol', 'bae', 'lulzsec', 'Sox']
}

const config = {
  encoding,
  sampleRateHertz,
  languageCode,
  speechContext,
};

// Note there is a limit of 10485760 bytes.for the content
// If your file exceeds this limit, you will have to use Google Cloud Storage :/
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config,
  audio,
};

// Detects speech in the audio file
client
  .recognize(request)
  .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: `, transcription);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
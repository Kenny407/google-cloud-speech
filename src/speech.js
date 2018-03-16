/**
 * To manage large files with Google Speech.
 * It is needed to save the audio file in Google Storage
 * This example shows how to obtain the audio from your bucket
 * and obtain the transcription.
 */

const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

// Configuration properties
const gcsUri = 'gs://<bucket_name>/audio_file.wav'
const encoding = 'Encoding of the audio file: LINEAR16, FLAC, etc';
// For WAV and FLAC files, the sampleRate and encoding can be retrieved from the header of the file
const sampleRateHertz = 24000;
const languageCode = 'fr-FR';
// To show off the difference between each transcription
const enableWordTimeOffsets = true
// To get more alternatives, but generally the first one is the most accurate and with higher confidence level
const maxAlternatives = 2;
// A way to add words to Google Speech
// e.g: Voice: "I am using Sox" but translation => "I am using socks"
//    Sox can be sent as a speech context
const speechContext = {
  "phrases": ['lol', 'bae', 'lulzsec', 'Sox']
}

const config = {
  encoding,
  sampleRateHertz,
  languageCode,
  speechContext,
  maxAlternatives,
  enableWordTimeOffsets,
};

const audio = {
  uri: gcsUri,
};

const request = {
  config,
  audio
};

// Creates a long running task to detect the speech in the audio. 
// The job will wait until it gets the result
client
  .longRunningRecognize(request)
  .then(data => {
    const operation = data[0];
    // Get a Promise representation of the final result of the job
    return operation.promise();
  })
  .then(data => {
    const response = data[0];
    // if using offsets, you may want to show off the times between each word
    if(config.enableWordTimeOffsets) {
      response.results.forEach(result => {
        console.log(`Transcription: ${result.alternatives[0].transcript}`);
        result.alternatives[0].words.forEach(wordInfo => {
          const startSecs =`${wordInfo.startTime.seconds} . ${wordInfo.startTime.nanos / 100000000} `;
          const endSecs = `${wordInfo.endTime.seconds} . ${wordInfo.endTime.nanos / 100000000}`;
          console.log(`Word: ${wordInfo.word}`);
          console.log(`\t ${startSecs} secs - ${endSecs} secs`);
        });
      });
    }
    // Or just print the transcription
    else {
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n\n');
      console.log(`Transcription: \n${transcription}`);
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
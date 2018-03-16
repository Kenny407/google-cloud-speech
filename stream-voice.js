const fs = require('fs')
const speech = require('@google-cloud/speech')

const client = new speech.SpeechClient()

const filename = './examples/test1/single-leg-customer-16b-24000.wav';
const encoding = "LINEAR16"
const sampleRateHertz = 16000
const languageCode = "fr-FR"
const speechContext = {
    "phrases": ['www.vélib-métropole.fr', 'Vélib', 'métropole', 'tiret']
}

const request = {
    config: {
        encoding,
        sampleRateHertz,
        languageCode,
        speechContext,
    },
    interimResults: false,
}

const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
        if (data.results[0])
            console.log(
                `Transcription: ${JSON.stringify(data.results[0].alternatives[0].transcript)}`
            )
    })

fs.createReadStream(filename).pipe(recognizeStream)
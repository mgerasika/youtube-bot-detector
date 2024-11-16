import admin from 'firebase-admin';
import { Storage, } from '@google-cloud/storage';
import { Buffer, } from 'buffer';
import { createLogger, ILogger, } from '@common/utils/create-logger.utils';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';

// Path to your Firebase service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin with service account and storage bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://youtube-bot-landing.firebasestorage.app', 
});

const bucket = admin.storage().bucket();

 async function uploadJsonAndMakePublic(jsonData: object, customFileName: string, timeoutInSecconds :number, logger: ILogger): IAsyncPromiseResult<string> {
  // Convert JSON object to a Buffer
  const buffer = Buffer.from(JSON.stringify(jsonData), 'utf-8');

  try {
    // Create a new file in the bucket with the specified custom name
    const file = bucket.file(customFileName);

    // Upload the buffer to the file
    await file.save(buffer, {
      metadata: {
        contentType: 'application/json', // Set MIME type
        cacheControl: `public, max-age=${timeoutInSecconds}`, // Cache settings
      },
    });

    // Make the file public
    await file.makePublic();

    return [logger.log(`File ${customFileName} uploaded and made public at ${file.publicUrl()}`)]
  } catch (error) {
    return [,logger.log(`Failed to upload and make ${customFileName} public:` + error)]
  }
}

export const firebase = {
  uploadJsonAndMakePublic,
}



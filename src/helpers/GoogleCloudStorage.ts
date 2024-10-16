// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
// The ID of your GCS bucket
const bucketName = process.env.BUCKET_NAME!;

// Creates a client
const storage = new Storage({
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
    projectId: process.env.PROJECT_ID,
});

export async function uploadFile(filePath: string, destFileName: string, buffer: Buffer) {
    const options = {
        destination: destFileName,
        metadata: {
            contentType: 'image/jpeg',
        },
    };

    return await storage.bucket(bucketName).file(`${filePath}/${destFileName}`).save(buffer, options).then((res) => {
        console.log(`${destFileName} uploaded to ${filePath}`);
        console.log("res", res);
        return res
    });
}
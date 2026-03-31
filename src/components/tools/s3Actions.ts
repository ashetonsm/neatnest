/*
PUT /my-image.jpg HTTP/1.1
Host: myBucket.s3.<Region>.amazonaws.com
Date: Wed, 12 Oct 2009 17:50:00 GMT
Authorization: authorization string
Content-Type: text/plain
Content-Length: 11434
x-amz-meta-author: Janet
Expect: 100-continue
[11434 bytes of object data]
*/

import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
    region: import.meta.env.VITE_AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED"
});


/**
 * Upload a file to an S3 bucket.
 * @param {{ bucketName: string, key: string, filePath: string }}
 */
export const uploadData = async (imgPath: string, imgBlob: Blob | null) => {

    const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: imgPath,
        Body: imgBlob
    });

    try {
        // console.log(command)
        const response = await client.send(command);
        return response
    } catch (caught) {
        if (
            caught instanceof S3ServiceException &&
            caught.name === "EntityTooLarge"
        ) {
            console.error(
                `Error from S3 while uploading object to ${import.meta.env.VITE_S3_BUCKET_NAME}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
            );
        } else if (caught instanceof S3ServiceException) {
            console.error(
                `Error from S3 while uploading object to ${import.meta.env.VITE_S3_BUCKET_NAME}.  ${caught.name}: ${caught.message}`,
            );
        } else {
            throw caught;
        }
    }
};


export const createPresignedUrlWithClient = (key: string) => {
    const command = new GetObjectCommand({ Bucket: import.meta.env.VITE_S3_BUCKET_NAME, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
};
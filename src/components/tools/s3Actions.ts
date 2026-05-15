import {
    DeleteObjectCommand,
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


/**
 * Deletes an item from the S3 database.
 * @param itemKey The item to be deleted
 * @returns 
 */
export const DELETE_S3 = async (itemKey: any) => {
    const command = {
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: itemKey.url
    };

    try {
        const data = await client.send(new DeleteObjectCommand(command))
        console.log("Success. Object deleted.", data)
        return data
    } catch (err) {
        console.log("Error", err);
    }
};

export const createPresignedUrlWithClient = (key: string) => {
    const command = new GetObjectCommand({ Bucket: import.meta.env.VITE_S3_BUCKET_NAME, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
};
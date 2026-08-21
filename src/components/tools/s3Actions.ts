/**
 * Upload a file to an S3 bucket.
 * @param {{ bucketName: string, key: string, filePath: string }}
 */
export const UPLOAD_OBJECT = async (imgPath: string, imgBlob: Blob | null) => {
  try {
    const body = {
      "Action": "UPLOAD_OBJECT",
      "Data": {
        "File": imgBlob,
        "Path": imgPath
        }
    }

    return fetch(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/s3`, 
    {
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
};

/**
 * Copy an existing file to a new location
 * @param oldPath 
 * @param newPath 
 * @returns 
 */
export const COPY_OBJECT = async (oldPath: string, newPath: string) => {
  try {
    const body = {
      "Action": "COPY_OBJECT",
      "Data": {
        "CopyFrom": oldPath,
        "CopyTo": newPath
        }
    }

    return fetch(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/s3`, 
    {
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
};


/**
 * Deletes an item from the S3 database.
 * @param itemKey The item to be deleted
 * @returns 
 */
export const DELETE_OBJECT = async (itemKey: any) => {
  try {
    const body = {
      "Action": "DELETE_OBJECT",
      "Data": {
        "Key": itemKey
        }
    }

    return fetch(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/s3`, 
    {
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
};

export const GET_SIGNED_URL = async (key: string) => {
  try {
    const body = {
      "Action": "GET_SIGNED_URL",
      "Data": {"Key": key}
      }

    return fetch(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/s3`, 
    {
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
};
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

export async function uploadData(input: {
    path: string,
    data: Blob,
    options: {
        contentType: string
    }
}): Promise<{ result: any; }> {
    const url = "https://example.org/products.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        var res = {result: "No response."}
        res.result = await response.json();
        return res
    } catch (error: any) {
        var res = {result: "No response."}
        res.result = error.message
        return res
    }
}

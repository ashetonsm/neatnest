import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-2" }); // Configure your region
const docClient = DynamoDBDocumentClient.from(client);

export const batchGetUsernames = async (table1Name: any, keysTable1: any) => {
  const command = new BatchGetCommand({
    RequestItems: {
      [table1Name]: {
        Keys: keysTable1, // e.g., [{ pk: "key1" }, { pk: "key2" }]
        // ProjectionExpression: "attribute1, attribute2", // Optional
      }
    },
  });

  try {
    const response = await docClient.send(command);
    console.log("Success:", response.Responses);
    // Responses will be a plain JavaScript object:
    // { Table1Name: [...items], Table2Name: [...items] }
    return response.Responses;
  } catch (err) {
    console.error("Error", err);
  }
};

import { DynamoDB, UpdateItem$, UpdateItemCommand, type UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const config = {
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  },
  region: import.meta.env.VITE_AWS_DEFAULT_REGION
}

export const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
})

/**
 * Creates or updates an entry in the database
 * @param newData The new or updated data object
 * @returns 
 */
export async function PUT_DATA(newData: Object) {
  console.log("NEW DATA:", newData)

  const command = new PutCommand({
    TableName: "neatnest",
    Item: newData,
  });

  const response = await client.send(command);
  console.log("DATA PUT SUCCESSFUL");
  return response
};

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function GET_BY_PK_SK(pk: string, sk: string) {
  const command = new QueryCommand({
    TableName: "neatnest",
    KeyConditionExpression: "PK = :pkVal AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues:
    {
      ":pkVal": pk,
      ":skPrefix": sk
    }
  });

  const response = await client.send(command);
  if (response.Items?.length == 0) {
    return null
  } else {
    return response.Items![0]
  }
}

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function LIST_BY_PK_SK(pk: string, sk: string) {
  const command = new QueryCommand({
    TableName: "neatnest",
    KeyConditionExpression: "PK = :pkVal AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues:
    {
      ":pkVal": pk,
      ":skPrefix": sk
    }
  });

  const response = await client.send(command);
  if (response.Items?.length == 0) {
    return []
  } else {
    return response.Items
  }
}
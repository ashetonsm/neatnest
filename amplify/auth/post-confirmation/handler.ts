import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// DynamoDB
const ddbclient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbclient);

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {

  const command = new PutCommand({
    TableName: process.env.USER_TABLE,  // This stays as is, do not use import.meta.env
    Item: {
      id: event.userName, // Always the most unique value. The cognito user ID.
      owner: event.userName,
      username: event.request.userAttributes.email, // Placeholder until the user changes their username
      email: event.request.userAttributes.email,  // Could be changed in settings in the future
      itemsRemaining: 3,
      petsRemaining: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  const res = await docClient.send(command);

  console.log('processed', res);

  return event;
};
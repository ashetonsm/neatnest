import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new CognitoIdentityProviderClient();

// DynamoDB
const ddbclient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbclient);

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const addItemMakerGroup = new AdminAddUserToGroupCommand({
    GroupName: env.ITEM_MAKER,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const response1 = await client.send(addItemMakerGroup);
  console.log('processed', response1.$metadata.requestId);

  const addPetMakerGroup = new AdminAddUserToGroupCommand({
    GroupName: env.PET_MAKER,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const response2 = await client.send(addPetMakerGroup);

  // userId is redundant and can be removed.
  const command = new PutCommand({
    TableName: "User-s3tx5jmvlbbirewqb5lepfwf4e-NONE",
    Item: {
      id: event.userName,
      username: event.request.userAttributes.email,
      userId: event.userName,
      itemsRemaining: 5,
      petsRemaining: 5
    }
  });

  const response3 = await docClient.send(command);

  console.log('processed', response2.$metadata.requestId);


  return event;
};
import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const command = new AdminAddUserToGroupCommand({
    GroupName: env.ITEM_MAKER,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const command1 = new AdminAddUserToGroupCommand({
    GroupName: env.PET_MAKER,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const response = await client.send(command);
  const response1 = await client.send(command1);
  console.log('processed', response.$metadata.requestId);
  console.log('processed', response1.$metadata.requestId);
  return event;
};
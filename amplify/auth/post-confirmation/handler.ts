import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';

const client = new CognitoIdentityProviderClient();

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
  console.log('processed', response2.$metadata.requestId);


  return event;
};
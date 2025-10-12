import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../data/resource';

const client = generateClient<Schema>();

// Creates a User object
export const handler: PostConfirmationTriggerHandler = async (event) => {

  const command = await client.models.User.create(
  {
      username: event.request.userAttributes.email,
      itemsRemaining: 5,
      petsRemaining: 5,
  },
  {
    authMode: "userPool",
  }
).then(() => {
  console.log('processed', command)
})

return event

};
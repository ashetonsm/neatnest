import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.models.User.create({
      email: event.request.userAttributes.email,
      username: event.request.userAttributes.email,
      owner: `${event.request.userAttributes.sub}::${event.userName}`,
      itemsRemaining: 5,
      petsRemaining: 2
  });

  return event;
};
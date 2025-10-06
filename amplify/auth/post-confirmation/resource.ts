import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  // optionally define an environment variable for your group name
  environment: {
    ITEM_MAKER: 'ITEM_MAKER',
    PET_MAKER: 'PET_MAKER',
  },
  resourceGroupName: 'auth'
});
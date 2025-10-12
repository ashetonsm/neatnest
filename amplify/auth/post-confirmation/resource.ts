import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  // optionally define an environment variable for your group name
  environment: {
    TABLE_NAME: 'User-ofpnwhntdngzdlgy2e7wd4i5jq-NONE'
  },
  resourceGroupName: 'auth'
});
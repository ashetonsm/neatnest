import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'neatNestImageStorage',
  access: (allow) => ({
  'images/*': [
    allow.guest.to(['read']),
    allow.authenticated.to(['read', 'write', 'delete'])
  ],
})
});
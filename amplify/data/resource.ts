import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from 'amplify/auth/post-confirmation/resource';

const schema = a.schema({
  Item: a
    .model({
      name: a.string(),
      price: a.integer(),
      shopfront: a.string(),
      owner: a.string(),
      health: a.integer(),
      rarity: a.integer(),
      image: a.string()
    })
    .secondaryIndexes((index) => [
      index("name")
        .sortKeys(["owner"])
        .queryField("listItemsByNameAndOwner"),
      index("owner")
        .sortKeys(["name"])
        .queryField("listItemsByOwnerAndName"),
      index("shopfront")
        .sortKeys(["owner"])
        .queryField("listItemsByShopfrontAndOwner")
    ])
    .authorization((allow) => [
      // Guests are read only
      allow.guest().to(['read']),
      // Authenticated users can read and write (change item values)
      allow.authenticated('userPools').to(['read', 'update', 'create']),
      // Owners can delete their items
      allow.owner().to(['delete']),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  Pet: a
    .model({
      name: a.string(),
      species: a.string(),
      hunger: a.integer(),
      mood: a.integer(),
      owner: a.string(),
      health: a.integer(),
      image: a.string()
    })
    .secondaryIndexes((index) => [
      index("owner")
        .sortKeys(["name"])
        .queryField("listPetsByOwnerAndName"),
      index("species")
        .sortKeys(["name"])
        .queryField("listPetsBySpeciesAndName"),
      index("name")
        .sortKeys(["species"])
        .queryField("listPetsByNameAndSpecies")
    ])
    .authorization((allow) => [
      // Guests are read only
      allow.guest().to(['read']),
      // Authenticated users can read and write (change item values)
      allow.authenticated('userPools').to(['read', 'update', 'create']),
      // Owners can delete their pets
      allow.owner().to(['delete']),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  User: a
    .model({
      email: a.string(),
      username: a.string(),
      owner: a.string(),
      itemsRemaining: a.integer(),
      petsRemaining: a.integer()
    })
    .secondaryIndexes((index) => [
      index("username")
    ])
    .authorization((allow) => [
      // Allow owners
      allow.ownerDefinedIn("owner"),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
})
.authorization((allow) => [allow.resource(postConfirmation)])

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

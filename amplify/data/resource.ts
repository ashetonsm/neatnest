import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

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
        .sortKeys(["health", "owner", "price", "rarity", "shopfront"])
        .queryField("listItemsByName"),
      index("owner")
        .sortKeys(["health", "name", "price", "rarity", "shopfront"])
        .queryField("listItemsByOwner"),
      index("shopfront")
        .sortKeys(["health", "name", "price", "rarity", "owner"])
        .queryField("listItemsByShopfront")
    ])
    .authorization((allow) => [
      // Guests are read only
      allow.guest().to(['read']),
      // Authenticated users can read and write (change item values)
      allow.authenticated('identityPool').to(['read', 'update']),
      // Owners can read, write, and delete (change and consume items)
      allow.owner().to(['read', 'update', 'delete']),
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
        .sortKeys(["health", "hunger", "mood", "name", "species"])
        .queryField("listPetsByOwner"),
      index("name")
        .sortKeys(["health", "hunger", "mood", "owner", "species"])
        .queryField("listPetsByName")
    ])
    .authorization((allow) => [
      // Guests are read only
      allow.guest().to(['read']),
      // Authenticated users can read and write (change item values)
      allow.authenticated('identityPool').to(['read', 'update']),
      // Owners can read, write, and delete (change and consume items)
      allow.owner().to(['read', 'update', 'delete']),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  User: a
    .model({
      username: a.string(),
      userId: a.string(),
      itemsRemaining: a.integer(),
      petsRemaining: a.integer()
    })
    .secondaryIndexes((index) => [
      index("username")
        .sortKeys(["itemsRemaining", "petsRemaining", "userId"])
        .queryField("listUsersByUsername"),
      index("userId")
        .sortKeys(["itemsRemaining", "petsRemaining", "username"])
        .queryField("listUsersByUserId")
    ])
    .authorization((allow) => [
      // Guests are read only
      allow.guest().to(['read']),
      // Authenticated users can read and write (change item values)
      allow.authenticated('identityPool').to(['read', 'update']),
      // Owners can read, write, and delete (change and consume items)
      allow.owner().to(['read', 'update', 'delete']),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

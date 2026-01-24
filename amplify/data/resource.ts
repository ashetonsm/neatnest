import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Item: a
    .model({
      name: a.string(),
      price: a.integer(),
      shopId: a.string(),
      creator: a.string(),
      owner: a.string(),
      ownerId: a.string(),
      category: a.string(),
      health: a.integer(),
      rarity: a.integer(),
      image: a.string()
    })
    .secondaryIndexes((index) => [
      index("name")
        .sortKeys(["ownerId"])
        .queryField("listItemsByNameAndOwner"),
      index("ownerId")
        .sortKeys(["name"])
        .queryField("listItemsByOwnerAndName"),
      index("shopId")
        .sortKeys(["ownerId"])
        .queryField("listItemsByShopIdAndOwner")
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
      ownerId: a.string(),
      health: a.integer(),
      image: a.string()
    })
    .secondaryIndexes((index) => [
      index("ownerId")
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
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  User: a
    .model({
      email: a.string(),
      username: a.string(),
      ownerId: a.string(),
      owner: a.string(),
      description: a.string(),
      itemsRemaining: a.integer(),
      petsRemaining: a.integer(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index("username")
        .queryField("userByUsername"),
      index("email")
        .queryField("userByEmail")
    ])
    .authorization((allow) => [
      allow.authenticated('identityPool'),
      allow.authenticated('userPools'),
      // Allow owners
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  Credit: a
    .model({
      ownerId: a.string(),
      amount: a.integer(),
      owner: a.string()
    })
    .secondaryIndexes((index) => [
      index("ownerId")
        .queryField("cashByOwner")
    ])
    .authorization((allow) => [
      allow.authenticated('identityPool'),
      allow.authenticated('userPools'),
      // Allow owners
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  Friend: a
    .model({
      friendA: a.string(),
      friendB: a.string(),
      status: a.string(),
      owner: a.string()
    })
    .secondaryIndexes((index) => [
      index("friendA")
        .queryField("friendByfriendA"),
      index("friendB")
        .queryField("friendByfriendB"),
    ])
    .authorization((allow) => [
      allow.authenticated('identityPool'),
      allow.authenticated('userPools'),
      // Allow owners
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  Trade: a
    .model({
      recipient: a.string(),  // Who is receiving the pet?
      sender: a.string(),     // Who is sending the pet?
      status: a.string(),     // What is the status of this trade?
      pet: a.json(),          // The pet to be traded
      owner: a.string()
    })
    .secondaryIndexes((index) => [
      index("recipient")
        .queryField("tradeByRecipient"),
      index("sender")
        .queryField("tradeBySender")
    ])
    .authorization((allow) => [
      allow.authenticated('identityPool'),
      allow.authenticated('userPools'),
      // Allow owners
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
  Shop: a
    .model({
      name: a.string(),
      owner: a.string(),
      ownerId: a.string(),
      items: a.json()
    })
    .secondaryIndexes((index) => [
      index("ownerId")
        .queryField("shopByOwnerId"),
      index("name")
        .queryField("shopByName")
    ])
    .authorization((allow) => [
      allow.authenticated('identityPool'),
      allow.authenticated('userPools'),
      // Allow owners
      allow.owner(),
      // Users in the admin group have full permissions
      allow.groups(['admin'])
    ]),
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

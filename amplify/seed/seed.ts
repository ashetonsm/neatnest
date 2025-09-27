import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../data/resource";
import {
  addToUserGroup,
  createAndSignUpUser,
  getSecret,
  signInUser,
} from "@aws-amplify/seed";
import * as auth from "aws-amplify/auth";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);
const dataClient = generateClient<Schema>();

const username = await getSecret("username");
const password = await getSecret("password");

await signInUser({
  username: username,
  password: password,
  signInFlow: "Password",
});

const item0 = await dataClient.models.Item.create(
  {
    name: 'Rubber Duck', 
    price: 5, 
    shopfront: 'Test Emporium',
    owner: '',
    health: 100, 
    rarity: 0, 
    image: 'rubberduck'
  },
  {
    authMode: "identityPool",
  }
);

const item1 = await dataClient.models.Item.create(
  {
    name: 'Soccer Ball', 
    price: 5, 
    shopfront: 'Test Shack',
    owner: '',
    health: 100, 
    rarity: 0, 
    image: 'soccerball'
  },
  {
    authMode: "identityPool",
  }
);

const item2 = await dataClient.models.Item.create(
  {
    name: 'Cake', 
    price: 777, 
    shopfront: 'Test Emporium',
    owner: '7fields3@gmail.com',
    health: 50, 
    rarity: 0, 
    image: 'cake'
  },
  {
    authMode: "identityPool",
  }
);

const pet0 = await dataClient.models.Pet.create(
  {
    name: 'NaturalHG', 
    species: 'Human',
    hunger: 0,
    mood: 1,
    owner: '7fields3@gmail.com', 
    health: 100, 
    image: '4'
  },
  {
    authMode: "identityPool",
  }
);

const pet1 = await dataClient.models.Pet.create(
  {
    name: 'Pompom', 
    species: 'Dog',
    hunger: 5,
    mood: 5,
    owner: '7fields3@gmail.com', 
    health: 99, 
    image: '1'
  },
  {
    authMode: "identityPool",
  }
);

auth.signOut();

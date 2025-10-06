import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../data/resource";
import {
  createAndSignUpUser,
  getSecret,
  signInUser,
} from "@aws-amplify/seed";
import { defineAuth } from "@aws-amplify/backend";
import { getCurrentUser, signOut } from "aws-amplify/auth";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);
const dataClient = generateClient<Schema>();

const un = await getSecret("username");
const pw = await getSecret("password");
let currentUser;

export const auth = defineAuth({
  loginWith: {
    email: true,
  }
});

const user = await createAndSignUpUser({
  username: un,
  password: pw,
  signInAfterCreation: true,
  signInFlow: "Password"
}).then(async () => {
  const { signInDetails } = await getCurrentUser();
  currentUser = signInDetails?.loginId
}).catch(async (error) => {
  console.log("User already exists. Signing in")
  const signIn = await signInUser({
    username: un,
    password: pw,
    signInFlow: "Password"
  }).then(async () => {
      const { signInDetails } = await getCurrentUser();
    console.log("Signed in " + signInDetails?.loginId )
    currentUser = signInDetails?.loginId
  })
})


const item0 = await dataClient.models.Item.create(
  {
    name: 'Rubber Duck', 
    price: 5, 
    shopfront: 'Test Emporium',
    owner: 'NA',
    health: 100, 
    rarity: 0, 
    image: 'rubberduck'
  },
  {
    authMode: "userPool",
  }
);

const item1 = await dataClient.models.Item.create(
  {
    name: 'Soccer Ball', 
    price: 5, 
    shopfront: 'Test Shack',
    owner: 'NA',
    health: 100, 
    rarity: 0, 
    image: 'soccerball'
  },
  {
    authMode: "userPool",
  }
);

// const item2 = await dataClient.models.Item.create(
//   {
//     name: 'Cake', 
//     price: 777, 
//     shopfront: 'Test Emporium',
//     owner: currentUser,
//     health: 50, 
//     rarity: 0, 
//     image: 'cake'
//   },
//   {
//     authMode: "userPool",
//   }
// ).then((res) => {
//   console.log(res)
// })

// const pet0 = await dataClient.models.Pet.create(
//   {
//     name: 'NaturalHG', 
//     species: 'Human',
//     hunger: 0,
//     mood: 1,
//     owner: currentUser, 
//     health: 100, 
//     image: '4'
//   },
//   {
//     authMode: "userPool",
//   }
// ).then((res) => {
//   console.log(res)
// })

// const pet1 = await dataClient.models.Pet.create(
//   {
//     name: 'Pompom', 
//     species: 'Dog',
//     hunger: 5,
//     mood: 5,
//     owner: currentUser, 
//     health: 99, 
//     image: '1'
//   },
//   {
//     authMode: "userPool",
//   }
// ).then((res) => {
//   console.log(res)
// })

// const pet2 = await dataClient.models.Pet.create(
//   {
//     name: 'Retsuko', 
//     species: 'Red Panda',
//     hunger: 3,
//     mood: 1,
//     owner: 'ashetonsm@gmail.com', 
//     health: 99, 
//     image: '2'
//   },
//   {
//     authMode: "userPool",
//   }
// ).then((res) => {
//   console.log(res)
// })

signOut();

import type { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";

const client = generateClient<Schema>()

export function createPet(
    name:string, 
    species:string, 
    imgPath:string, 
    userID:string, 
    userObj: any
) {
    // Query for the canvas
    const canvas = document.querySelector('canvas')

    // Try uploading the image
    try {
        canvas!.toBlob(async (blob) => {
            try {
            const result = await uploadData({
                path: imgPath,
                data: blob!,
                options: {
                contentType: 'image/png'
                }
            }).result;
            console.log('Succeeded: ', result);
            } catch (error) {
            console.log('Error : ', error);
            }
    
        }, 'image/png')

        // Try creating a new Item
        try {
          client.models.Pet.create({
            name: name,
            species: species,
            hunger: 0,
            mood: 5,
            owner: userID,
            health: 100,
            image: imgPath
          }).then((res) => {
            // Update the user by decreasing petsRemaining by 1 if petsRemaining > 0
            var updatedUser = userObj
            // Subtract 1 from petsRemaining
            updatedUser.petsRemaining = updatedUser.petsRemaining - 1
            // Update the updatedAt time for the User
            updatedUser.updatedAt = new Date().toISOString()

            client.models.User.update(updatedUser)
              .then((res) => {
                console.log(res)
              })
            console.log(res)
          });
        } catch (error : any) {
          console.log(error)
        }
    
    } catch (e: any) {
        console.log("Error: ", e)
    } 
}
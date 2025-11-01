import type { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";

const client = generateClient<Schema>()

export function createItem(
  name:string, 
  imgPath:string, 
  itemCat:string, 
  userID:string, 
  userObj: any) {
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
          client.models.Item.create({
            name: name,
            category: itemCat,
            price: 1,
            shopfront: "NA",
            owner: userID,
            health: 1,
            rarity: 1,
            image: imgPath
          }).then((res) => {
            // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0
            var updatedUser = userObj
            // Subtract 1 from itemsRemaining
            updatedUser.itemsRemaining = updatedUser.itemsRemaining - 1
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
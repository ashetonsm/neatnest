import router from "@/router";
import { uploadData } from "./s3Actions";

export function createItem(
  name: string,
  imgPath: string,
  itemCat: string,
  userID: string,
) {
  // Query for the canvas
  const canvas = document.querySelector('canvas')

  // Try uploading the image
  try {
    canvas!.toBlob(async (blob) => {
      try {
        const result = (await uploadData(imgPath, blob));
        
        if (result && result.$metadata.httpStatusCode == 200) {
          console.log('Uploaded succeeded');
        } else {
          console.log('Something went wrong with the upload.');
        }
      } catch (error) {
        console.log('Error : ', error);
      }

    }, 'image/png')

    // Try creating a new Item
    try {
      /*
      client.models.Item.create({
        name: name,
        category: itemCat,
        price: 1,
        shopId: "NA",
        creator: userID,
        ownerId: userID,
        health: 99,
        rarity: 1,
        image: imgPath
      }).then(() => {
        // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0
        var updatedUser = userObj
        // Subtract 1 from itemsRemaining
        updatedUser.itemsRemaining = updatedUser.itemsRemaining - 1
        // Update the updatedAt time for the User
        updatedUser.updatedAt = new Date().toISOString()

        client.models.User.update(updatedUser)
          .then((res: any) => {
            console.log("User updated: ", res)
          })
          .then(() => {
            router.push({ name: 'inventory' })
            router.go(1)
          })
      });
      */
    } catch (error: any) {
      console.log(error)
    }

  } catch (e: any) {
    console.log("Error: ", e)
  }
}
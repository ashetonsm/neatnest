import router from "@/router";
import { uploadData } from "./s3Actions";
import { PUT_DATA } from "./ddbActions";

export async function createItem(
  name: string,
  imgPath: string,
  itemCat: string,
  userObj: any,
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
      await PUT_DATA({
        PK: userObj.PK,
        SK: `ITEM#${itemCat}#${name}`,
        creator: userObj.PK,
        name: name,
        owner: userObj.PK,
        health: 99,
        selling: false,
        tradeStatus: 0,
        image: imgPath,
        category: itemCat,
        price: 0,
        type: 'Item',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
        .then(async () => {
          // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0
          var updatedUser = userObj
          // Subtract 1 from itemsRemaining
          updatedUser.itemsRemaining = updatedUser.itemsRemaining - 1
          // Update the updatedAt time for the User
          updatedUser.updatedAt = new Date().toISOString()
          await PUT_DATA(updatedUser)
        })
        .then(() => {
          router.push({ name: 'inventory' })
          router.go(1)
        });
    } catch (error: any) {
      console.error(error)
    }

  } catch (e: any) {
    console.error("Error: ", e)
  }
}
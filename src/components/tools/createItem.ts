import router from "@/router";
import { UPLOAD_OBJECT } from "./s3Actions";
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
    if (canvas) {
      await UPLOAD_OBJECT(imgPath, canvas.toDataURL())
        .then(async (res) => {
          if (res.statusCode == 200) {
            // Try creating a new Item
            await PUT_DATA({
              PK: userObj.PK,
              SK: `ITEM#${itemCat}#${name}`,
              creator: userObj.PK,
              name: name,
              owner: userObj.PK,
              health: 99,
              selling: false,
              status: 0,
              url: imgPath,
              category: itemCat,
              price: 0,
              type: 'Item',
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
            })
              .then(async () => {
                // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0
                var updatedUser = userObj
                // Subtract 1 from itemsRemaining
                updatedUser.itemsRemaining = updatedUser.itemsRemaining - 1
                // Update the updatedAt time for the User
                updatedUser.updatedAt = new Date().getTime()
                await PUT_DATA(updatedUser)
                  .then(() => {
                    router.push({ name: 'inventory' })
                    router.go(1)
                  })
              });
          }
        })
    }
  } catch (e: any) {
    console.error("Error: ", e)
  }
}
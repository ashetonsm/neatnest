import router from '@/router'
import { UPLOAD_OBJECT } from "./s3Actions";
import { PUT_DATA } from "./ddbActions";

export async function createPet(
  name: string,
  imgPath: string,
  species: string,
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
            // Try creating a new Pet
            await PUT_DATA({
              PK: userObj.PK,
              SK: `PET#${species}#${name}`,
              creator: userObj.PK,
              name: name,
              owner: userObj.PK,
              health: 100,
              hunger: 5,
              mood: 0,
              status: 0,
              url: imgPath,
              type: 'Pet',
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
            })
              .then(async () => {
                // Update the user by decreasing petsRemaining by 1 if petsRemaining > 0
                var updatedUser = userObj
                // Subtract 1 from petsRemaining
                updatedUser.petsRemaining = updatedUser.petsRemaining - 1
                // Update the updatedAt time for the User
                updatedUser.updatedAt = new Date().getTime()
                await PUT_DATA(updatedUser)
                  .then(() => {
                    router.push({ name: 'pets' })
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
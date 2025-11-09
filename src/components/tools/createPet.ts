import { uploadData } from "aws-amplify/storage";
import router from '@/router'

export function createPet(
  name: string,
  species: string,
  imgPath: string,
  userID: string,
  userObj: any,
  client: any
) {
  if ((userObj.itemsRemaining - 1) < 0) {
    // Make sure creation won't put the user into negative numbers.
    console.log("Insufficient itemsRemaining. Aborting process.")
    return
  } else {
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
        }).then(() => {
          // Update the user by decreasing petsRemaining by 1 if petsRemaining > 0
          var updatedUser = userObj
          // Subtract 1 from petsRemaining
          updatedUser.petsRemaining = updatedUser.petsRemaining - 1
          // Update the updatedAt time for the User
          updatedUser.updatedAt = new Date().toISOString()

          client.models.User.update(updatedUser)
            .then((res: any) => {
              console.log("User updated: ", res)
            })
            .then(() => {
              router.push({ name: 'pets' })
              router.go(1)
            })
        });
      } catch (error: any) {
        console.log(error)
      }

    } catch (e: any) {
      console.log("Error: ", e)
    }
  }
}
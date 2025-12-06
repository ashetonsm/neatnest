import { remove } from "aws-amplify/storage";

export async function deleteStorage(
  destination: string,
) {
  try {
    await remove({
      path: destination,
    }).then((res) => {
      console.log("Removed: ", res)
    })
  } catch (error) {
    console.log('Error ', error);
  }

}
import { createNotification } from "@/components/notifications/createNotification";
import { UPDATE_RELATIONSHIP } from "./ddbActions";

/** Used to block and accept friends */
export async function updateFriend(
    targetUser: any, 
    currentUser: any, 
    action: string
) {
  await UPDATE_RELATIONSHIP(targetUser, currentUser, action)
    .then(async () => {
      if (action == "add") {
        await createNotification(currentUser, targetUser, "friendNew")
      }
      if (action == "accept") {
        await createNotification(currentUser, targetUser, "friendAccept")
      }
    })
}
import { PUT_DATA } from "@/components/tools/ddbActions"

export async function createNotification(
  currentUser: any,
  interactingUser: any,
  notificationType: string,
) {
  try {

    var notificationContent = "";
    var url = "";
    var title = notificationType;

    switch (notificationType) {
      case "friendNew":
        notificationContent = `${currentUser.username} sent you a friend request!`
        url = "/friends"
        title = "Friend Request"
        break;
      case "friendAccept":
        // This notif should be currentUser.username going out to interactingUser
        notificationContent = `${currentUser.username} accepted your friend request!`
        url = "/friends"
        title = "Friend Request Accepted"
        break;
      case "tradeNew":
        notificationContent = `${currentUser.username} sent you a trade request!`
        url = "/trades"
        title = "Trade Request"
        break;
      case "tradeAccept":
        // This notif should be currentUser.username going out to interactingUser
        notificationContent = `${currentUser.username} accepted your trade request!`
        url = "/trades"
        title = "Trade Request Accepted"
        break;
      case "tradeReject":
        // This notif should be currentUser.username going out to interactingUser
        notificationContent = `${currentUser.username} rejected your trade request!`
        url = "/trades"
        title = "Trade Request Rejected"
        break;
      case "addedPetCredit":
        notificationContent = `You can create one new pet! Pets remaining: ${currentUser.petsRemaining}`
        url = "/pets"
        title = "Pet Creation Credit Added"
        break;
      case "addedItemCredit":
        notificationContent = `You can create one new item! Items remaining: ${currentUser.itemsRemaining}`
        url = "/inventory"
        title = "Item Creation Credit Added"
        break;
      default:
        console.error("Invalid notification type.")
        break;
    }

    const notificationID = new Date().getTime()
    await PUT_DATA({
      PK: interactingUser ? interactingUser.PK : currentUser.PK,
      SK: `NOTIFICATION#${notificationID}`,
      id: notificationID,
      title: title,
      content: notificationContent,
      url: url,
      type: 'Notification',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    })
  } catch (error: any) {
    console.error("Something went wrong creating a notification:", error)
  }
}
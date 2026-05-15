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
        notificationContent = `${interactingUser.username} sent you a friend request!`
        url = "/friends"
        title = "Friend Request"
        break;
      case "friendAccept":
        notificationContent = `${interactingUser.username} accepted your friend request!`
        url = "/friends"
        title = "Friend Request Accepted"
        break;
      case "tradeNew":
        notificationContent = `${interactingUser.username} sent you a trade request!`
        url = "/trades"
        title = "Trade Request"
        break;
      case "tradeAccept":
        notificationContent = `${interactingUser.username} accepted your trade request!`
        url = "/trades"
        title = "Trade Request Accepted"
        break;
      case "tradeReject":
        notificationContent = `${interactingUser.username} rejected your trade request!`
        url = "/trades"
        title = "Trade Request Rejected"
        break;
      default:
        console.error("Invalid notification type.")
        break;
    }

    const notificationID = new Date().toISOString()
    await PUT_DATA({
      PK: currentUser.PK,
      SK: `NOTIFICATION#${notificationID}`,
      id: notificationID,
      title: title,
      content: notificationContent,
      url: url,
      type: 'Notification',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Something went wrong creating a notification:", error)
  }
}
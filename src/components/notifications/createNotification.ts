import { PUT_DATA } from "@/components/tools/ddbActions"

export async function createNotification(
  currentUser: any,
  interactingUser: any,
  notificationType: string,
) {
  try {

    var notificationContent = "";
    var url = "";

    switch (notificationType) {
      case "friendRequest":
        notificationContent = `${interactingUser.username} sent you a friend request!`
        url = "/friends"
        break;
      case "tradeRequest":
        notificationContent = `${interactingUser.username} sent you a trade request!`
        url = "/trades"
        break;
      case "tradeRejection":
        notificationContent = `${interactingUser.username} rejected your trade request!`
        url = "/trades"
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
      title: notificationType,
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
import { DeleteItemCommand, DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const config = {
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  },
  region: import.meta.env.VITE_AWS_DEFAULT_REGION
}

export const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
})

/**
 * Creates or updates an entry in the database
 * @param newData The new or updated data object
 * @returns 
 */
export async function PUT_DATA(newData: Object) {
  console.log("NEW DATA:", newData)

  const command = new PutCommand({
    TableName: "neatnest",
    Item: newData,
  });

  const response = await client.send(command);
  console.log("DATA PUT SUCCESSFUL");
  return response
};

/**
 * Creates or updates a friend in the #RELATIONSHIPS entry for the user
 * 0 = pending for the target
 * 1 = accepted
 * 2 = blocked for the target
 * 8 = blocked for the initiator
 * 9 = pending for the initiator
 * @param targetFriend The user who is updating a relationship 
 * @param initiatingFriend The user who initiated the relationship
 * @param newData The action being performed on the relationship
 * @returns 
 */
export async function UPDATE_FRIEND(targetFriend: any, initiatingFriend: any, updateType: string) {
  var initiatingRel = {}
  var targetRel = {}

  try {


    var command1 = new PutCommand({
      TableName: undefined,
      Item: undefined,
    });
    var command2 = new PutCommand({
      TableName: undefined,
      Item: undefined,
    });

    switch (updateType) {
      case "add":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `RELATIONSHIP#${targetFriend.PK}`,
          status: 9,
          type: 'Relationship',
          username: initiatingFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `RELATIONSHIP#${initiatingFriend.PK}`,
          status: 0,
          type: 'Relationship',
          username: targetFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        command1 = new PutCommand({
          TableName: "neatnest",
          Item: initiatingRel,
        });
        command2 = new PutCommand({
          TableName: "neatnest",
          Item: targetRel,
        });
        break
      case "accept":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `RELATIONSHIP#${targetFriend.PK}`,
          status: 1,
          type: 'Relationship',
          username: initiatingFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `RELATIONSHIP#${initiatingFriend.PK}`,
          status: 1,
          type: 'Relationship',
          username: targetFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        command1 = new PutCommand({
          TableName: "neatnest",
          Item: initiatingRel,
        });
        command2 = new PutCommand({
          TableName: "neatnest",
          Item: targetRel,
        });
        break
      case "remove":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `RELATIONSHIP#${targetFriend.PK}`
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `RELATIONSHIP#${initiatingFriend.PK}`
        }

        await DELETE_DATA(initiatingRel)
          .then((res) => {
            console.log("Delete initiatingRel: ", res)
          })
        await DELETE_DATA(targetRel)
          .then((res) => {
            console.log("Delete targetRel: ", res)
          })
        return
      case "reject":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `RELATIONSHIP#${targetFriend.PK}`
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `RELATIONSHIP#${initiatingFriend.PK}`
        }

        await DELETE_DATA(initiatingRel)
          .then((res) => {
            console.log("Delete initiatingRel: ", res)
          })
        await DELETE_DATA(targetRel)
          .then((res) => {
            console.log("Delete targetRel: ", res)
          })
        return
      case "block":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `RELATIONSHIP#${targetFriend.PK}`,
          status: 2,
          type: 'Relationship',
          username: initiatingFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `RELATIONSHIP#${initiatingFriend.PK}`,
          status: 8,
          type: 'Relationship',
          username: targetFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        command1 = new PutCommand({
          TableName: "neatnest",
          Item: initiatingRel,
        });
        command2 = new PutCommand({
          TableName: "neatnest",
          Item: targetRel,
        });
        break
      default:
        console.error("Invalid updateType")
    }

    if (command1.input.TableName !== undefined && command2.input.TableName !== undefined) {
      await client.send(command1)
        .then((res) => {
          console.log("Command1: ", res)
        })
      await client.send(command2)
        .then((res) => {
          console.log("Command2: ", res)
        })
    }
  } catch (error: any) {
    console.error("Error: ", error)
  }
  return
}

/**
 * Creates or updates a trade in the TRADES entry for the user
 * 0 = pending for the target
 * 1 = accepted
 * 9 = pending for the initiator
 * @param targetFriend The user who is being tradeded with
 * @param initiatingFriend The user who initiated the trade
 * @param newData The action being performed on the trade
 * @returns 
 */
export async function UPDATE_TRADE(targetFriend: any, initiatingFriend: any, updateType: string) {
  var initiatingRel = {}
  var targetRel = {}

  try {
    var command1 = new PutCommand({
      TableName: undefined,
      Item: undefined,
    });
    var command2 = new PutCommand({
      TableName: undefined,
      Item: undefined,
    });

    switch (updateType) {
      case "create":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `TRADE#${targetFriend.PK}`,
          status: 9,
          type: 'Trade',
          username: initiatingFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `TRADE#${initiatingFriend.PK}`,
          status: 0,
          type: 'Trade',
          username: targetFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        command1 = new PutCommand({
          TableName: "neatnest",
          Item: initiatingRel,
        });
        command2 = new PutCommand({
          TableName: "neatnest",
          Item: targetRel,
        });
        break
      case "accept":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `TRADE#${targetFriend.PK}`,
          status: 1,
          type: 'Trade',
          username: initiatingFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `TRADE#${initiatingFriend.PK}`,
          status: 1,
          type: 'Trade',
          username: targetFriend.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        command1 = new PutCommand({
          TableName: "neatnest",
          Item: initiatingRel,
        });
        command2 = new PutCommand({
          TableName: "neatnest",
          Item: targetRel,
        });
        break
      case "remove":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `TRADE#${targetFriend.PK}`
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `TRADE#${initiatingFriend.PK}`
        }

        await DELETE_DATA(initiatingRel)
          .then((res) => {
            console.log("Delete initiatingRel: ", res)
          })
        await DELETE_DATA(targetRel)
          .then((res) => {
            console.log("Delete targetRel: ", res)
          })
        return
      case "reject":
        initiatingRel = {
          PK: initiatingFriend.PK,
          SK: `TRADE#${targetFriend.PK}`
        }
        targetRel = {
          PK: targetFriend.PK,
          SK: `TRADE#${initiatingFriend.PK}`
        }

        await DELETE_DATA(initiatingRel)
          .then((res) => {
            console.log("Delete initiatingRel: ", res)
          })
        await DELETE_DATA(targetRel)
          .then((res) => {
            console.log("Delete targetRel: ", res)
          })
        return
      default:
        console.error("Invalid updateType")
    }

    if (command1.input.TableName !== undefined && command2.input.TableName !== undefined) {
      await client.send(command1)
        .then((res) => {
          console.log("Command1: ", res)
        })
      await client.send(command2)
        .then((res) => {
          console.log("Command2: ", res)
        })
    }
  } catch (error: any) {
    console.error("Error: ", error)
  }
  return
}


/**
 * Deletes an entry in the database
 * @param newData The new or updated data object
 * @returns 
 */
export async function DELETE_DATA(newData: any) {

  const command = {
    TableName: "neatnest",
    Key: {
      PK: { S: newData.PK as string },
      SK: { S: newData.SK as string }
    },
  };

  const response = await client.send(new DeleteItemCommand(command));
  console.log("DATA DELETION SUCCESSFUL");
  return response
};

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function GET_BY_PK_SK(pk: string, sk: string) {
  const command = new QueryCommand({
    TableName: "neatnest",
    KeyConditionExpression: "PK = :pkVal AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues:
    {
      ":pkVal": pk,
      ":skPrefix": sk
    }
  });

  const response = await client.send(command);
  if (response.Items?.length == 0) {
    return null
  } else {
    return response.Items![0]
  }
}

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param un Primary Key (the username)
 * @returns 
 */
export async function GET_BY_USERNAME(un: string, SK?: string) {
  const command = new QueryCommand({
    TableName: "neatnest",
    IndexName: "Username",
    KeyConditionExpression: "username = :unVal AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues:
    {
      ":unVal": un,
      ":skPrefix": SK || "",
    }
  });

  const response = await client.send(command);
  if (response.Items?.length == 0) {
    return null
  } else {
    return response.Items![0]
  }
}

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function LIST_BY_PK_SK(pk: string, sk: string) {
  const command = new QueryCommand({
    TableName: "neatnest",
    KeyConditionExpression: "PK = :pkVal AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues:
    {
      ":pkVal": pk,
      ":skPrefix": sk
    }
  });

  const response = await client.send(command);
  if (response.Items?.length == 0) {
    return []
  } else {
    return response.Items
  }
}
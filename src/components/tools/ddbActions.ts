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
 * Creates or updates a relationship in the #RELATIONSHIPS entry for the user
 * 0 = pending for the target
 * 1 = accepted
 * 2 = blocked for the target
 * 8 = blocked for the initiator
 * 9 = pending for the initiator
 * @param targetRelationship The user who is updating a relationship 
 * @param initiatingRelationship The user who initiated the relationship
 * @param newData The action being performed on the relationship
 * @returns 
 */
export async function UPDATE_RELATIONSHIP(targetRelationship: any, initiatingRelationship: any, updateType: string) {
  var initiatingRel = {
    PK: initiatingRelationship.PK,
    SK: `RELATIONSHIP#${targetRelationship.PK}`,
    status: 0,	// to be changed
    type: 'Relationship',
    relationshipUsername: targetRelationship.username,
    username: initiatingRelationship.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  var targetRel = {
    PK: targetRelationship.PK,
    SK: `RELATIONSHIP#${initiatingRelationship.PK}`,
    status: 0,	// to be changed
    type: 'Relationship',
    relationshipUsername: initiatingRelationship.username,
    username: targetRelationship.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    switch (updateType) {
      case "add":
        initiatingRel.status = 9
        targetRel.status = 0
        break
      case "accept":
        initiatingRel.status = 1
        targetRel.status = 1
        break
      case "remove":
        const initiatingRelDelete = {
          PK: initiatingRelationship.PK,
          SK: `RELATIONSHIP#${targetRelationship.PK}`
        }
        const targetRelDelete = {
          PK: targetRelationship.PK,
          SK: `RELATIONSHIP#${initiatingRelationship.PK}`
        }

        await DELETE_DATA(initiatingRelDelete)
          .then((res) => {
            console.log("Delete initiatingRel: ", res)
          })
        await DELETE_DATA(targetRelDelete)
          .then((res) => {
            console.log("Delete targetRel: ", res)
          })
        return
      case "block":
        initiatingRel.status = 2
        targetRel.status = 8
        break
      default:
        console.error("Invalid updateType")
        return
    }

    const command1 = new PutCommand({
      TableName: "neatnest",
      Item: initiatingRel,
    });
    const command2 = new PutCommand({
      TableName: "neatnest",
      Item: targetRel,
    });

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
 * 0 = Pending for the target
 * 1 = Accepted (If both entries are status 1, close the trade)
 * 2 = Rejected (if both entries are status 2, close the trade)
 * 8 = Closed
 * 9 = Pending for the initiator
 * @param targetTrader The user who is being tradeded with (their relationship record)
 * @param initiatingTrader The user who initiated the trade
 * @param updateType The action being performed on the trade
 * @returns 
 */
export async function UPDATE_TRADE(targetTrader: any, initiatingTrader: any, tradeContents: any, updateType: string) {
  var initiatingTrade = {
    PK: initiatingTrader.PK,
    SK: `TRADE#${targetTrader.PK}`,
    status: 0,	// to be changed
    type: 'Trade',
    tradeUsername: targetTrader.relationshipUsername,
    tradeContents: tradeContents,
    username: initiatingTrader.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  var targetTrade = {
    PK: targetTrader.PK,
    SK: `TRADE#${initiatingTrader.PK}`,
    status: 0,	// to be changed
    type: 'Trade',
    tradeUsername: initiatingTrader.username,
    tradeContents: tradeContents,
    username: targetTrader.relationshipUsername,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    switch (updateType) {
      case "create":
        initiatingTrade.status = 9
        targetTrade.status = 0
        break
      case "accept":
        initiatingTrade.status = 1
        // targetTrade.status = 1
        break
      case "reject":
        initiatingTrade.status = 2
        // targetTrade.status = 2
        break
      case "close":
        initiatingTrade.status = 8
        targetTrade.status = 8
        break
      case "remove":
        const initiatingTradeDelete = {
          PK: initiatingTrader.PK,
          SK: `TRADE#${targetTrader.PK}`
        }
        const targetTradeDelete = {
          PK: targetTrader.PK,
          SK: `TRADE#${initiatingTrader.PK}`
        }

        await DELETE_DATA(initiatingTradeDelete)
          .then((res) => {
            console.log("Delete initiatingTrade: ", res)
          })
        await DELETE_DATA(targetTradeDelete)
          .then((res) => {
            console.log("Delete targetTrade: ", res)
          })
        return
      default:
        console.error("Invalid updateType")
        return
    }

    const command1 = new PutCommand({
      TableName: "neatnest",
      Item: initiatingTrade,
    });
    const command2 = new PutCommand({
      TableName: "neatnest",
      Item: targetTrade,
    });

    console.log("command1.input", command1.input)
    console.log("command2.input", command2.input)
    await client.send(command1)
      .then((res) => {
        console.log("Command1: ", res)
      })
    await client.send(command2)
      .then((res) => {
        console.log("Command2: ", res)
      })
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
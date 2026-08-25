import { DeleteItemCommand, DynamoDB } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";

export const config = {
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  },
  region: import.meta.env.VITE_AWS_DEFAULT_REGION
}

const tableName = import.meta.env.VITE_DYNAMODB_TABLE

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
  try {
    return fetch(encodeURI(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/ddb`), 
    {
      method: 'PUT',
      body: JSON.stringify(newData)
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
};

/**
 * Writes or deletes multiple items in the database in one request with the follow array format:
 * [
 *    {PutRequest/DeleteRequest: {Item: data}}, 
 *    {PutRequest/DeleteRequest: {Item: data}}, 
 *    etc
 * ]
 * @param newData The array of new data objects to be written or deleted
 * @returns 
 */
export async function BATCH_MODIFY_DATA(newData: Array<any>) {
  try {
    const command = new BatchWriteCommand({
      RequestItems: { [tableName]: newData },
      ReturnConsumedCapacity: "TOTAL"
    });
    const response = await client.send(command);
    return response
  } catch (error: any) {
    console.error("Something went wrong with the BATCH_MODIFY_DATA request:", error)
  }
}

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
    relationshipUsername: targetRelationship.relationshipUsername,
    username: initiatingRelationship.username,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }
  var targetRel = {
    PK: targetRelationship.PK,
    SK: `RELATIONSHIP#${initiatingRelationship.PK}`,
    status: 0,	// to be changed
    type: 'Relationship',
    relationshipUsername: initiatingRelationship.username,
    username: targetRelationship.relationshipUsername,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
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
        await DELETE_DATA(targetRelDelete)
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
      TableName: tableName,
      Item: initiatingRel,
    });
    const command2 = new PutCommand({
      TableName: tableName,
      Item: targetRel,
    });

    if (command1.input.TableName !== undefined && command2.input.TableName !== undefined) {
      await client.send(command1)
      await client.send(command2)
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
 * @param tradeContents The contents of the trade.
 * {
 *    pets: [],
 *    items: [],
 *    credits: number
 * }
 * @param updateType The action being performed on the trade
 * @returns 
 */
export async function UPDATE_TRADE(targetTrader: any, initiatingTrader: any, tradeContents: any, updateType: string) {
  var initiatingTrade = {
    PK: initiatingTrader.PK,
    SK: `TRADE#${targetTrader.PK}`,
    status: 0,	// to be changed
    type: 'Trade',
    tradeUsername: targetTrader.tradeUsername,
    tradeContents: tradeContents,
    username: initiatingTrader.username,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }
  var targetTrade = {
    PK: targetTrader.PK,
    SK: `TRADE#${initiatingTrader.PK}`,
    status: 0,	// to be changed
    type: 'Trade',
    tradeUsername: initiatingTrader.username,
    tradeContents: tradeContents,
    username: targetTrader.tradeUsername,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }

  try {
    switch (updateType) {
      case "create":
        initiatingTrade.status = 9
        targetTrade.status = 0
        break
      case "accept":
        initiatingTrade.status = 1
        targetTrade.status = 1

        var petPutList: { PutRequest: { Item: any; }; }[] = []
        var petDeleteList: { DeleteRequest: { Key: any; }; }[] = []
        var itemPutList: { PutRequest: { Item: any; }; }[] = []
        var itemDeleteList: { DeleteRequest: { Key: any; }; }[] = []
        var creditPutList: { PutRequest: { Item: any; }; }[] = []
        if (tradeContents[0].pets.length > 0) {
          // Format a PutRequest for the batch command
          // Set the PK and owner data correctly
          tradeContents[0].pets.forEach((item: any) => {
            // First, add the original item to the batch delete list.
            // We must use the targetTrader's (AKA the trade creator to the accepting user) 
            // PK as the original PK because this is inside of a for loop
            // where the PK will get overwritten at the end of this push.
            petDeleteList.push(
              {
                DeleteRequest: {
                  Key: {
                    "PK": targetTrader.PK,
                    "SK": item.SK
                  }
                }
              }
            )
            // Then, edit the item and add it to the batch put list.
            item.PK = initiatingTrader.PK
            item.owner = initiatingTrader.PK
            petPutList.push({ PutRequest: { Item: item } })
          });
          // Create new data
          await BATCH_MODIFY_DATA(petPutList)
          // Delete old data
          await BATCH_MODIFY_DATA(petDeleteList)
        }

        if (tradeContents[1].items.length > 0) {
          // Format a PutRequest for the batch command
          // Set the PK and owner data correctly
          tradeContents[1].items.forEach((item: any) => {
            // First, add the original item to the batch delete list.
            itemDeleteList.push(
              {
                DeleteRequest: {
                  Key: {
                    "PK": targetTrader.PK,
                    "SK": item.SK
                  }
                }
              }
            )
            // Then, edit the item and add it to the batch put list.
            item.PK = initiatingTrader.PK
            item.owner = initiatingTrader.PK
            itemPutList.push({ PutRequest: { Item: item } })
          });
          // Create new data
          await BATCH_MODIFY_DATA(itemPutList)
          // Delete old data
          await BATCH_MODIFY_DATA(itemDeleteList)
        }

        if (tradeContents[2].credits > 0) {
          // In this case, the TARGET is the one who STARTED the trade. They're LOSING credits.
          var fullTargetTrader = await GET_BY_USERNAME(targetTrader.tradeUsername, "%23METADATA")
		  
          // In this case, the INITIATOR is the one who's APPROVING the trade. They're GAINING credits.
          // I know, this is all very backwards and I'm confused but it works now.
          var updatedInitiatingTrader = initiatingTrader

          fullTargetTrader!.credits = fullTargetTrader!.credits - tradeContents[2].credits
          updatedInitiatingTrader.credits = updatedInitiatingTrader.credits + tradeContents[2].credits
          console.log("updatedInitiatingTrader", updatedInitiatingTrader)
          console.log("fullTargetTrader", fullTargetTrader)
          creditPutList.push({ PutRequest: { Item: updatedInitiatingTrader } })
          creditPutList.push({ PutRequest: { Item: fullTargetTrader } })
          await BATCH_MODIFY_DATA(creditPutList)
        }
        break
      case "reject":
        initiatingTrade.status = 2
        targetTrade.status = 2
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
        await DELETE_DATA(targetTradeDelete)
        return
      default:
        console.error("Invalid updateType")
        return
    }

    const command1 = new PutCommand({
      TableName: tableName,
      Item: initiatingTrade,
    });
    const command2 = new PutCommand({
      TableName: tableName,
      Item: targetTrade,
    });
    await client.send(command1)
    await client.send(command2)
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
    TableName: tableName,
    Key: {
      PK: { S: newData.PK as string },
      SK: { S: newData.SK as string }
    },
  };
  const response = await client.send(new DeleteItemCommand(command));
  return response
};

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function GET_BY_PK_SK(pk: string, sk: string) {
  const encodedURI = encodeURI(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/ddb?PK=${pk}&SK=${sk}`)
  try {
    return fetch((encodedURI), 
    {
      method: 'GET',
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
}

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param un Primary Key (the username)
 * @returns 
 */
export async function GET_BY_USERNAME(un: string, sk?: string) {
  try {
    return fetch(encodeURI(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/ddb?username=${un}&SK=${sk}`), 
    {
      method: 'GET',
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
}

/**
 * Remember that the KeyConditionExpression is CASE SENSITIVE. Lowercase "PK"/"SK" will not work.
 * @param pk Primary Key (the userID)
 * @param sk Sort Key (the item type)
 * @returns 
 */
export async function LIST_SELLING_BY_PK(pk: string) {
  try {
    return fetch(encodeURI(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/ddb?PK=${pk}&selling`), 
    {
      method: 'GET',
    })
    .then(async (response) => {
        return response.json()
    })
  } catch (error) {
    console.error(error);
  }
}
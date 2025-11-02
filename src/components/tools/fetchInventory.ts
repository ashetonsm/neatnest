import { generateClient } from "aws-amplify/data"
import type { Schema } from "amplify/data/resource"

const client = generateClient<Schema>()

export async function fetchInventory(currentUser: any, fetchedItems: any): Promise<any> {
  const cachedItems = localStorage.getItem('inventory')
  if (cachedItems) {
    console.log("Cached inventory found.")
    fetchedItems.value = JSON.parse(cachedItems)
  } else {
    console.log("No cached inventory found, querying database.")
    await client.models.Item.listItemsByOwnerAndName(
      {
        owner: currentUser
      },
      {
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Content-Type': 'application/json',
        },
        authMode: 'userPool'
      }
    )
      .then((res: { data: any; }) => {
        localStorage.setItem('inventory', JSON.stringify(res.data))
        fetchedItems.value = res.data
        return fetchedItems.value
      })
      .catch((error: any) => {
        console.log("No items found for this user.")
        fetchedItems.value = []
        return fetchedItems.value
      });
  }

}
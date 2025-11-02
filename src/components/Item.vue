<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { onMounted, ref } from "vue";

const client = generateClient<Schema>(); // use this Data client for CRUDL requests
const signedSrc = ref("null");

const props = defineProps<{
  item: Schema["Item"]["type"];
  currentUser: string;
}>();

async function buyFlow(i: Schema["Item"]["type"]) {
  const choice = confirm("Buy " + i.name + " for " + i.price + "?");
  if (choice) {
    // Set the owner to the signed in user
    i.owner = props.currentUser;

    // send the update request
    await await client.models.Item.update(i).then((res) => {
      console.log(res);
    });
  } else {
    return console.log(choice);
  }
}

async function getFileUrl(fileName: any) {
  try {
    const result = await getUrl({
      path: fileName, // Adjust path as needed (e.g., private/, protected/)
      options: {
        expiresIn: 3600, // URL valid for 1 hour
        validateObjectExistence: true,
      },
    });
    signedSrc.value = result.url.toString();
  } catch (error) {
    console.error("Error getting URL:", error);
    return null;
  }

  return;
}

function useFlow(i: Schema["Item"]["type"]) {
  const choice = confirm("Use " + i.name + "?");
  if (choice) {
    // Do use logic
    return console.log(choice);
  } else {
    return console.log(choice);
  }
}

onMounted(async () => {
  await getFileUrl(props.item.image);
});
</script>

<template>
  <div class="item-container box">
    <div class="item-info">
      <img
        :src="signedSrc"
        :alt="'an image of ' + item.name"
        class="item-image"
        @click="item.owner == 'NA' ? buyFlow(item) : useFlow(item)"
      />

      <h2 class="green">{{ item.name }}</h2>
      <h2>Price:</h2>
      <h2 class="green">{{ item.price }}</h2>
    </div>
  </div>
</template>

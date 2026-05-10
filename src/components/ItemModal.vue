<script setup lang="ts">
import router from "@/router";
import { PUT_DATA } from "./tools/ddbActions";
import { ref } from "vue";

const props = defineProps<{
  item: any;
}>();

const price = ref(props.item.price)
const itemForm = ref()


async function toggleSell(i: any, action: string) {
  var updatedItem = i;
  try {
    switch (action) {
      case "add":
        // Change the item to Selling = true
        updatedItem.selling = true;
        break;

      case "remove":
        updatedItem.selling = false;
        break;
      default:
        console.log("Invalid action.");
        break;
    }

    await PUT_DATA(updatedItem)
      .then((res: any) => {
      })
      .then(() => {
        // Refresh
        router.go(0);
      });
  } catch (error) {
    console.error(error);
  }
}

async function setPrice() {
  var updatedItem = props.item;
  try {
    updatedItem.price = price

    await PUT_DATA(updatedItem)
      .then((res: any) => {
      })
      .then(() => {
        // Refresh
        router.go(0);
      });
  } catch (error) {
    console.error(error);
  }
}



/**
 * Can't trade with someone you blocked
 */
async function validateItem() {
    const { valid } = await itemForm.value.validate()

    if (valid) alert('Item is valid')
    try {
        setPrice()
    } catch (error: any) {
        console.error(error);
    }
}

</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title>What would you like to do with "{{ item.name }}"?</v-card-title>
      <v-card-actions>
        <v-btn
          @click="
            item.selling !== true ? toggleSell(item, 'add') : toggleSell(item, 'remove')
          "
          :text="item.selling !== true ? 'Add to Shop' : 'Remove from Shop'"
          class="mx-auto"
          variant="elevated"
          color="primary"
        ></v-btn>
        <v-form @submit.prevent ref="itemForm">
          <v-number-input 
          :v-model="price" 
          :modelValue="price" 
          v-on:update:model-value="(val) => price = val"          
          hint="Selling Price" 
          :max="999" 
          :min="0" 
          :step="1"
          persistent-hint
          ></v-number-input>
          <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateItem"></v-btn>
        </v-form>
      </v-card-actions>
    </v-col>
  </v-card>
</template>

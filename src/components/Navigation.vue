<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import Notification from "./notifications/Notification.vue";

const user = userStore();
const collapse = ref(true);

const loggedOutLinks = ref<Array<{ title: string; to: string, link: boolean }>>([
  { title: "Home", to: "/", link: true },
  { title: "General Store", to: "/shop/1", link: true },
  { title: "Inventory", to: "/inventory", link: true },
  { title: "Pets", to: "/pets", link: true },
  { title: "About", to: "/about", link: true },
]);

const loggedInLinks = ref<Array<{ title: string; to: string, link: boolean }>>([
  { title: "Home", to: "/", link: true},
  { title: "General Store", to: "/shop/1", link: true },
  { title: "Inventory", to: "/inventory", link: true },
  {
    title: "Profile",
    to: ``, 
    link: true
  },
  { title: "Pets", to: "/pets", link: true },
  { title: "About", to: "/about", link: true },
]);

function resize(e:any) {
  if (e.target.screen.width > 840) {
    collapse.value = false
  } else {
    collapse.value = true
  }
  return
}

onMounted(async () => {
  window.addEventListener("resize", resize);
  user.$subscribe((mutation) => {
    // Perform actions here when the state changes
    console.log("Nav's user: ", user.getUser?.username);

    if (mutation.storeId == "user" && user.getUser?.username !== undefined) {
      loggedInLinks.value[3].to = `/profile/${user.getUser?.username}`;
    }
  });
});

  const drawer = ref(false)
  const group = ref(null)

  watch(group, () => {
    drawer.value = false
  })

  const notifDrawer = ref(false)
  const notifGroup = ref(null)

  watch(notifGroup, () => {
    notifDrawer.value = false
  })

</script>
  <template>
      <v-app-bar color="primary">
        <RouterLink class="mx-3" :to="{name: 'home'}">
          <v-avatar image="@/assets/logo.svg"></v-avatar>
        </RouterLink>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-avatar 
          icon="mdi-bell" 
          variant="text" 
          :badge="{ color: 'red', location: 'bottom end', floating: true }"
          class="cursor-pointer"
          @click.stop="notifDrawer = !notifDrawer"></v-avatar>
        <v-toolbar-title>Nnneatopets</v-toolbar-title>

        <!-- 
        Might be used later for site searching.
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
        </template> 
        -->
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <template v-if="user.getUser?.username !== undefined">
          <v-list
            :items="loggedInLinks"
            :item-props="true"
          ></v-list>
        </template>
        <template v-else>
          <v-list
            :items="loggedOutLinks"
            :item-props="true"
          ></v-list>
        </template>

      </v-navigation-drawer>

      <v-navigation-drawer
        v-model="notifDrawer"
        :location="$vuetify.display.mobile ? 'top' : 'right'"
        temporary
      >
      <Notification/>
    </v-navigation-drawer>
</template>

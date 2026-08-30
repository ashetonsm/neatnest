<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref, toRaw, watch } from "vue";
import { RouterLink } from "vue-router";
import Notification from "./notifications/Notification.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const user = userStore();
const collapse = ref(true);
var activePet: any = null
const drawer = ref(false)
const group = ref(null)
const notifDrawer = ref(false)
const notifGroup = ref(null)

const { loginWithRedirect, logout: auth0Logout } = useAuth0();
const logout = async () => {
  document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
  await auth0Logout({ logoutParams: { returnTo: window.location.origin } })
}

const loggedOutLinks = ref<Array<{ title: string; to?: string, link: boolean, onClick?: any}>>([
  { title: "Home", to: "/", link: true },
  { title: "Games", to: "/games", link: true },
  { title: "About", to: "/about", link: true },
  { title: "Login", onClick: () => {loginWithRedirect()}, link: true },
]);

const loggedInLinks = ref<Array<{ title: string; to?: string, link: boolean, onClick?: any }>>([
  { title: "Home", to: "/", link: true},
  { title: "General Store", to: "/shop/1", link: true },
  { title: "Inventory", to: "/inventory", link: true },
  {
    title: "Profile",
    to: ``, 
    link: true
  },
  { title: "Pets", to: "/pets", link: true },
  { title: "Games", to: "/games", link: true },
  { title: "Friends", to: "/friends", link: true },
  { title: "Trades", to: "/trades", link: true },
  { title: "About", to: "/about", link: true },
  { title: "Logout", onClick: logout, link: true },
]);

function resize(e:any) {
  if (e.target.screen.width > 840) {
    collapse.value = false
  } else {
    collapse.value = true
  }
  return
}

watch(group, () => {
  drawer.value = false
})

watch(notifGroup, () => {
  notifDrawer.value = false
})

onMounted(async () => {
  try {
    window.addEventListener("resize", resize);
    user.$subscribe((mutation) => {
      // Perform actions here when the state changes
      
      if (mutation.storeId == "user" && user.getUser?.username !== undefined) {
        loggedInLinks.value[3].to = `/profile/${user.getUser?.username}`;
        if (!activePet) {
          var allPets = [user.getPets]
          allPets.filter((pet: any) => {
            if (pet.status == 1) {
              activePet = pet
            }
          })
        }
      }
    });

  } catch (error: any) {
    console.error(error)
  }
});

</script>
  <template>
      <v-app-bar color="primary">
        <RouterLink class="mx-3" :to="{name: 'home'}">
          <v-avatar image="@/assets/logo.svg"></v-avatar>
        </RouterLink>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-badge location="top right" color="success" :model-value="user.getNotifications.length > 0 ? true : false" :content="user.getNotifications.length">
          <v-avatar 
          icon="mdi-bell" 
          variant="text" 
          :badge="{ color: 'red', location: 'bottom end', floating: true }"
          class="cursor-pointer"
          @click.stop="notifDrawer = !notifDrawer"></v-avatar>
        </v-badge>

        <v-toolbar-title>Neatnest</v-toolbar-title>

        <!-- 
        Might be used later for site searching.
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
        </template> 
        -->

        <template v-if="user.getUser?.username !== undefined">
        
        <v-toolbar-title>Hi, {{user.getUser?.username}}!</v-toolbar-title>

          <div class="text-center">
            <v-chip
              class="ma-2"
              variant="outlined"
            >
              Credits: {{ user.getCredits }}
            </v-chip>
            <v-chip
              class="ma-2"
              variant="outlined"
            >
              Active pet: {{activePet ? activePet.name : "None"}}
            </v-chip>
          </div>
        </template>
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
      <Notification :notifications="user.getNotifications"/>
    </v-navigation-drawer>
</template>

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { userStore } from './user';


export const authStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: ref<Boolean>(false),
        userId: ref<String | null>(null)
    }),
    getters: {
        getAuth: (state: { isAuthenticated: Boolean }) => state.isAuthenticated,
        getUserId: (state: { userId: String | null }) => state.userId
    },
    actions: {
        async checkAuth() {
            try {
                /*
                const { userId } = await getCurrentUser();
                this.userId = userId
                this.isAuthenticated = true;
                const user = userStore()
                await user.fetchUser()
                return true
                */
            } catch (error: any) {
                this.isAuthenticated = false;
                return false
                // console.error(error)
            }
        },
    }
});
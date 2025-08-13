import { fetchAuthSession, getCurrentUser, signOut, type AuthSession, type AuthUser, type JWT } from "aws-amplify/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('authStore', {
    state: (): State => ({
        user: null,
        accessToken: undefined,
        idToken: undefined
    }),
    getters: {
        getUser(): null | AuthUser {
            return this.user
        }
    },
    actions: {
        async currentUser() {
            this.user = await getCurrentUser();
            return console.log(this.user)
        },
        async currentSession() {
            try {
                const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
                console.log('accessToken: ' + accessToken)
                console.log('idToken: ' + idToken)
            } catch (err) {
                console.log(err);
            }
        },
        async signOut() {
            await signOut();
            this.user = null;
            console.log('Signed out')

        }

    }
})

type State = {
  user: null | AuthUser,
  accessToken: JWT | undefined,
  idToken: JWT | undefined
}
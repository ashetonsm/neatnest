import { fetchAuthSession, getCurrentUser, signOut, type AuthSession, type AuthUser, type JWT } from "aws-amplify/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('authStore', {
    state: (): State => ({
        user: null,
        username: null,
        session: {},
    }),
    getters: {
        getUser(): null | AuthUser {
            return this.user
        },
        getUsername(): null | String {
            return this.user.username
        },
        getSession(): {} | { accessToken, idToken } {
            return this.session
        }
    },
    actions: {
        async setUser() {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                this.user = { username, userId, signInDetails }
            } catch (err) {
                console.log(err);
            }
        },
        async setSession() {
            try {
                const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
                console.log('accessToken: ' + accessToken)
                console.log('idToken: ' + idToken)
                this.session = { accessToken, idToken }
            } catch (err) {
                console.log(err);
            }
        },
        async signOut() {
            try {
                await signOut();
                this.user = null;
                this.session = {};
                console.log('Signed out')
            } catch (err) {
                console.log(err);
            }
        }

    }
})

type State = {
  user: null | AuthUser,
  username: null | String,
  session: {} | { accessToken, idToken },
}
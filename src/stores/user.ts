import { ref } from 'vue';
import { defineStore } from 'pinia';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any>(null)
    }),
    getters: {
        getUser: (state: { user: any }) => state.user,
    },
    actions: {
        async amplifyGetCurrentUser() {
            try {
                const { userId } = await getCurrentUser();

                // If you define this before userStore, you'll get the Amplify Not Configured error.
                const client = generateClient<Schema>();

                await client.models.User.get({ id: userId })
                    .then((u) => {
                        console.log("userStore got the following user: ", u.data)

                        // Needs an exclaimation point otherwise you get a nullable error
                        this.user = u.data!
                    });
            } catch (error: any) {
                console.error(error)
            }
        }
    }
});
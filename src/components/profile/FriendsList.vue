<script setup lang="ts">
import { onMounted } from 'vue';
import Friend from './Friend.vue';

const props = defineProps<{
    username: string;
    friends: Record<string, any>[] | [] | any;
}>();

onMounted(() => {
    console.log("props.friends", props.friends)
})
</script>

<template>
    <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="purple">
        <h2 class="text-h4 font-weight-black ma-4">{{ username }}'s Relationships:</h2>
        <!-- User has 1 friend and it is an object-->
        <template v-if="!props.friends.length">
            {{ console.log("No length") }}
            {{ console.log(props.friends) }}
            <!-- The route is the friends page. List everyone regardless of status -->
            <template v-if="$route.name == 'friends'">
                <v-list>
                    <Friend :friend="props.friends"/>
                </v-list>
            </template>

            <!-- The route is NOT the friends page. List only status 1 -->
            <template v-else>
                <v-list>
                    <Friend v-if="props.friends.status == 1" :friend="props.friends"/>
                </v-list>
            </template>
        </template>
        <!-- User has > 1 friend -->
        <template v-else-if="props.friends.length">
            {{ console.log("length") }}

            <!-- The route is the friends page. List everyone regardless of status -->
            <template v-if="$route.name == 'friends'">
                <v-list v-for="friend in props.friends">
                    <Friend :friend="friend"/>
                </v-list>
            </template>

            <!-- The route is NOT the friends page. List only status 1 -->
            <template v-else>
                <v-list 
                    v-for="friend in props.friends">
                    <Friend v-if="friend.status == 1" :friend="friend"/>
                </v-list>
            </template>
        </template>

        <!-- User has no friends -->
        <template v-else>
            <div>Aww, {{ username }} has no relationships!</div>
        </template>
    </v-sheet>
</template>

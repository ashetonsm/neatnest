<script setup lang="ts">

const props = defineProps<{
    username: string;
    friends: Record<string, any>[] | undefined;
}>();
</script>

<template>
    <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="purple">
        <h2 class="text-h4 font-weight-black ma-4">{{ username }}'s Friends:</h2>
        <v-list v-if="
            friends &&
            friends.filter((f: { status?: number; }) => f.status == 1).length !== 0
        ">
            <template v-for="n in friends.filter((f: { status?: number; }) => f.status == 1)">
                <v-list-item v-if="n" :key="'Friend: ' + n.relationshipUsername" :title="n.relationshipUsername.toString()"
                    :to="'/profile/' + n.relationshipUsername"></v-list-item>
            </template>
        </v-list>
        <div v-else>Aww, {{ username }} has no friends!</div>
    </v-sheet>
</template>

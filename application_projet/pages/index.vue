<script setup>
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.js';
import { forums as getAllForums } from '../services/httpClient.js';

const router = useRouter();
const { session, refresh } = await useSession()
const username = session.value.username
const forums = ref([]);

const disconnect = async () => {
    try {
        await logout()
        await refresh()
        router.push('/login')
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    }
}

const forumList = async () => {
    try {
        const response = await getAllForums()
        forums.value = response.forums
        console.log('Forum list:', response);
    } catch (error) {
        console.error('Error fetching forum list:', error);
    }
}

onMounted(() => {
    forumList()
})

</script>

<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="bg-white p-8 rounded-lg shadow-lg">
                <h1 class="text-center text-3xl font-bold text-gray-900 mb-6">
                    Bienvenue sur l'application de forum !
                </h1>
                <div class="mt-8 flex justify-end">
                    <button @click="disconnect"
                        class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Déconnexion
                    </button>
                </div>

                <h2 class="text-xl font-semibold text-gray-800 mb-4">Liste des forums</h2>

                <!-- Liste des forums -->
                <div class="space-y-4">
                    <div v-for="forum in forums" :key="forum.id"
                        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-lg font-medium text-blue-600">{{ forum.name }}</h3>
                                <p class="text-sm text-gray-600">{{ forum.description }}</p>
                            </div>
                            <div class="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                                {{ forum.topics.length }} sujet{{ forum.topics.length !== 1 ? 's' : '' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.js';
import { index } from '../services/httpClient.js';

const router = useRouter();
const { session, refresh } = await useSession()
const username = session.value.username

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
        const response = await index('forum')
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
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h1 class="text-center text-3xl font-bold text-gray-900">
                Bonjour {{ username }} !!!!
            </h1>
            <div class="flex flex-col space-y-4">
                <button @click="disconnect"
                    class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Disconnect
                </button>
            </div>
        </div>
    </div>
</template>
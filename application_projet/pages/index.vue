<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const { session, refresh, update, reset } = await useSession()
const username = session.value.username

const disconnect = async () => {
    await reset()
    await refresh()
    await update({
        token: null,
        refreshToken: null
    })
    await router.push('/login')
}

</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h1 class="text-center text-3xl font-bold text-gray-900">
                Bonjour {{ username }} !!!!
            </h1>
            <div class="flex flex-col space-y-4">
                <nuxt-link to="/login"
                    class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </nuxt-link>
                <nuxt-link to="/register"
                    class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Register
                </nuxt-link>
                <button @click="disconnect"
                    class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Disconnect
                </button>
            </div>
        </div>
    </div>
</template>
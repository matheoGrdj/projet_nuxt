<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login as loginService } from '../services/auth.js';

const router = useRouter();
const username = ref('');
const password = ref('');

const loginUser = async () => {
    try {
        const response = await loginService(username.value, password.value);
        if (response?.success === true) {
            router.push('/');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Pseudo</h1>
            <div class="space-y-4">
                <div>
                    <input v-model="username" placeholder="Usename"
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                </div>
                <div>
                    <input v-model="password" type="password" placeholder="Password"
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                </div>
                <button @click="loginUser"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </button>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?
                    <nuxt-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Register here
                    </nuxt-link>
                </p>
            </div>
        </div>
    </div>
</template>
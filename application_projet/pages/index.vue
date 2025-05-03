<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { logout } from '../services/auth.js'
import { forums as getAllForums } from '../services/httpClient.js'
import { useSession } from '#imports' // Adjust this based on your Nuxt composables

const router = useRouter()
const { session, refresh } = await useSession()
const username = session.value?.username
const forums = ref([])

const disconnect = async () => {
  try {
    await logout()
    await refresh()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    alert('An error occurred during logout. Please try again.')
  }
}

const goToForum = (forumId) => {
  router.push(`/forum/${forumId}`)
}

const forumList = async () => {
  try {
    const response = await getAllForums()
    forums.value = response.forums || []
    console.log('Forum list:', response)
  } catch (error) {
    console.error('Error fetching forum list:', error)
    forums.value = []
  }
}

onMounted(() => {
  forumList()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900">Forum Application</h1>
          <div class="flex items-center space-x-4">
            <span v-if="username" class="text-gray-600">
              Welcome, {{ username }}
            </span>
            <div class="flex space-x-2">
              <button v-if="!session?.token" 
                      @click="router.push('/login')"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Connexion
              </button>
              <button v-if="!session?.token" 
                      @click="router.push('/register')"
                      class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                Inscription
              </button>
              <button v-if="session?.token" 
                      @click="disconnect"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-4 space-y-8">
      <!-- Forums Section -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">Forums</h2>
          <div v-if="!session?.token" class="text-sm text-gray-500">
            <span>Sign in to participate in discussions</span>
          </div>
        </div>

        <!-- Forums List -->
        <div class="divide-y divide-gray-200">
          <div v-for="forum in forums" 
               :key="forum.id"
               @click="goToForum(forum.id)"
               class="p-6 hover:bg-gray-50 transition cursor-pointer">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium text-blue-600">{{ forum.name || 'Untitled Forum' }}</h3>
                <p class="text-sm text-gray-600">{{ forum.description || 'No description available' }}</p>
                <div class="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  <span>
                    {{ (forum.topics || []).length }} topic{{ (forum.topics || []).length !== 1 ? 's' : '' }}
                  </span>
                  <span>•</span>
                  <span>
                    Last updated {{ new Date(forum.updated_at || Date.now()).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <div class="text-sm text-gray-500 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" 
                     class="h-5 w-5" 
                     viewBox="0 0 20 20" 
                     fill="currentColor">
                  <path fill-rule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="forums.length === 0" class="p-6 text-center text-gray-500">
          <p>No forums available</p>
        </div>
      </div>

      <!-- Admin Section -->
      <div v-if="session?.user?.role === 'admin'" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
        <div class="space-x-4">
          <button @click="router.push('/admin/forums')"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Manage Forums
          </button>
          <button @click="router.push('/admin/users')"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

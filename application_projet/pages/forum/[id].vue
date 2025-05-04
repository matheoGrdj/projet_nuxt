<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getForum, getTopics, createTopic as createTopicApi } from '../../services/httpClient'
import { useSession } from '#imports'

const route = useRoute()
const forumId = route.params.id
const { session } = await useSession()

// State
const forum = ref(null)
const topics = ref([])
const totalPages = ref(1)
const currentPage = ref(1)
const itemsPerPage = 20
const showNewTopicForm = ref(false)
const newTopic = ref({
  title: '',
  content: ''
})

// Fetch data
const fetchForum = async () => {
  try {
    const response = await getForum(forumId)
    forum.value = response.forum
  } catch (error) {
    console.error('Error fetching forum:', error)
  }
}

const fetchTopics = async () => {
  try {
    const response = await getTopics(forumId, currentPage.value, itemsPerPage)
    topics.value = response.topics
    totalPages.value = response.pagination.pages
  } catch (error) {
    console.error('Error fetching topics:', error)
  }
}

// Create new topic
const createTopic = async () => {
  try {
    const response = await createTopicApi(forumId, newTopic.value.title, newTopic.value.content)
    if (response) {
      showNewTopicForm.value = false
      newTopic.value = { title: '', content: '' }
      await fetchTopics() // Refresh topics list
    }
  } catch (error) {
    console.error('Error creating topic:', error)
    alert('Failed to create topic. Please try again.')
  }
}

// Reset page when forum changes
watch(() => route.params.id, () => {
  currentPage.value = 1
  fetchForum()
  fetchTopics()
})

// Reload topics when page changes
watch(() => currentPage.value, () => {
  fetchTopics()
})

// Initial load
onMounted(() => {
  fetchForum()
  fetchTopics()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Forum Header -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ forum?.name }}</h1>
            <p class="text-gray-600 mt-1">{{ forum?.description }}</p>
          </div>
          <button v-if="session?.token" @click="showNewTopicForm = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            New Topic
          </button>
        </div>
      </div>

      <!-- New Topic Form -->
      <div v-if="showNewTopicForm" class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">Create New Topic</h2>
        <form @submit.prevent="createTopic" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="newTopic.title" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Content</label>
            <textarea v-model="newTopic.content" required rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showNewTopicForm = false"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Topic
            </button>
          </div>
        </form>
      </div>

      <!-- Topics List -->
      <div class="bg-white rounded-lg shadow-lg">
        <div v-if="topics.length > 0" class="divide-y divide-gray-200">
          <div v-for="topic in topics" :key="topic.id" class="p-6 hover:bg-gray-50">
            <nuxt-link :to="`/topic/${topic.id}`" class="block">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-medium text-blue-600">{{ topic.title }}</h3>
                  <p class="text-sm text-gray-500">
                    by {{ topic.author }} |
                    {{ topic.message_count }} messages |
                    Last reply by {{ topic.last_message_author }}
                    at {{ new Date(topic.last_message_at).toLocaleString() }}
                  </p>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-6 text-center text-gray-500">
          <p>No topics in this forum yet.</p>
          <p v-if="session?.token" class="mt-2">
            Be the first to create a topic!
          </p>
          <p v-else class="mt-2">
            Sign in to create the first topic.
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div class="flex justify-center space-x-2">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
              'px-3 py-1 rounded',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
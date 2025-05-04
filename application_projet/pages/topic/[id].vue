<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useSession } from '#imports'
import { getTopic, getMessages, createMessage } from '../../services/httpClient'

const route = useRoute()
const topicId = route.params.id
const { session } = await useSession()

const userId = ref(null)
onMounted(async () => {
  if (session.value?.token) {
    const { default: jwt_decode } = await import('jwt-decode')
    const decoded = jwt_decode(session.value.token)
    console.log("decoded", decoded)
    userId.value = decoded.id || decoded.user_id
  }
})
console.log("userId", userId)
const editingMessageId = ref(null)
const editContent = ref('')
const topic = ref(null)
const messages = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 20
const newMessage = ref('')

// Fetch topic details
const fetchTopic = async () => {
  try {
    const response = await getTopic(topicId)
    topic.value = response.topic
  } catch (error) {
    console.error('Error fetching topic:', error)
  }
}

// Fetch messages with pagination
const fetchMessages = async () => {
  try {
    const response = await getMessages(topicId, currentPage.value, itemsPerPage)
    messages.value = response.messages
    console.log("messages", messages.value)
    totalPages.value = response.pagination.pages
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}

// Post new message
const postMessage = async () => {
  if (!newMessage.value.trim()) return

  try {
    await createMessage(topicId, newMessage.value)
    newMessage.value = ''
    await fetchMessages() // Refresh messages
  } catch (error) {
    console.error('Error posting message:', error)
    alert('Failed to post message. Please try again.')
  }
}

// Handle page changes
const changePage = (page) => {
  currentPage.value = page
  fetchMessages()
}

function startEdit(message) {
  editingMessageId.value = message.id
  editContent.value = message.content
}

function cancelEdit() {
  editingMessageId.value = null
  editContent.value = ''
}

async function saveEdit(messageId) {
  try {
    await editMessageApi(messageId, editContent.value)
    editingMessageId.value = null
    editContent.value = ''
    await fetchMessages()
  } catch (e) {
    alert('Erreur lors de la modification')
  }
}

onMounted(() => {
  fetchTopic()
  fetchMessages()
  console.log("messages", messages.value)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Topic Header -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-gray-900">{{ topic?.title }}</h1>
          <div class="text-sm text-gray-600 mt-2">
            <span>Created by {{ topic?.author }}</span>
            <span class="mx-2">•</span>
            <span>{{ new Date(topic?.created_at).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div v-if="session?.token" class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <form @submit.prevent="postMessage" class="space-y-4">
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">
              Reply to this topic
            </label>
            <textarea id="message" v-model="newMessage" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500"
              placeholder="Write your message here..."></textarea>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md 
                           hover:bg-blue-700">
              Post Reply
            </button>
          </div>
        </form>
      </div>

      <!-- Login prompt if not authenticated -->
      <div v-else class="bg-white p-6 rounded-lg shadow-lg text-center mb-6">
        <p class="text-gray-600">
          Please <nuxt-link to="/login" class="text-blue-600 hover:underline">
            sign in
          </nuxt-link> to reply to this topic.
        </p>
      </div>

      <!-- Messages List -->
      <div class="space-y-4 mb-6">
        <div v-for="message in messages" :key="message.id" class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="font-medium text-gray-900">{{ message.author }}</span>
                <span class="mx-2 text-gray-500">•</span>
                <span class="text-sm text-gray-500">
                  {{ new Date(message.created_at).toLocaleString() }}
                </span>
              </div>
              <div v-if="editingMessageId !== message.id" class="prose prose-sm max-w-none text-gray-700">
                {{ message.content }}
              </div>
              <div v-else>
                <textarea v-model="editContent" class="w-full border rounded p-2"></textarea>
                <div class="mt-2 flex gap-2">
                  <button @click="saveEdit(message.id)"
                    class="bg-blue-600 text-white px-3 py-1 rounded">Enregistrer</button>
                  <button @click="cancelEdit" class="bg-gray-300 px-3 py-1 rounded">Annuler</button>
                </div>
              </div>
            </div>
            <div v-if="userId === message.user_id && editingMessageId !== message.id">
              <button @click="startEdit(message)" class="text-blue-600 hover:underline text-sm">Modifier</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center space-x-2 mb-6">
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="[
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
</template>
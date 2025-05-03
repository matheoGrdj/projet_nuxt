<script setup>
import { ref } from 'vue';

let ws;
const messages = ref([]);
const connectionStatus = ref('disconnected');

// WebSocket connection function
const connect = async () => {
  try {
    const isSecure = location.protocol === "https:";
    const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";

    if (ws) {
      ws.close();
    }

    console.log("Connecting to", url, "...");
    ws = new WebSocket(url);

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log("Received:", message);
      messages.value.push(message);
    });

    ws.addEventListener("close", () => {
      connectionStatus.value = 'disconnected';
      console.log("WebSocket disconnected");
    });

    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve);
      ws.addEventListener("error", reject);
    });

    connectionStatus.value = 'connected';
    console.log("WebSocket connected!");
  } catch (error) {
    console.error("WebSocket connection error:", error);
    connectionStatus.value = 'error';
  }
};

// Test functions
const ping = () => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
};

const simulateNewTopic = () => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'new_topic',
      forumId: 1,
      topic: {
        id: Date.now(),
        title: 'Test Topic',
        content: 'This is a test topic'
      }
    }));
  }
};

const simulateNewMessage = () => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'new_message',
      topicId: 1,
      message: {
        id: Date.now(),
        content: 'Test message'
      }
    }));
  }
};
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <div class="mb-2">Status: {{ connectionStatus }}</div>
      <button @click="connect" 
              class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Connect
      </button>
      <button @click="ping" 
              class="bg-green-500 text-white px-4 py-2 rounded mr-2">
        Ping
      </button>
      <button @click="simulateNewTopic" 
              class="bg-purple-500 text-white px-4 py-2 rounded mr-2">
        New Topic
      </button>
      <button @click="simulateNewMessage" 
              class="bg-orange-500 text-white px-4 py-2 rounded">
        New Message
      </button>
    </div>

    <div class="border rounded p-4">
      <h2 class="text-lg font-bold mb-2">Messages:</h2>
      <div class="space-y-2">
        <div v-for="(message, index) in messages" 
             :key="index"
             class="p-2 bg-gray-100 rounded">
          {{ JSON.stringify(message) }}
        </div>
      </div>
    </div>
  </div>
</template>
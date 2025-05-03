const connectedClients = new Set<any>();

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] Client connected");
    connectedClients.add(peer);
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.toString());
      console.log("[ws] message received:", data);

      // Broadcast message to all connected clients except sender
      switch (data.type) {
        case 'new_topic':
          // Broadcast new topic to all clients
          broadcastToAll({
            type: 'new_topic',
            forumId: data.forumId,
            topic: data.topic
          }, peer);
          break;

        case 'new_message':
          // Broadcast new message to all clients
          broadcastToAll({
            type: 'new_message',
            topicId: data.topicId,
            message: data.message
          }, peer);
          break;

        case 'ping':
          // Simple ping/pong for connection testing
          peer.send(JSON.stringify({ type: 'pong' }));
          break;

        default:
          console.log("[ws] Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("[ws] Error processing message:", error);
      peer.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  },

  close(peer) {
    console.log("[ws] Client disconnected");
    connectedClients.delete(peer);
  },

  error(peer, error) {
    console.error("[ws] Error:", error);
    connectedClients.delete(peer);
  },
});

// Helper function to broadcast messages to all clients except sender
function broadcastToAll(data: any, exclude?: any) {
  const message = JSON.stringify(data);
  connectedClients.forEach(client => {
    if (client !== exclude) {
      client.send(message);
    }
  });
}
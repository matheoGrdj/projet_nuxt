export async function forums() {
    return $fetch('/api/forums', {
        method: 'GET'
    });
}

export async function getForum(id) {
    return $fetch(`/api/forum/${id}`, {
        method: 'GET'
    });
}

export async function getTopics(forumId, page = 1, limit = 20) {
    return $fetch(`/api/forum/${forumId}/topics`, {
        method: 'GET',
        params: {
            page,
            limit
        }
    });
}

export async function getTopic(id) {
    return $fetch(`/api/forum/topic/${id}`, {
        method: 'GET'
    });
}

export async function getMessages(topicId, page = 1, limit = 20) {
    return $fetch(`/api/forum/topic/${topicId}/messages`, {
        method: 'GET',
        params: {
            page,
            limit
        }
    });
}

export async function createTopic(forumId, title, content) {
    const { session } = await useSession();
    return $fetch(`/api/forum/${forumId}/topics`, {
        method: 'POST',
        body: { title, content },
        headers: {
            'Authorization': `Bearer ${session.value.token}`
        }
    });
}

export async function createMessage(topicId, content) {
    const { session } = await useSession();
    return $fetch(`/api/forum/topic/${topicId}/messages`, {
        method: 'POST',
        body: { content },
        headers: {
            'Authorization': `Bearer ${session.value.token}`
        }
    });
}
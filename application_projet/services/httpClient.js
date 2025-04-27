export async function forums() {
    const { session, refresh, update, reset } = await useSession()
    if (!session.value.token) {
        return { success: false, message: 'No token found' }
    }
    return $fetch('/api/forums', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.value.token}`
        }
    });
}
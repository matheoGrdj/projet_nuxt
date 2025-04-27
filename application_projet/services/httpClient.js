export async function index() {
    const { session, refresh, update, reset } = await useSession()
    console.log('Session:', session)
    if (!session.value.token) {
        return { success: false, message: 'No token found' }
    }
    return $fetch('/api/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.value.token}`
        }
    });
}
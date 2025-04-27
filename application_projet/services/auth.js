export async function login(username, password) {
    const { update } = await useSession()
    console.log(username, password)

    const response = await $fetch('/api/login', {
        method: 'POST',
        body: { username: username, password: password }
    });

    if (response.success) {
        if (response.token && response.refreshToken) {
            await update({
                token: response.token,
                refreshToken: response.refreshToken,
                username: username
            })
        }
        return response;
    } else {
        console.error(response.message);
        alert(response.message);
    }
}

export async function register(username, password) {
    const response = await $fetch('/api/register', {
        method: 'POST',
        body: { username: username, password: password }
    });

    if (response.success) {
        return response;
    } else {
        console.error(response.message);
        alert(response.message);
    }
}

export async function logout() {
    const { session, refresh, update, reset } = await useSession()
    await reset()
    await refresh()
    await update({
        token: null,
        refreshToken: null
    })
}
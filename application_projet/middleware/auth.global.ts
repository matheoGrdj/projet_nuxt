export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith("/api")) {
    return;
  }

  const { session } = await useSession();

  const isAuthenticated = session?.value?.token !== null;

  if (!isAuthenticated && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login");
  }
  return;
});

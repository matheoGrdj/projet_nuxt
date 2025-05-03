export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith("/api")) {
    return;
  }

  const { session } = await useSession();
  const isAuthenticated = session?.value?.token !== null;

  // List of routes that require authentication
  const protectedRoutes = [
    '/new-topic',
    '/edit-topic',
    '/reply',
    '/admin'
  ];

  // Check if the current route requires authentication
  const requiresAuth = protectedRoutes.some(route => to.path.startsWith(route));

  if (!isAuthenticated && requiresAuth) {
    return navigateTo("/login");
  }
  return;
});
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@nuxtjs/tailwindcss", "@sidebase/nuxt-session"],
  devtools: { enabled: true },
  nitro: {
    routeRules: {
      "/api/**": { cors: true },
    },
    experimental: {
      websocket: true,
    },
  },
});

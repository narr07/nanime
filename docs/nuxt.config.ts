export default defineNuxtConfig({
  extends: ['docus'],
  // nuxt-studio removed: on Windows it crashes nuxt-component-meta with
  // "The URL must be of scheme file" while resolving a component path
  // (mlly's pathToFileURL). Only affects the in-browser Studio editor UI,
  // not content rendering.
  modules: ['nanime'],
  components: {
    global: true,
    dirs: ['~/components'],
  },
  app: {
    head: {
      meta: [
        {
          name: 'google-site-verification',
          content: 'k2rdqKBTN2zz6nvGRTA4DbeY0SUcq6lkEemQ_597FZs',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  site: {
    name: 'nanime',
  },
  sourcemap: {
    server: false,
    client: false,
  },
  devServer: {
    port: 3000,
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'remark-emoji',
        'remark-mdc',
      ],
    },
  },
  studio: {
    // @ts-expect-error from the docs
    git: {
      commit: {
        messagePrefix: 'content:',
      },
    },
    repository: {
      provider: 'github',
      owner: 'astraldev',
      repo: 'nanime',
      branch: process.env.STUDIO_BRANCH_NAME || 'main',
    },
  },
})

import { resolve } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { startSubprocess } from '@nuxt/devtools-kit'

export default defineNuxtConfig({

  modules: [
    '../src/module',
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev) {
          return
        }

        const _process = startSubprocess(
          {
            command: 'npx',
            args: ['nuxi', 'dev', '--port', '3300'],
            cwd: resolve(__dirname, '../client'),
          },
          {
            id: 'nuxt-hubspot:client',
            name: 'HubSpot Client Dev',
          },
        )
      },
    }),
  ],
  devtools: {
    enabled: true,
  },

  compatibilityDate: '2024-08-21',

  hubspot: {},
})

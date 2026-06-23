import { useLogger, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'

export interface ModuleOptions {
  hubspotPortalId?: string
  autoPageTracking?: boolean
  requireIdentify?: boolean
  sendDevMetrics?: boolean
  devtools?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-hubspot-analytics',
    configKey: 'hubspot',
  },
  defaults: {
    autoPageTracking: true,
    requireIdentify: true,
    sendDevMetrics: false,
    devtools: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger('hubspot')

    addImports([
      { name: 'useHubspot', from: resolver.resolve('./runtime/composable') },
      { name: 'createTracker', from: resolver.resolve('./runtime/composable') },
    ])

    const portalId = options.hubspotPortalId
      || nuxt.options.runtimeConfig.public.hubspotPortalId
      || process.env.NUXT_PUBLIC_HUBSPOT_PORTAL_ID

    if (!portalId && !nuxt.options.dev) {
      logger.warn('NUXT_PUBLIC_HUBSPOT_PORTAL_ID is not set — HubSpot tracking is disabled')
      return
    }

    if (portalId) {
      nuxt.options.runtimeConfig.public.hubspotPortalId = portalId
    }

    nuxt.options.runtimeConfig.public.hubspotAutoPageTracking = options.autoPageTracking
    nuxt.options.runtimeConfig.public.hubspotRequireIdentify = options.requireIdentify
    nuxt.options.runtimeConfig.public.hubspotSendDevMetrics = options.sendDevMetrics

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'client',
    })

    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)
    }
  },
})

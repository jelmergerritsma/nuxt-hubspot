import Analytics from 'analytics'
import hubspotPlugin from '@analytics/hubspot'
import { devLoggerPlugin } from './dev-logger'
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app'

interface HubspotEvent {
  type: string
  timestamp: number
  [key: string]: unknown
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const portalId = config.public.hubspotPortalId as string
  const autoPageTracking = config.public.hubspotAutoPageTracking !== false
  const requireIdentify = config.public.hubspotRequireIdentify !== false
  const isDev = import.meta.dev
  const sendDevMetrics = config.public.hubspotSendDevMetrics === true

  const channel = isDev ? new BroadcastChannel('hubspot-devtools') : null
  const eventBuffer: (HubspotEvent | { type: 'status', identified: boolean })[] = []
  let devtoolsConnected = false

  if (channel) {
    channel.onmessage = (e) => {
      if (e.data?.type === 'devtools-ready') {
        devtoolsConnected = true
        eventBuffer.forEach(event => channel.postMessage(event))
        eventBuffer.length = 0
      }
    }
  }

  const pushEvent = (event: HubspotEvent | { type: 'status', identified: boolean }) => {
    if (!channel) return
    if (devtoolsConnected) {
      channel.postMessage(event)
    }
    else {
      eventBuffer.push(event)
    }
  }

  const analyticsPlugins = []
  if (isDev) analyticsPlugins.push(devLoggerPlugin)
  if (!isDev || sendDevMetrics) analyticsPlugins.push(hubspotPlugin({ portalId }))

  const analytics = Analytics({ app: 'hubspot-analytics', plugins: analyticsPlugins })
  let identified = false

  const canSend = () => !requireIdentify || identified

  const hubspot = {
    log(event: string, properties: Record<string, unknown> = {}) {
      if (!canSend()) return
      pushEvent({ type: 'track', timestamp: Date.now(), event, properties })
      analytics.track(event, properties)
    },

    identify(userId: string, traits: Record<string, unknown> = {}) {
      identified = true
      pushEvent({ type: 'identify', timestamp: Date.now(), userId, traits })
      pushEvent({ type: 'status', identified: true })
      analytics.identify(userId, traits)
    },

    page(properties: Record<string, unknown> = {}) {
      if (!canSend()) return
      pushEvent({ type: 'page', timestamp: Date.now(), properties })
      analytics.page(properties)
    },

    reset() {
      pushEvent({ type: 'reset', timestamp: Date.now() })
      analytics.reset()
      identified = false
      pushEvent({ type: 'status', identified: false })
    },
  }

  if (autoPageTracking) {
    router.afterEach((to) => {
      hubspot.page({ page: to.fullPath })
    })
  }

  return {
    provide: {
      hubspot,
    },
  }
})

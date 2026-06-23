import { useNuxtApp } from '#app'

export interface HubspotClient {
  log: (event: string, properties?: Record<string, unknown>) => void
  identify: (userId: string, traits?: Record<string, unknown>) => void
  page: (properties?: Record<string, unknown>) => void
  reset: () => void
}

const noop: HubspotClient = {
  log: () => {},
  identify: () => {},
  page: () => {},
  reset: () => {},
}

export const useHubspot = (): HubspotClient => {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$hubspot as HubspotClient) ?? noop
}

export const createTracker = <T extends Record<string, Record<string, unknown>>>() => {
  const { log } = useHubspot()

  return <K extends keyof T & string>(event: K, properties: T[K]) => {
    log(event, properties)
  }
}

import HubspotModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    HubspotModule,
  ],
  ssr: false,
  hubspot: {
    hubspotPortalId: 'test-portal-123',
    requireIdentify: false,
  },
})

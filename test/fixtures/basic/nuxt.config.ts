import HubspotModule from '../../../src/module'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    HubspotModule,
  ],
  hubspot: {
    hubspotPortalId: 'test-portal-123',
  },
})

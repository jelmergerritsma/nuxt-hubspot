declare module '@analytics/hubspot' {
  function hubspotPlugin(config: { portalId: string }): import('analytics').AnalyticsPlugin
  export = hubspotPlugin
}

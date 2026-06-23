# nuxt-hubspot

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

HubSpot analytics integration for Nuxt. Typesafe event tracking with auto page views, identify gating, and a Nuxt DevTools panel.

## Features

- **Auto page tracking** — tracks route changes automatically via Vue Router
- **Identify gating** — optionally block events until a user is identified
- **Typesafe events** — `createTracker<EventMap>()` gives autocomplete and type checking on event names and properties
- **DevTools panel** — see all events in real-time inside Nuxt DevTools
- **Dev mode** — events are logged to DevTools instead of sent to HubSpot during development
- **Zero config in dev** — works without a portal ID in development mode

## Quick Setup

Install the module:

```bash
pnpm add nuxt-hubspot
```

Add it to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-hubspot'],

  hubspot: {
    // Option 1: set portal ID here
    hubspotPortalId: '12345678',
  },
})
```

Or use an environment variable instead:

```bash
NUXT_PUBLIC_HUBSPOT_PORTAL_ID=12345678
```

## Usage

### Basic tracking

`useHubspot()` is auto-imported and provides the core API:

```ts
const { identify, log, page, reset } = useHubspot()

// Identify a user (required before events fire, unless requireIdentify is false)
identify('user@example.com', { name: 'Jane Doe', plan: 'pro' })

// Track a custom event
log('form_submitted', { formId: 'contact', source: 'homepage' })

// Track a page view manually (automatic by default)
page({ page: '/custom-path', source: 'app' })

// Reset on logout
reset()
```

### Typesafe events with `createTracker`

Define your event map and get full type checking:

```ts
// composables/useTracking.ts
type TrackingEventMap = {
  newsletter_sent: { newsletter_id: number, subject: string }
  social_media_posted: { post_group_id: number, platform: string }
  form_submitted: { form_id: string }
}

export const useTracking = () => {
  const { identify, page, reset } = useHubspot()
  const track = createTracker<TrackingEventMap>()

  return { identify, page, reset, track }
}
```

Then use it in your components:

```vue
<script setup lang="ts">
const { track } = useTracking()

// Autocompletes event names, enforces correct properties
track('newsletter_sent', { newsletter_id: 1, subject: 'Weekly update' })

// Type error: unknown event
track('invalid_event', {})

// Type error: wrong properties
track('newsletter_sent', { wrong_prop: true })
</script>
```

## Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `hubspotPortalId` | `string` | — | HubSpot portal ID. Also accepts `NUXT_PUBLIC_HUBSPOT_PORTAL_ID` env var. |
| `autoPageTracking` | `boolean` | `true` | Automatically track page views on route changes. |
| `requireIdentify` | `boolean` | `true` | Block `log` and `page` events until `identify()` is called. Set to `false` for anonymous tracking. |
| `sendDevMetrics` | `boolean` | `false` | Send events to HubSpot in development mode. By default, dev events only go to the DevTools panel. |

## API

### `useHubspot()`

Auto-imported composable returning the HubSpot client:

| Method | Signature | Description |
|---|---|---|
| `log` | `(event: string, properties?: Record<string, unknown>) => void` | Track a custom event. |
| `identify` | `(userId: string, traits?: Record<string, unknown>) => void` | Identify a user by ID (typically email). |
| `page` | `(properties?: Record<string, unknown>) => void` | Track a page view with optional properties. |
| `reset` | `() => void` | Clear the identified user and reset the HubSpot session. |

When the module is disabled (no portal ID in production), all methods are safe no-ops.

### `createTracker<EventMap>()`

Auto-imported factory that returns a typesafe `track` function:

```ts
const track = createTracker<{ my_event: { count: number } }>()
track('my_event', { count: 42 }) // ok
track('my_event', { wrong: true }) // type error
track('unknown', {}) // type error
```

## DevTools

When Nuxt DevTools is enabled, a **HubSpot** tab appears showing:

- All events in real-time (identify, track, page, reset)
- Expandable rows with syntax-highlighted event data
- Type filter chips
- Identified/anonymous status indicator
- Clear button

Events are sent via `BroadcastChannel` so the DevTools panel works regardless of iframe nesting.

## How It Works

The module uses the [`analytics`](https://getanalytics.io/) library with the [`@analytics/hubspot`](https://getanalytics.io/plugins/hubspot/) plugin under the hood. In development mode, events go to the DevTools panel instead of HubSpot. In production, the HubSpot tracking script is loaded and events are forwarded to your HubSpot portal.

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm dev:prepare

# Develop with playground + devtools client
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint

# Build for production
pnpm prepack
```

## License

[MIT](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-hubspot/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-hubspot

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-hubspot.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-hubspot

[license-src]: https://img.shields.io/npm/l/nuxt-hubspot.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-hubspot

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt
[nuxt-href]: https://nuxt.com

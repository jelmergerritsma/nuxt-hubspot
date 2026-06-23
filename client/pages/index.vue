<script setup lang="ts">
type HubspotEvent = {
  type: 'identify' | 'track' | 'page' | 'reset' | 'status'
  timestamp?: number
  event?: string
  userId?: string
  traits?: Record<string, unknown>
  properties?: Record<string, unknown>
  identified?: boolean
}

type EventType = 'identify' | 'track' | 'page' | 'reset'

const EVENT_TYPES: EventType[] = ['identify', 'track', 'page', 'reset']

const TYPE_STYLES: Record<EventType, { color: string, icon: string }> = {
  identify: { color: 'green', icon: 'carbon-user' },
  track: { color: 'blue', icon: 'carbon-event-schedule' },
  page: { color: 'purple', icon: 'carbon-page-first' },
  reset: { color: 'orange', icon: 'carbon-reset' },
}

type HubspotEventWithId = HubspotEvent & { _id: number }

let nextId = 0
const events = ref<HubspotEventWithId[]>([])
const identified = ref(false)
const expandedId = ref<number | null>(null)
const activeFilters = ref<Set<EventType>>(new Set(EVENT_TYPES))

let channel: BroadcastChannel | null = null

onMounted(() => {
  channel = new BroadcastChannel('hubspot-devtools')
  channel.onmessage = (e: MessageEvent<HubspotEvent>) => {
    const data = e.data
    if (data.type === 'status') {
      identified.value = data.identified ?? false
      return
    }
    events.value.unshift({ ...data, _id: nextId++ })
  }
  channel.postMessage({ type: 'devtools-ready' })
})

onUnmounted(() => {
  channel?.close()
})

const filteredEvents = computed(() => {
  return events.value.filter((ev) => {
    if (ev.type === 'status') return false
    if (!activeFilters.value.has(ev.type as EventType)) return false
    return true
  })
})

const countText = computed(() => {
  if (events.value.length === 0) return ''
  if (filteredEvents.value.length === events.value.length) return `${events.value.length}`
  return `${filteredEvents.value.length} / ${events.value.length}`
})

const toggleFilter = (type: EventType) => {
  const next = new Set(activeFilters.value)
  if (next.has(type)) next.delete(type)
  else next.add(type)
  activeFilters.value = next
}

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const clearEvents = () => {
  events.value = []
  expandedId.value = null
}

const formatTime = (ts?: number) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const getSummary = (ev: HubspotEvent) => {
  switch (ev.type) {
    case 'identify': return ev.userId ?? ''
    case 'track': return ev.event ?? ''
    case 'page': return (ev.properties as Record<string, unknown>)?.page as string ?? ''
    case 'reset': return 'Session cleared'
    default: return ''
  }
}

const getDetail = (ev: HubspotEvent): Record<string, unknown> | null => {
  switch (ev.type) {
    case 'identify': return { userId: ev.userId, traits: ev.traits }
    case 'track': return { event: ev.event, properties: ev.properties }
    case 'page': return ev.properties ?? null
    case 'reset': return null
    default: return null
  }
}

const syntaxHighlight = (obj: unknown, indent = 0): string => {
  if (obj === null || obj === undefined) return '<span class="op40 italic">null</span>'
  if (typeof obj === 'boolean') return `<span class="text-amber">${obj}</span>`
  if (typeof obj === 'number') return `<span class="text-blue">${obj}</span>`
  if (typeof obj === 'string') return `<span class="text-green">"${escapeHtml(obj)}"</span>`

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '<span class="op60">[]</span>'
    const pad = '  '.repeat(indent + 1)
    const closePad = '  '.repeat(indent)
    const items = obj.map(v => `${pad}${syntaxHighlight(v, indent + 1)}`).join(',\n')
    return `<span class="op60">[</span>\n${items}\n${closePad}<span class="op60">]</span>`
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj as Record<string, unknown>)
    if (keys.length === 0) return '<span class="op60">{}</span>'
    const pad = '  '.repeat(indent + 1)
    const closePad = '  '.repeat(indent)
    const entries = keys.map(k =>
      `${pad}<span class="text-purple">"${escapeHtml(k)}"</span><span class="op40">:</span> ${syntaxHighlight((obj as Record<string, unknown>)[k], indent + 1)}`,
    ).join(',\n')
    return `<span class="op60">{</span>\n${entries}\n${closePad}<span class="op60">}</span>`
  }

  return escapeHtml(String(obj))
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
</script>

<template>
  <div class="flex flex-col h-screen n-bg-base">
    <!-- Header -->
    <div class="flex-none flex items-center gap-2.5 px-4 py-2 border-b border-white/6 min-h-[49px]">
      <NIcon
        icon="mdi-hubspot"
        class="op60"
      />
      <span class="text-sm font-semibold">HubSpot</span>
      <NBadge
        v-if="countText"
        n="sm"
      >
        {{ countText }}
      </NBadge>
      <div class="flex-auto" />
      <div class="flex items-center gap-1.5">
        <span
          class="inline-block w-2 h-2 rounded-full"
          :class="identified ? 'bg-green' : 'bg-gray:50'"
        />
        <span
          class="text-xs"
          :class="identified ? 'text-green' : 'op40'"
        >
          {{ identified ? 'Identified' : 'Anonymous' }}
        </span>
      </div>
      <NButton
        n="xs"
        icon="carbon-trash-can"
        :disabled="events.length === 0"
        @click="clearEvents"
      >
        Clear
      </NButton>
    </div>

    <!-- Filters -->
    <div class="flex-none flex items-center gap-3 px-4 py-1.5 border-b border-white/6 flex-wrap">
      <div class="flex items-center gap-1">
        <button
          v-for="type in EVENT_TYPES"
          :key="type"
          class="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border border-white/8 transition-all"
          :class="activeFilters.has(type)
            ? `text-${TYPE_STYLES[type].color} border-${TYPE_STYLES[type].color}/30 bg-${TYPE_STYLES[type].color}/8`
            : 'op30 border-transparent hover:op50'"
          @click="toggleFilter(type)"
        >
          <NIcon
            :icon="TYPE_STYLES[type].icon"
            class="text-xs"
          />
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Event list -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- Empty state -->
      <div
        v-if="filteredEvents.length === 0"
        class="flex flex-col items-center pt-20 gap-2"
      >
        <NIcon
          icon="mdi-hubspot"
          class="text-4xl op15"
        />
        <p class="op40 text-sm">
          {{ events.length === 0 ? 'Waiting for events...' : 'No events match filters' }}
        </p>
        <p class="op20 text-xs">
          {{ events.length === 0 ? 'Interact with your app to see HubSpot events here' : 'Try adjusting the type or date filters above' }}
        </p>
      </div>

      <!-- Events -->
      <div
        v-for="ev in filteredEvents"
        v-else
        :key="ev._id"
        class="border-b border-white/6 group"
      >
        <button
          class="flex items-center gap-3 w-full px-4 py-2 text-left hover:n-bg-hover transition-colors"
          @click="toggleExpand(ev._id)"
        >
          <!-- Chevron -->
          <div class="w-4 flex-none flex items-center justify-center">
            <NIcon
              v-if="getDetail(ev)"
              icon="carbon-chevron-right"
              class="text-xs op40 transition-transform duration-150"
              :class="{ 'rotate-90': expandedId === ev._id }"
            />
          </div>

          <!-- Time -->
          <span class="text-xs font-mono op40 w-16 flex-none tabular-nums">
            {{ formatTime(ev.timestamp) }}
          </span>

          <!-- Type badge -->
          <span
            class="px-2 py-0.5 rounded-md text-xs font-medium w-18 text-center flex-none flex items-center justify-center gap-1"
            :class="`text-${TYPE_STYLES[ev.type as EventType].color} bg-${TYPE_STYLES[ev.type as EventType].color}/10`"
          >
            <NIcon
              :icon="TYPE_STYLES[ev.type as EventType].icon"
              class="text-2.5"
            />
            {{ ev.type }}
          </span>

          <!-- Summary -->
          <span
            class="text-sm truncate"
            :class="ev.type === 'reset' ? 'op40 italic' : 'op70'"
          >
            {{ getSummary(ev) }}
          </span>
        </button>

        <!-- Expanded detail -->
        <Transition name="slide">
          <div
            v-if="expandedId === ev._id && getDetail(ev)"
            class="px-4 pb-3 ml-7"
          >
            <div class="rounded-lg border border-white/6 overflow-hidden">
              <pre
                class="text-xs font-mono p-3 leading-relaxed overflow-x-auto n-bg-active"
                v-html="syntaxHighlight(getDetail(ev))"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.15s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>

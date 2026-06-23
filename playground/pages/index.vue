<script setup lang="ts">
import { ref } from 'vue'
import { useTracking } from '../composables/useTracking'

const { identify, reset, track } = useTracking()
const identified = ref(false)

const handleIdentify = () => {
  identify('john@example.com', {
    email: 'john@example.com',
    name: 'John Doe',
    plan: 'pro',
  })
  identified.value = true
}

const handleReset = () => {
  reset()
  identified.value = false
}

const handleSearch = () => {
  track('search', { query: 'nuxt modules' })
}
</script>

<template>
  <div>
    <h2>Identity & Events</h2>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div class="card">
        <p class="card-title">
          User Identity
        </p>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <button class="btn btn-primary" :disabled="identified" @click="handleIdentify">
            Identify User
          </button>
          <button class="btn btn-danger" :disabled="!identified" @click="handleReset">
            Reset
          </button>
        </div>
        <p class="hint">
          {{ identified ? 'Identified as john@example.com' : 'Not identified — events are blocked until you identify' }}
        </p>
      </div>

      <div class="card">
        <p class="card-title">
          Custom Events
        </p>
        <button class="btn btn-secondary" @click="handleSearch">
          Search "nuxt modules"
        </button>
        <p class="hint">
          Fires a typesafe <code>search</code> event
        </p>
      </div>
    </div>
  </div>
</template>

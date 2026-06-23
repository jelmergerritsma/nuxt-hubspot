<script setup lang="ts">
const hubspot = useHubspot()
</script>

<template>
  <div>
    <div id="status">
      hubspot-loaded
    </div>
    <button id="identify" @click="hubspot.identify('test@example.com', { name: 'Test User' })">
      Identify
    </button>
    <button id="track" @click="hubspot.log('test_event', { value: 42 })">
      Track
    </button>
    <button id="reset" @click="hubspot.reset()">
      Reset
    </button>
  </div>
</template>

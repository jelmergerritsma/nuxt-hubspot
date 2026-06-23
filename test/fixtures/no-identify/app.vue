<script setup lang="ts">
const hubspot = useHubspot()
</script>

<template>
  <div>
    <div id="status">
      no-identify
    </div>
    <button
      id="track"
      @click="hubspot.log('test_event', { value: 1 })"
    >
      Track
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTracking } from '../composables/useTracking'
import { useCart } from '../composables/useCart'

const { track } = useTracking()
const { items, total, clear } = useCart()
const completed = ref(false)

const handleCheckout = () => {
  track('checkout', {
    products: items.value.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
    total: total.value,
  })
  completed.value = true
  clear()
}
</script>

<template>
  <div>
    <h2>Checkout</h2>

    <div v-if="items.length === 0 && !completed" class="card" style="max-width: 360px; text-align: center; padding: 32px 16px;">
      <p style="color: #555; margin-bottom: 8px;">
        Your cart is empty
      </p>
      <NuxtLink to="/products" style="color: #00dc82; font-size: 14px; text-decoration: none;">
        Browse products →
      </NuxtLink>
    </div>

    <div v-else-if="completed" class="card" style="max-width: 360px; text-align: center; padding: 32px 16px;">
      <p style="font-size: 24px; margin-bottom: 8px;">
        ✅
      </p>
      <p style="font-weight: 600; margin-bottom: 4px;">
        Order placed
      </p>
      <p class="hint" style="color: #00dc82;">
        Checkout event sent to HubSpot
      </p>
      <NuxtLink to="/products" style="color: #888; font-size: 13px; text-decoration: none; display: inline-block; margin-top: 12px;">
        Continue shopping →
      </NuxtLink>
    </div>

    <div v-else class="card" style="max-width: 360px;">
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #1a1a1a;">
        <div
          v-for="item in items"
          :key="item.name"
          style="display: flex; justify-content: space-between; font-size: 14px; color: #888;"
        >
          <span>{{ item.name }} <span v-if="item.quantity > 1" style="color: #555;">×{{ item.quantity }}</span></span>
          <span>${{ item.price * item.quantity }}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 600; margin-bottom: 16px;">
        <span>Total</span>
        <span>${{ total }}</span>
      </div>

      <button class="btn btn-primary" style="width: 100%;" @click="handleCheckout">
        Complete Checkout
      </button>
    </div>
  </div>
</template>

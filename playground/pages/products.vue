<script setup lang="ts">
import { useTracking } from '../composables/useTracking'
import { useCart } from '../composables/useCart'

const { track } = useTracking()
const { addItem } = useCart()

const products = [
  { name: 'Nuxt UI Pro', price: 249, icon: '🎨' },
  { name: 'Nuxt Studio', price: 99, icon: '✏️' },
  { name: 'Nuxt Hub', price: 0, icon: '🚀' },
]

const handleAdd = (product: typeof products[number]) => {
  addItem(product.name, product.price)
  track('add_to_cart', { product: product.name, quantity: 1 })
}
</script>

<template>
  <div>
    <h2>Products</h2>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div
        v-for="product in products"
        :key="product.name"
        class="card"
        style="display: flex; align-items: center; gap: 12px;"
      >
        <span style="font-size: 24px;">{{ product.icon }}</span>
        <div style="flex: 1;">
          <p style="font-weight: 600; font-size: 14px;">
            {{ product.name }}
          </p>
          <p style="color: #666; font-size: 13px;">
            {{ product.price === 0 ? 'Free' : `$${product.price}` }}
          </p>
        </div>
        <button class="btn btn-secondary" @click="handleAdd(product)">
          Add to Cart
        </button>
      </div>
    </div>

    <p class="hint" style="margin-top: 12px;">
      Each button fires an <code>add_to_cart</code> event
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCart } from './composables/useCart'

const { count } = useCart()
</script>

<template>
  <div class="app">
    <header>
      <div class="logo">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M17.5 8.5c0-1.38-1.12-2.5-2.5-2.5V4a1 1 0 0 0-2 0v2h-2V4a1 1 0 0 0-2 0v2c-1.38 0-2.5 1.12-2.5 2.5v1c0 1.38 1.12 2.5 2.5 2.5h6c1.38 0 2.5-1.12 2.5-2.5v-1z"
            fill="#ff7a59"
          />
          <circle
            cx="12"
            cy="17"
            r="4"
            fill="#ff7a59"
            opacity="0.6"
          />
        </svg>
        <span>nuxt-hubspot</span>
      </div>
      <p class="subtitle">
        Open DevTools → HubSpot tab to see events
      </p>
    </header>

    <nav>
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/products">
        Products
      </NuxtLink>
      <NuxtLink to="/checkout">
        Checkout
        <span
          v-if="count > 0"
          class="badge"
        >{{ count }}</span>
      </NuxtLink>
    </nav>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a0a;
  color: #e5e5e5;
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 48px 24px;
}

header {
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

nav {
  display: flex;
  gap: 4px;
  margin-bottom: 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1a1a1a;
}

nav a {
  color: #888;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}

nav a:hover {
  color: #e5e5e5;
  background: #1a1a1a;
}

nav a.router-link-exact-active {
  color: #00dc82;
  background: rgba(0, 220, 130, 0.08);
}

.badge {
  background: #00dc82;
  color: #0a0a0a;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

h2 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
}

.card {
  padding: 16px;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  background: #111;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-primary {
  background: #00dc82;
  color: #0a0a0a;
}

.btn-primary:not(:disabled):hover {
  background: #00c574;
}

.btn-danger {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.btn-danger:not(:disabled):hover {
  background: rgba(248, 113, 113, 0.25);
}

.btn-secondary {
  background: #1a1a1a;
  color: #e5e5e5;
}

.btn-secondary:hover {
  background: #252525;
}

.hint {
  color: #555;
  font-size: 12px;
  margin-top: 8px;
}

code {
  background: #1a1a1a;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
  color: #00dc82;
}
</style>

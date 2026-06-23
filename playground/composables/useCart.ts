import { ref, computed } from 'vue'

type CartItem = {
  name: string
  price: number
  quantity: number
}

const items = ref<CartItem[]>([])

export const useCart = () => {
  const addItem = (name: string, price: number) => {
    const existing = items.value.find(i => i.name === name)
    if (existing) {
      existing.quantity++
    }
    else {
      items.value.push({ name, price, quantity: 1 })
    }
  }

  const clear = () => {
    items.value = []
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  return {
    items,
    addItem,
    clear,
    total,
    count,
  }
}

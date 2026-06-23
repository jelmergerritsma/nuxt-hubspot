import { useHubspot, createTracker } from '#imports'

type AddToCartProps = {
  product: string
  quantity: number
}

type CheckoutProps = {
  products: { name: string, quantity: number, price: number }[]
  total: number
}

type SearchProps = {
  query: string
}

type TrackingEventMap = {
  add_to_cart: AddToCartProps
  checkout: CheckoutProps
  search: SearchProps
}

export const useTracking = () => {
  const { identify, page, reset } = useHubspot()
  const track = createTracker<TrackingEventMap>()

  return {
    identify,
    page,
    reset,
    track,
  }
}

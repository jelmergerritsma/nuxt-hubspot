import { describe, it, expect, vi } from 'vitest'

describe('createTracker type contract', () => {
  it('calls log with the correct event name and properties', () => {
    const mockLog = vi.fn()

    type TestEventMap = {
      checkout: { products: string[], total: number }
      signup: { email: string }
    }

    const createTrackerWith = <T extends Record<string, Record<string, unknown>>>(log: (event: string, properties: Record<string, unknown>) => void) => {
      return <K extends keyof T & string>(event: K, properties: T[K]) => {
        log(event, properties)
      }
    }

    const track = createTrackerWith<TestEventMap>(mockLog)

    track('checkout', { products: ['A', 'B'], total: 100 })
    expect(mockLog).toHaveBeenCalledWith('checkout', { products: ['A', 'B'], total: 100 })

    track('signup', { email: 'test@example.com' })
    expect(mockLog).toHaveBeenCalledWith('signup', { email: 'test@example.com' })
  })
})

describe('noop client', () => {
  it('all methods are callable without errors', () => {
    const noop = {
      log: () => {},
      identify: () => {},
      page: () => {},
      reset: () => {},
    }

    expect(() => noop.log('event', {})).not.toThrow()
    expect(() => noop.identify('user', {})).not.toThrow()
    expect(() => noop.page({})).not.toThrow()
    expect(() => noop.reset()).not.toThrow()
  })
})

import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('with portal ID', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('boots and serves the SPA shell', async () => {
    const html = await $fetch('/')
    expect(html).toContain('__nuxt')
  })

  it('includes the runtime config with portal ID', async () => {
    const html = await $fetch('/')
    expect(html).toContain('test-portal-123')
  })
})

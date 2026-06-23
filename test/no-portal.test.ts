import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('without portal ID', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/no-portal', import.meta.url)),
  })

  it('boots without crashing and serves a page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('__nuxt')
  })
})

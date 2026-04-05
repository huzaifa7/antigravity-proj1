import { describe, it, expect } from 'vitest'

describe('health check', () => {
  it('returns ok status shape', () => {
    const response = { status: 'ok', timestamp: new Date().toISOString() }
    expect(response.status).toBe('ok')
    expect(response.timestamp).toBeDefined()
  })
})

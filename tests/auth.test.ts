import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@tarojs/taro', () => ({
  default: {
    getStorageSync: vi.fn(),
    setStorageSync: vi.fn(),
    removeStorageSync: vi.fn(),
    login: vi.fn(),
  },
}))

import Taro from '@tarojs/taro'
import { ensureToken, authenticatedFetch } from '../src/utils/auth'

describe('auth flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    ;(globalThis as any).fetch = vi.fn()
  })

  it('logs in and caches token when missing', async () => {
    ;(Taro.getStorageSync as any).mockReturnValue('')
    ;(Taro.login as any).mockImplementation(({ success }: any) => success({ code: 'wx-code-123' }))
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'jwt-123' }),
    })

    const token = await ensureToken()

    expect(token).toBe('jwt-123')
    expect(Taro.setStorageSync).toHaveBeenCalledWith('token', 'jwt-123')
  })

  it('retries once after 401', async () => {
    ;(Taro.getStorageSync as any).mockReturnValue('stale-token')
    ;(Taro.login as any).mockImplementation(({ success }: any) => success({ code: 'wx-code-456' }))
    let requestCount = 0
    ;(fetch as any).mockImplementation(async (url: string) => {
      if (String(url).includes('/api/auth/login')) {
        return {
          status: 200,
          ok: true,
          json: async () => ({ token: 'jwt-456' }),
        }
      }

      requestCount += 1
      return requestCount === 1
        ? {
            status: 401,
            ok: false,
            json: async () => ({ error: { message: 'Unauthorized' } }),
          }
        : {
            status: 200,
            ok: true,
            json: async () => ({ ok: true }),
          }
    })

    const res = await authenticatedFetch('/api/profile')

    expect(res.status).toBe(200)
    expect(Taro.removeStorageSync).toHaveBeenCalledWith('token')
  })
})

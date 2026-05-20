import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:3001'
const TOKEN_KEY = 'token'

type LoginResponse = {
  token: string
  isNewUser?: boolean
  trialExpiresAt?: string
}

export async function ensureToken(): Promise<string> {
  const cached = Taro.getStorageSync(TOKEN_KEY)
  if (cached) return cached

  const code = await getLoginCode()
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })

  const data = (await res.json()) as LoginResponse
  if (!res.ok || !data.token) {
    throw new Error(data?.token ? 'Login failed' : 'Missing token')
  }

  Taro.setStorageSync(TOKEN_KEY, data.token)
  return data.token
}

export async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const token = await ensureToken()
  return requestWithToken(path, init, token)
}

export function clearToken() {
  Taro.removeStorageSync(TOKEN_KEY)
}

function getLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const login = (Taro as any).login
    if (typeof login !== 'function') {
      resolve('h5-dev-code')
      return
    }

    login({
      success(res: { code: string }) {
        if (res?.code) resolve(res.code)
        else reject(new Error('Missing login code'))
      },
      fail(err: any) {
        reject(err)
      },
    })
  })
}

async function requestWithToken(path: string, init: RequestInit, token: string, retried = false) {
  const headers = new Headers(init.headers || {})
  headers.set('Authorization', `Bearer ${token}`)

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (res.status === 401 && !retried) {
    clearToken()
    const refreshedToken = await ensureToken()
    return requestWithToken(path, init, refreshedToken, true)
  }

  return res
}

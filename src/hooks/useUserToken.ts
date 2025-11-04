import { useState, useEffect } from 'react'
import { QUIVER_USER_TOKEN_KEY } from '@/lib/constants'

export function useUserToken(): string | null {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let userToken = localStorage.getItem(QUIVER_USER_TOKEN_KEY)

    if (!userToken) {
      userToken = crypto.randomUUID()
      localStorage.setItem(QUIVER_USER_TOKEN_KEY, userToken)
      console.log('[useUserToken] Generated new token:', userToken)
    } else {
      console.log('[useUserToken] Using existing token:', userToken)
    }

    setToken(userToken)
  }, [])

  return token
}


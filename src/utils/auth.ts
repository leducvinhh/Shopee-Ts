import { User } from '@/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const setAuthToLS = (token?: string, user?: User) => {
  token && localStorage.setItem('access_token', token)
  user && localStorage.setItem('profile', JSON.stringify(user))
}

export const setRefreshTokenToLS = (token: string) => {
  localStorage.setItem('refresh_token', token)
}

export const clearAuthFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')

  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getRefreshTokenFromLS = () => {
  const refreshToken = localStorage.getItem('refresh_token') || ''
  return refreshToken
}

export const getAuthFromLS = () => {
  const token = localStorage.getItem('access_token') || ''
  const profile = localStorage.getItem('profile')

  return {
    token,
    profile: profile ? JSON.parse(profile) : null
  }
}

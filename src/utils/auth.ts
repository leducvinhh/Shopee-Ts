import { User } from '@/types/user.type'

export const setAuthToLS = (token: string, user: User) => {
  localStorage.setItem('access_token', token)
  localStorage.setItem('profile', JSON.stringify(user))
}

export const clearAuthFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAuthFromLS = () => {
  const token = localStorage.getItem('access_token') || ''
  const profile = localStorage.getItem('profile')

  return {
    token,
    profile: profile ? JSON.parse(profile) : null
  }
}

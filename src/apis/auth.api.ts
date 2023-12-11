import routerName from '@/router/routerName'
import { AuthResponse } from '@/types/auth.type'
import http from '@/utils/http'

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(routerName.register, body)
export const loginAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(routerName.login, body)
export const logout = () => http.post(routerName.logout)

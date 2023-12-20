import routerName from '@/router/routerName'
import { AuthResponse } from '@/types/auth.type'
import http from '@/utils/http'

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(routerName.register, body)
  },

  loginAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(routerName.login, body)
  },

  logout() {
    return http.post(routerName.logout)
  }
}

export default authApi

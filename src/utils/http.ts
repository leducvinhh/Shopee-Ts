import HttpStatusCode from '@/constants/httpStatusCode.enum'
import routerName from '@/router/routerName'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { clearAuthFromLS, getAuthFromLS, setAuthToLS } from './auth'
import { AuthResponse } from '@/types/auth.type'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAuthFromLS().token
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken) {
            config.headers['Authorization'] = this.accessToken
          }

          return config
        },
        (error) => {
          return Promise.reject(error)
        }
      ),
      this.instance.interceptors.response.use(
        (response) => {
          const url = response.config.url

          if (url === routerName.login || url === routerName.register) {
            const data = response.data as AuthResponse

            this.accessToken = data.data.access_token
            setAuthToLS(data.data.access_token, data.data.user)

            toast.success(url === routerName.login ? 'Đăng nhập thành công' : 'Đăng ký và đăng nhập thành công', {
              autoClose: 1000
            })
          } else if (url === routerName.logout) {
            this.accessToken = ''

            toast.success('Đăng xuất thành công', {
              autoClose: 1000
            })
          }

          return response
        },
        function (error: AxiosError) {
          if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data?.message || error.message
            toast.error(message)
          }

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            clearAuthFromLS()
          }

          return Promise.reject(error)
        }
      )
  }
}

const http = new Http().instance

export default http

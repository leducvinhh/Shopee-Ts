import HttpStatusCode from '@/constants/httpStatusCode.enum'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { clearAuthFromLS, getAuthFromLS, getRefreshTokenFromLS, setAuthToLS, setRefreshTokenToLS } from './auth'
import { AuthResponse, RefreshTokenResponse } from '@/types/auth.type'
import config from '@/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '@/apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from '@/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAuthFromLS().token
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    ;(this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60,
        'expire-refresh-token': 60 * 60 * 24 * 30
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

          if (url === URL_LOGIN || url === URL_REGISTER) {
            const data = response.data as AuthResponse

            this.accessToken = data.data.access_token
            this.refreshToken = data.data.refresh_token

            setAuthToLS(this.accessToken, data.data.user)
            setRefreshTokenToLS(this.refreshToken)

            toast.success(url === URL_LOGIN ? 'Đăng nhập thành công' : 'Đăng ký và đăng nhập thành công', {
              autoClose: 1000
            })
          } else if (url === URL_LOGOUT) {
            this.accessToken = ''
            this.refreshToken = ''
            clearAuthFromLS()

            toast.success('Đăng xuất thành công', {
              autoClose: 1000
            })
          }

          return response
        },
        (error: AxiosError) => {
          // toast khi loi khong phai loi 422 va loi 401
          if (
            ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
              error.response?.status as number
            )
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data?.message || error.message
            toast.error(message)
          }

          // loi 401 thi có nhiều trường hợp
          // 1. token hết hạn
          // 2. token sai
          // 3. không gửi token
          if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
            const config = error?.response?.config
            if (!config) return Promise.reject(error)

            const { url } = config

            // token het han va request refresh token chua duoc tao
            if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
              // han che goi token 2 lan
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    this.refreshTokenRequest = null
                  })

              return this.refreshTokenRequest?.then((access_token) => {
                config.headers['Authorization'] = access_token

                return this.instance(config)
              })
            }

            // cac truong hop con lai
            clearAuthFromLS()
            this.accessToken = ''
            this.refreshToken = ''
            toast.error(error.response?.data?.data?.message || error.response?.data.message)
          }

          return Promise.reject(error)
        }
      )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((response) => {
        const { access_token } = response.data.data
        this.accessToken = access_token
        setAuthToLS(this.accessToken)

        return access_token
      })
      .catch((error) => {
        clearAuthFromLS()
        this.accessToken = ''
        this.refreshToken = ''

        throw error
      })
  }
}

const http = new Http().instance

export default http

import { Link } from 'react-router-dom'
import { schemaLogin, TLoginSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { loginAccount } from '@/apis/auth.api'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import Input from '@/components/Input'
import Button from '@/components/Button'
import routerName from '@/router/routerName'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { AuthResponse } from '@/types/auth.type'

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<TLoginSchema>({
    resolver: yupResolver(schemaLogin)
  })

  const loginMutation = useMutation({
    mutationFn: (body: TLoginSchema) => loginAccount(body)
  })

  const formSubmitHandler = handleSubmit((data) => {
    if (loginMutation.isLoading) return

    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const data = response.data as AuthResponse

        setIsAuthenticated(true)
        setProfile(data.data.user)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<TLoginSchema>>(error)) {
          const formError = error.response?.data.data

          if (!formError) return

          Object.keys(formError).forEach((key) => {
            setError(key as keyof TLoginSchema, {
              message: formError[key as keyof TLoginSchema],
              type: 'Server'
            })
          })
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={formSubmitHandler} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>

              <Input
                name='email'
                register={register}
                className='mt-8'
                type='email'
                errorsMessage={errors.email?.message}
                placeholder='Email'
              />

              <Input
                name='password'
                register={register}
                className='mt-2'
                type='password'
                errorsMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />

              <div className='mt-3'>
                <Button
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                >
                  Login
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-x-2'>
                <span className='text-gray-400'>Bạn chưa có tài khoản</span>
                <Link to={routerName.register} className='text-red-400 underline'>
                  Đăng Ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

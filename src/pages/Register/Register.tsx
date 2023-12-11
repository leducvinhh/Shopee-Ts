import { registerAccount } from '@/apis/auth.api'
import Input from '@/components/Input'
import { schemaRegister, TRegisterSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import Button from '@/components/Button'
import routerName from '@/router/routerName'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { AuthResponse } from '@/types/auth.type'

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<TRegisterSchema>({
    resolver: yupResolver(schemaRegister)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<TRegisterSchema, 'confirm_password'>) => registerAccount(body)
  })

  const formSubmitHandler = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      onSuccess: (response) => {
        const data = response.data as AuthResponse

        setIsAuthenticated(true)
        setProfile(data.data.user)
      },

      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<TRegisterSchema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data

          if (!formError) return

          Object.keys(formError).forEach((key) => {
            setError(key as keyof Omit<TRegisterSchema, 'confirm_password'>, {
              message: formError[key as keyof Omit<TRegisterSchema, 'confirm_password'>],
              type: 'Server'
            })
          })

          // Different ways
          // if (formError.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }

          // if (formError.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
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
              <div className='text-2xl'>Đăng Ký</div>

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

              <Input
                name='confirm_password'
                register={register}
                className='mt-2'
                type='password'
                errorsMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                >
                  Register
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-x-2'>
                <span className='text-gray-400'>Bạn đã có tài khoản</span>
                <Link to={routerName.login} className='text-red-400 underline'>
                  Đăng Nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

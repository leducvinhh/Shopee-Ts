import { registerAccount } from '@/apis/auth.api'
import Input from '@/components/Input'
import { schemaRegister, TRegisterSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ResponseApi } from '@/types/utils.type'

export default function Register() {
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
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<TRegisterSchema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          console.log(formError)

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
                <button
                  type='submit'
                  className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Register
                </button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-x-2'>
                <span className='text-gray-400'>Bạn đã có tài khoản</span>
                <Link to='/login' className='text-red-400 underline'>
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

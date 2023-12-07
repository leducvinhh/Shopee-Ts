import { Link } from 'react-router-dom'
import { schemaLogin, TLoginSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { loginAccount } from '@/apis/auth.api'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ResponseApi } from '@/types/utils.type'
import Input from '@/components/Input'

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<TLoginSchema>({
    resolver: yupResolver(schemaLogin)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: TLoginSchema) => loginAccount(body)
  })

  const formSubmitHandler = handleSubmit((data) => {
    registerAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<TLoginSchema>>(error)) {
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
                <button
                  type='submit'
                  className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Login
                </button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-x-2'>
                <span className='text-gray-400'>Bạn chưa có tài khoản</span>
                <Link to='/register' className='text-red-400 underline'>
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

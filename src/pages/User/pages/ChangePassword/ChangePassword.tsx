import userApi, { BodyUpdateProfile } from '@/apis/user.api'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { ErrorResponse } from '@/types/utils.type'
import { UserSchema, userSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = omit(data, ['confirm_password'])
      const res = await updateProfileMutation.mutateAsync(body as BodyUpdateProfile)
      reset()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data

        if (!formError) return

        Object.keys(formError).forEach((key) => {
          setError(key as keyof FormData, {
            message: formError[key as keyof FormData] as string,
            type: 'Server'
          })
        })
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>

      <form
        className='mt-8 flex flex-col-reverse md:flex-row md:items-start'
        onSubmit={onSubmit}
      >
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
            <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Mật khẩu cũ</div>
            <div className='md:w-[80%] md:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                errorsMessage={errors.password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
            <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Mật khẩu mới</div>
            <div className='md:w-[80%] md:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                errorsMessage={errors.new_password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
            <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Nhập lại mật khẩu</div>
            <div className='md:w-[80%] md:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Nhập lại mật khẩu'
                errorsMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
            <div className='truncate pt-3 capitalize md:w-[20%] md:text-right' />
            <div className='md:w-[80%] md:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

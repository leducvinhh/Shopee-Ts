import userApi from '@/apis/user.api'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputNumber from '@/components/InputNumber'
import { UserSchema, userSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import DateSelect from '../../components/DateSlect'
import { toast } from 'react-toastify'
import { AppContext } from '@/contexts/app.context'
import { generateImageUrl, isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import InputFile from '@/components/InputFile'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & { date_of_birth: string }
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

const MAX_FILE_SIZE = 1024 * 1024

const Info = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <>
      <div className='mt-6 flex flex-col flex-wrap md:flex-row'>
        <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Tên</div>
        <div className='md:w-[80%] md:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Tên'
            errorsMessage={errors.name?.message}
          />
        </div>
      </div>

      <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
        <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Số điện thoại</div>
        <div className='md:w-[80%] md:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-none focus:shadow-sm px-3 py-2'
                placeholder='Số điện thoại'
                errorsMessage={errors.phone?.message}
                {...field}
                onChange={(event) => {
                  field.onChange(event)
                }}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}

export default function Profile() {
  const { setProfile, profile: profileContext } = useContext(AppContext)
  const [avatarUpload, setAvatarUpload] = useState<File>()

  const avatarUrl = avatarUpload ? URL.createObjectURL(avatarUpload) : ''

  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1),
      avatar: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    setError
  } = methods

  const { data: profileData, refetch } = useQuery({
    queryKey: 'profile',
    queryFn: userApi.getProfile
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)

  const profile = profileData?.data.data

  useEffect(() => {
    if (profile === undefined) return

    setValue('name', profile?.name)
    setValue('address', profile?.address)
    setValue('phone', profile?.phone)
    setValue('date_of_birth', profile?.date_of_birth ? new Date(profile?.date_of_birth) : new Date(1990, 0, 1))
    setValue('avatar', profile?.avatar)
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let imageName = ''

      if (avatarUpload) {
        const formData = new FormData()
        formData.append('image', avatarUpload)

        const res = await uploadAvatarMutation.mutateAsync(formData)

        setValue('avatar', res.data.data)
        imageName = res.data.data
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: imageName
      })

      localStorage.setItem('profile', JSON.stringify(res.data.data))
      setProfile(res.data.data)
      setAvatarUpload(undefined)
      toast.success(res.data.message)
      refetch()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data

        if (!formError) return

        Object.keys(formError).forEach((key) => {
          setError(key as keyof FormDataError, {
            message: formError[key as keyof FormDataError],
            type: 'Server'
          })
        })
      }
    }
  })

  const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && file.size <= MAX_FILE_SIZE && file?.type.includes('image')) {
      setAvatarUpload(file)
    } else {
      toast.error('File phải là hình ảnh và nhỏ hơn 1MB')
    }
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>

      <FormProvider {...methods}>
        <form
          className='mt-8 flex flex-col-reverse md:flex-row md:items-start'
          onSubmit={onSubmit}
        >
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap md:flex-row'>
              <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Email</div>
              <div className='md:w-[80%] md:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>

            <Info />

            <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
              <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Địa chỉ</div>
              <div className='md:w-[80%] md:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorsMessage={errors.address?.message}
                />
              </div>
              Info
            </div>

            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorsMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

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

          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={avatarUrl || generateImageUrl(profileContext?.avatar)}
                  alt='avatar'
                  className='h-full w-full cursor-pointer rounded-full object-cover'
                />
              </div>

              <InputFile onChange={handleChangeAvatar} />

              <div className='mt-3 text-gray-400'>Dụng lượng file tối đa 1 MBI</div>
              <div className='text-gray-400'>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

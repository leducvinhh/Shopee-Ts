import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import ChevronSvg from '../Svg/ChevronSvg'
import GlobalSvg from '../Svg/GlobalSvg'
import LogoSvg from '../Svg/LogoSvg'
import SearchSvg from '../Svg/SearchSvg'
import CartSvg from '../Svg/CartSvg'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import authApi from '@/apis/auth.api'
import routerName from '@/router/routerName'
import { clearAuthFromLS } from '@/utils/auth'
import useQueryConfig from '@/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { Schema, schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import purchaseApi from '@/apis/purchase.api'
import { purchasesStatus } from '@/constants/purchase'
import { formatCurrency } from '@/utils/utils'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function Header() {
  const queryClient = useQueryClient()
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const MAX_PURCHASES_IN_CART = 5

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const { isAuthenticated, profile, setIsAuthenticated, setProfile } = useContext(AppContext)

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthFromLS()

      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit((value) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: value.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: value.name
        }

    navigate({
      pathname: routerName.home,
      search: createSearchParams(config).toString()
    })
  })

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <header className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <div className='flex justify-end'>
          <Popover
            className='floatingBridge mr-6 flex cursor-pointer items-center py-1 hover:text-white/70'
            renderPopover={
              <div className='relative rounded-sm border border-t-0 border-gray-200 bg-white shadow-lg'>
                <div className='flex flex-col px-3 py-2'>
                  <button className='mb-2 px-3 py-2 hover:text-orange'>Tiếng Việt</button>
                  <button className='px-3 py-2 hover:text-orange'>English</button>
                </div>
              </div>
            }
          >
            <GlobalSvg />
            <span className='mx-1'>Tiếng Việt</span>
            <ChevronSvg />
          </Popover>

          {!isAuthenticated ? (
            <div className='flex items-center'>
              <Link
                to={routerName.register}
                className='mx-3 capitalize hover:text-white/70'
              >
                Đăng Ký
              </Link>
              <div className='h-4 border-r-[1px] border-r-white/40'></div>
              <Link
                to={routerName.login}
                className='mx-3 capitalize hover:text-white/70'
              >
                Đăng nhập
              </Link>
            </div>
          ) : (
            <Popover
              className='floatingBridge flex cursor-pointer items-center py-1 hover:text-white/70'
              renderPopover={
                <div className='relative rounded-sm border border-t-0 border-gray-200 bg-white shadow-sm'>
                  <div className='flex flex-col text-left'>
                    <Link
                      to='/'
                      className='inline-flex w-full p-3 hover:bg-[#fafafa] hover:text-[#00bfa5]'
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to='/'
                      className='inline-flex w-full p-3 hover:bg-[#fafafa] hover:text-[#00bfa5]'
                    >
                      Đơn mua
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='inline-flex w-full p-3 hover:bg-[#fafafa] hover:text-[#00bfa5]'
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              }
            >
              <div className='mr-2 flex h-6 w-6 shrink-0'>
                <img
                  src='https://down-vn.img.susercontent.com/file/ee2f0a65cf2f2ca1188a1fae30bfdb59_tn'
                  alt=''
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <div>{profile?.email}</div>
            </Popover>
          )}
        </div>

        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link
            to='/'
            className='col-span-2'
          >
            <LogoSvg fill='fill-white' />
          </Link>
          <form
            className='col-span-9'
            onSubmit={onSubmitSearch}
          >
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Free Ship Đơn Từ 0k'
                {...register('name')}
              />
              <button className='shrink-0 rounded-sm bg-orange px-6 py-2 hover:opacity-70'>
                <SearchSvg />
              </button>
            </div>
          </form>
          <div className=' col-span-1 justify-self-end'>
            <Popover
              className='floatingBridge flex cursor-pointer items-center py-1 hover:text-white/70'
              renderPopover={
                <div>
                  <div className='relative w-[25rem] max-w-[400px] rounded-sm border border-t-0 border-gray-200 bg-white text-sm shadow-lg'>
                    {purchasesInCart ? (
                      <div className='p-2'>
                        <p className='capitalize text-gray-400'>sản phẩm mới thêm</p>
                        <div className='mt-5'>
                          {purchasesInCart.slice(0, MAX_PURCHASES_IN_CART).map((purchase) => {
                            return (
                              <div
                                className='mt-2 flex py-2 hover:bg-gray-100'
                                key={purchase._id}
                              >
                                <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                                  <img
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                    className='h-11 w-11  object-cover'
                                  />
                                </div>
                                <div className='ml-2 flex-grow overflow-hidden'>
                                  <div className='truncate'>{purchase.product.name}</div>
                                </div>
                                <div className='ml-2 shrink-0'>
                                  <div className='text-orange'>₫{formatCurrency(purchase.product.price)}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className='mt-6 flex items-center justify-between'>
                          <div className='text-xs capitalize text-gray-500'>
                            {purchasesInCart.length - MAX_PURCHASES_IN_CART > 0
                              ? `${purchasesInCart.length - MAX_PURCHASES_IN_CART} Thêm hàng vào giỏ`
                              : ''}
                          </div>
                          <Link
                            to={routerName.cart}
                            className='rounded-sm bg-orange px-4 py-2 capitalize text-white hover:opacity-80'
                          >
                            Xem giỏ hàng
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center px-2 py-16'>
                        <div className='h-[100px] w-[100px]'>
                          <img
                            src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
                            alt=' no purchases'
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <p>chưa có sản phẩm</p>
                      </div>
                    )}
                  </div>
                </div>
              }
            >
              <Link
                to='/card'
                className='relative'
              >
                <CartSvg />
                {purchasesInCart && purchasesInCart?.length > 0 && (
                  <span className='absolute -right-1/3 top-0 flex w-6 items-center justify-center rounded-2xl bg-white text-xs text-orange'>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  )
}

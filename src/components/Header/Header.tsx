import { Link } from 'react-router-dom'
import LogoSvg from '../Svg/LogoSvg'
import SearchSvg from '../Svg/SearchSvg'
import CartSvg from '../Svg/CartSvg'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { useQuery } from 'react-query'
import routerName from '@/router/routerName'
import purchaseApi from '@/apis/purchase.api'
import { purchasesStatus } from '@/constants/purchase'
import { formatCurrency } from '@/utils/utils'
import NavHeader from '../NavHeader'
import useSearchProducts from '@/hooks/useSearchProducts'

const MAX_PURCHASES_IN_CART = 5

export default function Header() {
  const { register, onSubmitSearch } = useSearchProducts()

  const { isAuthenticated } = useContext(AppContext)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <header className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <NavHeader />

        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link
            to='/'
            className='col-span-2'
          >
            <LogoSvg className='h-8 w-full fill-white lg:h-11' />
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

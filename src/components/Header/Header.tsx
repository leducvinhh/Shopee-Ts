import { Link } from 'react-router-dom'
import ChevronSvg from '../Svg/ChevronSvg'
import GlobalSvg from '../Svg/GlobalSvg'
import LogoSvg from '../Svg/LogoSvg'
import SearchSvg from '../Svg/SearchSvg'
import CartSvg from '../Svg/CartSvg'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { useMutation } from 'react-query'
import authApi from '@/apis/auth.api'
import routerName from '@/router/routerName'
import { clearAuthFromLS } from '@/utils/auth'

export default function Header() {
  const { isAuthenticated, profile, setIsAuthenticated, setProfile } = useContext(AppContext)

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthFromLS()

      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }
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
          <form className='col-span-9'>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                name='search'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Free Ship Đơn Từ 0k'
              />
              <button className='shrink-0 rounded-sm bg-orange px-6 py-2 hover:opacity-70'>
                <SearchSvg />
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-end'>
            <Popover
              className='floatingBridge flex cursor-pointer items-center py-1 hover:text-white/70'
              renderPopover={
                <div>
                  <div className='relative max-w-[400px] rounded-sm border border-t-0 border-gray-200 bg-white text-sm shadow-lg'>
                    <div className='p-2'>
                      <p className='capitalize text-gray-400'>sản phẩm mới thêm</p>
                      <div className='mt-5'>
                        <div className='mt-4 flex'>
                          <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                            <img
                              src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lev5rhi2g0nra6_tn'
                              alt=''
                              className='h-11 w-11  object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>
                              (Bán chạy) Kệ gỗ đựng văn phòng phẩm để bàn giám đốc ADOTA mã KG22M668
                            </div>
                          </div>
                          <div className='ml-2 shrink-0'>
                            <div className='text-orange'>₫199.000</div>
                          </div>
                        </div>
                        <div className='mt-4 flex'>
                          <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                            <img
                              src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lev5rhi2g0nra6_tn'
                              alt=''
                              className='h-11 w-11  object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>
                              (Bán chạy) Kệ gỗ đựng văn phòng phẩm để bàn giám đốc ADOTA mã KG22M668
                            </div>
                          </div>
                          <div className='ml-2 shrink-0'>
                            <div className='text-orange'>₫199.000</div>
                          </div>
                        </div>
                        <div className='mt-4 flex'>
                          <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                            <img
                              src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lev5rhi2g0nra6_tn'
                              alt=''
                              className='h-11 w-11  object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>
                              (Bán chạy) Kệ gỗ đựng văn phòng phẩm để bàn giám đốc ADOTA mã KG22M668
                            </div>
                          </div>
                          <div className='ml-2 shrink-0'>
                            <div className='text-orange'>₫199.000</div>
                          </div>
                        </div>
                        <div className='mt-4 flex'>
                          <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                            <img
                              src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lev5rhi2g0nra6_tn'
                              alt=''
                              className='h-11 w-11  object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>
                              (Bán chạy) Kệ gỗ đựng văn phòng phẩm để bàn giám đốc ADOTA mã KG22M668
                            </div>
                          </div>
                          <div className='ml-2 shrink-0'>
                            <div className='text-orange'>₫199.000</div>
                          </div>
                        </div>
                        <div className='mt-4 flex'>
                          <div className='flex-shrink-0 rounded-sm border border-gray-200'>
                            <img
                              src='https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lev5rhi2g0nra6_tn'
                              alt=''
                              className='h-11 w-11  object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>
                              (Bán chạy) Kệ gỗ đựng văn phòng phẩm để bàn giám đốc ADOTA mã KG22M668
                            </div>
                          </div>
                          <div className='ml-2 shrink-0'>
                            <div className='text-orange'>₫199.000</div>
                          </div>
                        </div>
                      </div>

                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>thêm vào giỏ hàng</div>
                        <button className='rounded-sm bg-orange px-4 py-2 capitalize text-white hover:opacity-80'>
                          Xem giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <Link to='/card'>
                <CartSvg />
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  )
}

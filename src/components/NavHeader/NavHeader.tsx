import Popover from '../Popover'
import GlobalSvg from '../Svg/GlobalSvg'
import ChevronSvg from '../Svg/ChevronSvg'
import routerName from '@/router/routerName'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { useMutation, useQueryClient } from 'react-query'
import authApi from '@/apis/auth.api'
import { clearAuthFromLS } from '@/utils/auth'
import { purchasesStatus } from '@/constants/purchase'

export default function NavHeader() {
  const queryClient = useQueryClient()

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
  return (
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
                  to={routerName.profile}
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
  )
}

import EditSvg from '@/components/Svg/EditSvg'
import PurchaseSvg from '@/components/Svg/PurchaseSvg'
import UserSvg from '@/components/Svg/UserSvg'
import { AppContext } from '@/contexts/app.context'
import routerName from '@/router/routerName'
import { generateImageUrl } from '@/utils/utils'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <div>
      <div className='flex items-start border-b border-b-gray-200 py-4'>
        <Link
          to={routerName.profile}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          {profile?.avatar ? (
            <img
              className='h-full w-full object-cover'
              src={generateImageUrl(profile?.avatar)}
              alt='avatar'
            />
          ) : (
            <span className='flex h-full w-full items-center justify-center rounded-full bg-white text-gray-700'>
              {profile?.name?.slice(0, 1)}
            </span>
          )}
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.name}</div>
          <Link
            to={routerName.profile}
            className='flex items-center capitalize text-gray-500'
          >
            <EditSvg extraClass='mr-1' />
            sửa hồ sơ
          </Link>
        </div>
      </div>

      <div className='mt-7'>
        <NavLink
          to={routerName.profile}
          className={({ isActive }) =>
            classNames('mb-4 flex items-center gap-2 capitalize  transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <UserSvg />
          Tài khoản của tôi
        </NavLink>
        <NavLink
          to={routerName.changePassword}
          className={({ isActive }) =>
            classNames('mb-4 flex items-center gap-2 capitalize  transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <EditSvg />
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={routerName.historyPurchase}
          className={({ isActive }) =>
            classNames('mb-4 flex items-center gap-2 capitalize  transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <PurchaseSvg />
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}

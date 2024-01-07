import EditSvg from '@/components/Svg/EditSvg'
import PurchaseSvg from '@/components/Svg/PurchaseSvg'
import UserSvg from '@/components/Svg/UserSvg'
import routerName from '@/router/routerName'
import { Link } from 'react-router-dom'

export default function UserSideNav() {
  return (
    <div>
      <div className='flex items-start border-b border-b-gray-200 py-4'>
        <Link
          to={routerName.profile}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          <img
            className='h-full w-full object-cover'
            src='https://down-vn.img.susercontent.com/file/ee2f0a65cf2f2ca1188a1fae30bfdb59_tn'
            alt='avatar'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>ldvinh</div>
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
        <Link
          to={routerName.profile}
          className='mb-4 flex items-center gap-2 capitalize text-orange transition-colors'
        >
          <UserSvg />
          Tài khoản của tôi
        </Link>
        <Link
          to={routerName.changePassword}
          className='mb-4 flex items-center gap-2 capitalize text-gray-600 transition-colors'
        >
          <EditSvg />
          Đổi mật khẩu
        </Link>
        <Link
          to={routerName.historyPurchase}
          className='flex items-center gap-2 capitalize text-gray-600 transition-colors'
        >
          <PurchaseSvg />
          Đơn mua
        </Link>
      </div>
    </div>
  )
}

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
import { generateImageUrl } from '@/utils/utils'
import { useTranslation } from 'react-i18next'

export default function NavHeader() {
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation(['product', 'home'])

  const textLanguage = i18n.language === 'vi' ? 'Tiếng Việt' : 'English'

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

  const handleLanguageChange = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='flex justify-end'>
      <Popover
        className='floatingBridge mr-6 flex cursor-pointer items-center py-1 hover:text-white/70'
        renderPopover={
          <div className='relative rounded-sm border border-t-0 border-gray-200 bg-white shadow-lg'>
            <div className='flex flex-col px-3 py-2'>
              <button
                className='mb-2 px-3 py-2 hover:text-orange'
                onClick={() => handleLanguageChange('vi')}
              >
                Tiếng Việt
              </button>
              <button
                className='px-3 py-2 hover:text-orange'
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
            </div>
          </div>
        }
      >
        <GlobalSvg />
        <span className='mx-1'>{textLanguage}</span>
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
                  {t('home:myAccount')}
                </Link>
                <Link
                  to='/'
                  className='inline-flex w-full p-3 hover:bg-[#fafafa] hover:text-[#00bfa5]'
                >
                  {t('home:purchase')}
                </Link>
                <button
                  onClick={handleLogout}
                  className='inline-flex w-full p-3 hover:bg-[#fafafa] hover:text-[#00bfa5]'
                >
                  {t('home:logout')}
                </button>
              </div>
            </div>
          }
        >
          <div className='mr-2 flex h-6 w-6 shrink-0'>
            {profile?.avatar ? (
              <img
                src={generateImageUrl(profile?.avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            ) : (
              <span className='flex h-full w-full items-center justify-center rounded-full bg-white text-gray-700'>
                {profile?.name?.slice(0, 1)}
              </span>
            )}
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
    </div>
  )
}

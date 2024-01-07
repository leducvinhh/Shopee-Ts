import { Link } from 'react-router-dom'
import NavHeader from '../NavHeader'
import LogoSvg from '../Svg/LogoSvg'
import routerName from '@/router/routerName'
import SearchSvg from '../Svg/SearchSvg'
import useSearchProducts from '@/hooks/useSearchProducts'

export default function CartHeader() {
  const { register, onSubmitSearch } = useSearchProducts()
  return (
    <div className='border-b border-b-black/10'>
      <div className='bg-orange text-white'>
        <div className='container'>
          <NavHeader />
        </div>
      </div>
      <div className='bg-white py-6'>
        <div className='container'>
          <nav className='md:flex md:items-center md:justify-between'>
            <Link
              to={routerName.home}
              className='flex flex-shrink-0 items-end'
            >
              <div>
                <LogoSvg className='h-8 fill-orange md:h-11' />
              </div>

              <div className='mx-4 h-6 w-[1px] bg-orange md:h-8'></div>

              <div className='capitalize text-orange md:text-xl'>giỏ hàng</div>
            </Link>

            <form
              className='mt-3 md:mt-0 md:w-[50%]'
              onSubmit={onSubmitSearch}
            >
              <div className='flex rounded-sm border-2 border-orange'>
                <input
                  type='text'
                  className='w-full flex-grow border-none bg-transparent px-3 py-1 text-black outline-none'
                  placeholder='Free Ship Đơn Từ 0k'
                  {...register('name')}
                />
                <button className='shrink-0 rounded-sm bg-orange px-8 py-2 hover:opacity-90'>
                  <SearchSvg className='h-4 w-4 stroke-white' />
                </button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </div>
  )
}

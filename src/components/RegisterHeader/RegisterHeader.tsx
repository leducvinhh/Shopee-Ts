import { Link } from 'react-router-dom'
import LogoSvg from '@/components/Svg/LogoSvg'

export default function RegisterHeader() {
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='flex items-end'>
          <Link to='/'>
            <LogoSvg fill='fill-orange' />
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>Đăng ký</div>
        </nav>
      </div>
    </header>
  )
}

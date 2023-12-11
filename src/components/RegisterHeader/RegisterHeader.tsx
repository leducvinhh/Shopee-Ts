import { Link, useMatch } from 'react-router-dom'
import LogoSvg from '@/components/Svg/LogoSvg'
import routerName from '@/router/routerName'

export default function RegisterHeader() {
  const registerMatch = useMatch(routerName.register)

  const isRegister = Boolean(registerMatch)
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='flex items-end'>
          <Link to='/'>
            <LogoSvg fill='fill-orange' />
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</div>
        </nav>
      </div>
    </header>
  )
}

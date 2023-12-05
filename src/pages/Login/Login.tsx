import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm'>
              <div className='text-2xl'>Đăng Nhập</div>

              <div className='mt-8'>
                <input
                  type='email'
                  name='email'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Please enter your email'
                />
                <div className='mt-1 min-h-[1rem] text-sm text-red-600'></div>
              </div>

              <div className='mt-3'>
                <input
                  type='password'
                  name='password'
                  autoComplete='on'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Please enter your password'
                />
                <div className='mt-1 min-h-[1rem] text-sm text-red-600'></div>
              </div>

              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Login
                </button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-x-2'>
                <span className='text-gray-400'>Bạn chưa có tài khoản</span>
                <Link to='/register' className='text-red-400 underline'>
                  Đăng Ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

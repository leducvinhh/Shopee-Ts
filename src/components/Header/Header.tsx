import { Link } from 'react-router-dom'
import ChevronSvg from '../Svg/ChevronSvg'
import GlobalSvg from '../Svg/GlobalSvg'
import LogoSvg from '../Svg/LogoSvg'
import SearchSvg from '../Svg/SearchSvg'
import CartSvg from '../Svg/CartSvg'
import { useRef, useState } from 'react'
import { FloatingPortal, useFloating, FloatingArrow, arrow, offset, shift, flip } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<SVGSVGElement>(null)
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      offset(2),
      shift(),
      flip(),
      arrow({
        element: arrowRef
      })
    ]
  })

  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <div className='flex justify-end'>
          <div
            className='mr-6 flex cursor-pointer items-center py-1 hover:text-gray-300'
            onMouseOver={showPopover}
            onMouseLeave={hidePopover}
            ref={refs.setReference}
          >
            <GlobalSvg />
            <span className='mx-1'>Tiếng Việt</span>
            <ChevronSvg />
          </div>

          <FloatingPortal>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ ...context, opacity: 0, scale: 0 }}
                  animate={{ ...context, opacity: 1, scale: 1 }}
                  exit={{ ...context, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  ref={refs.setFloating}
                  style={floatingStyles}
                >
                  <FloatingArrow ref={arrowRef} context={context} className='h-4 w-4 fill-white' />

                  <div className='relative rounded-sm border border-t-0 border-gray-200 bg-white shadow-sm'>
                    <div className='flex flex-col px-3 py-2'>
                      <button className='mb-2 px-3 py-2 hover:text-orange'>Tiếng Việt</button>
                      <button className='px-3 py-2 hover:text-orange'>English</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FloatingPortal>
          <div className='flex cursor-pointer items-center py-1 hover:text-gray-300'>
            <div className='mr-2 flex h-6 w-6 shrink-0'>
              <img
                src='https://down-vn.img.susercontent.com/file/ee2f0a65cf2f2ca1188a1fae30bfdb59_tn'
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div>Đức Vinh</div>F
          </div>
        </div>

        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to='/' className='col-span-2'>
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
          <div className='col-span-1 col-start-12 flex justify-end'>
            <Link to='/card'>
              <CartSvg />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

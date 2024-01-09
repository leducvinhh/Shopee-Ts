import { InputHTMLAttributes, useState } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import EyeSvg from '../Svg/EyeSvg'
import EyeSlashSvg from '../Svg/EyeSlashSvg'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorsMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorsMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  const [openEye, setOpenEye] = useState(false)

  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password'
    }

    return rest.type
  }

  return (
    <div className={className}>
      <div className='relative'>
        <input
          className={classNameInput}
          {...registerResult}
          {...rest}
          type={handleType()}
        />

        {rest.type === 'password' && openEye && (
          <span
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
            onClick={() => setOpenEye(!openEye)}
          >
            <EyeSvg />
          </span>
        )}

        {rest.type === 'password' && !openEye && (
          <span
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
            onClick={() => setOpenEye(!openEye)}
          >
            <EyeSlashSvg />
          </span>
        )}
      </div>
      <div className={classNameError}>{errorsMessage}</div>
    </div>
  )
}

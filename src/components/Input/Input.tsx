import { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorsMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
}

type IType = {
  name: string
  type: string
  placeholder: string
  autoComplete: string
}

const keysOfIType: Array<keyof IType> = Object.keys({} as IType) as Array<keyof IType>

console.log(keysOfIType) // Output: ["name", "type", "placeholder", "autoComplete"]

export default function Input({
  type,
  errorsMessage,
  placeholder,
  autoComplete,
  className,
  name,
  register,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600'
}: Props) {
  const registerResult = register && name ? register(name) : {}

  return (
    <div className={className}>
      <input
        autoComplete={autoComplete}
        type={type}
        className={classNameInput}
        placeholder={placeholder}
        {...registerResult}
      />
      <div className={classNameError}>{errorsMessage}</div>
    </div>
  )
}

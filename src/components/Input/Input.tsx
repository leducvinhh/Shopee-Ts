import { UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.InputHTMLAttributes<HTMLInputElement>['type']
  errorsMessage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  autoComplete?: 'on' | 'off'
}

export default function Input({ type, errorsMessage, placeholder, autoComplete, className, name, register }: Props) {
  return (
    <div className={className}>
      <input
        autoComplete={autoComplete}
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        placeholder={placeholder}
        {...register(name)}
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorsMessage}</div>
    </div>
  )
}

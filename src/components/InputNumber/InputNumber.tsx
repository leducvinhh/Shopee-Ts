import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorsMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorsMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    value,
    onChange,
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>((value as string) || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)

      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        ref={ref}
        className={classNameInput}
        {...rest}
        value={value || localValue}
        onChange={handleChange}
      />
      <div className={classNameError}>{errorsMessage}</div>
    </div>
  )
})

export default InputNumber

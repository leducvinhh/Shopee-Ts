import InputNumber, { InputNumberProps } from '@/components/InputNumber'
import MinusSvg from '@/components/Svg/MinusSvg'
import PlusSvg from '@/components/Svg/PlusSvg'
import classNames from 'classnames'
import { useRef, useState } from 'react'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onDecrease,
  onIncrease,
  onType,
  onFocusOut,
  classNameWrapper = 'ml-10',
  value,
  disabled,
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value) || 1)
  const test = useRef<number>((value as number) || localValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)

    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    if (max !== undefined && localValue === max) return

    let _value = Number(localValue) + 1

    if (max !== undefined && _value > max) {
      _value = max
    }

    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    if (localValue === 1) return

    let _value = Number(localValue) - 1

    if (_value < 1) {
      _value = 1
    }

    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const _value = Number(e.target.value)
    if (value === test.current) return

    if (onFocusOut) {
      onFocusOut(_value)
      test.current = _value
    }
  }
  return (
    <div className={classNameWrapper + ' flex items-center'}>
      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600',
          {
            'disabled: cursor-not-allowed bg-gray-100': localValue === 1 || disabled
          }
        )}
        onClick={decrease}
        disabled={localValue === 1 || disabled}
      >
        <MinusSvg />
      </button>

      <InputNumber
        value={value || localValue}
        classNameError='hidden'
        className=''
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />

      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600',
          {
            'disabled: cursor-not-allowed bg-gray-100': (max !== undefined && localValue === max) || disabled
          }
        )}
        onClick={increase}
        disabled={(max !== undefined && localValue === max) || disabled}
      >
        <PlusSvg />
      </button>
    </div>
  )
}

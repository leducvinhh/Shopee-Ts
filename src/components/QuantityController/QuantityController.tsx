import InputNumber, { InputNumberProps } from '@/components/InputNumber'
import MinusSvg from '@/components/Svg/MinusSvg'
import PlusSvg from '@/components/Svg/PlusSvg'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onDecrease,
  onIncrease,
  onType,
  classNameWrapper = 'ml-10',
  value,
  ...rest
}: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)

    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
  }
  const increase = () => {
    let _value = Number(value) + 1

    if (max !== undefined && _value > max) {
      _value = max
    }

    onIncrease && onIncrease(_value)
  }

  const decrease = () => {
    let _value = Number(value) - 1

    if (_value < 1) {
      _value = 1
    }

    onDecrease && onDecrease(_value)
  }
  return (
    <div className={classNameWrapper + ' flex items-center'}>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        onClick={decrease}
      >
        <MinusSvg />
      </button>
      <InputNumber
        value={value}
        classNameError='hidden'
        className=''
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        {...rest}
      />

      <div className='flex items-center'>
        <button
          className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
          onClick={increase}
        >
          <PlusSvg />
        </button>
      </div>
    </div>
  )
}

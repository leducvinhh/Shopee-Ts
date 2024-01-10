import range from 'lodash/range'
import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorsMessage?: string
  classNameError?: string
}

export default function DateSelect({
  onChange,
  value,
  errorsMessage,
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600'
}: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    const newDate = {
      ...date,
      [name]: Number(value)
    }

    setDate(newDate)
    if (onChange) onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 0,
        year: value?.getFullYear() || 1990
      })
    }
  }, [value])

  return (
    <>
      <div className='mt-2 flex flex-col flex-wrap md:flex-row'>
        <div className='truncate pt-3 capitalize md:w-[20%] md:text-right'>Ngày sinh</div>
        <div className='md:w-[80%] md:pl-5'>
          <div className='flex justify-between'>
            <select
              className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange/80'
              value={value?.getDate() || date.date}
              name='date'
              onChange={handleChange}
            >
              {range(1, 32).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange/80'
              value={value?.getMonth() || date.month}
              name='month'
              onChange={handleChange}
            >
              {range(0, 12).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item + 1}
                </option>
              ))}
            </select>

            <select
              className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange/80'
              value={value?.getFullYear() || date.year}
              name='year'
              onChange={handleChange}
            >
              {range(1900, new Date().getFullYear() + 1)
                .reverse()
                .map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className={classNameError}>{errorsMessage}</div>
    </>
  )
}

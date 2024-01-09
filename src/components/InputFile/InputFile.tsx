import { useRef } from 'react'

interface InputFileProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputFile = ({ onChange }: InputFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={inputRef}
        onChange={onChange}
        onClick={(e) => {
          ;(e.target as HTMLInputElement).value = ''
        }}
      />

      <button
        className='flex h-10 w-24 items-center justify-center rounded-sm border bg-white text-sm capitalize text-gray-600 shadow-sm'
        type='button'
        onClick={() => inputRef.current?.click()}
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default InputFile

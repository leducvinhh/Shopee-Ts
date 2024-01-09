import { InputHTMLAttributes, forwardRef } from 'react'

const InputFile = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function InputFileInner(props, ref) {
    return (
      <>
        <input
          className='hidden'
          type='file'
          accept='.jpg,.jpeg,.png'
          ref={ref}
          // onChange={handleChangeAvatar}
        />

        <button
          className='flex h-10 w-24 items-center justify-center rounded-sm border bg-white text-sm capitalize text-gray-600 shadow-sm'
          type='button'
          onClick={() => ref.current?.click()}
        >
          Chọn ảnh
        </button>
      </>
    )
  }
)

export default InputFile

import ProductRating from '@/components/ProductRating'
import { Product as ProductType } from '@/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from '@/utils/utils'
import { Link } from 'react-router-dom'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to='/'>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-all duration-150 hover:z-[1] hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>

          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs '>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>

            <div className=' ml-1 truncate text-orange'>
              <span className='text-xs '>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>

          <div className='mt-3 flex items-center'>
            <ProductRating rating={product.rating} />

            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

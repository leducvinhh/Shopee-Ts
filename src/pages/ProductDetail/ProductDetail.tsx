import productApi from '@/apis/product.api'
import ChevronLeftSvg from '@/components/Svg/ChevronLeftSvg'
import ChevronRightSvg from '@/components/Svg/ChevronRightSvg'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import ProductRating from '@/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '@/utils/utils'
import InputNumber from '@/components/InputNumber'
import MinusSvg from '@/components/Svg/MinusSvg'
import PlusSvg from '@/components/Svg/PlusSvg'
import CartSvg from '@/components/Svg/CartSvg'
import DOMPurify from 'dompurify'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const product = productDetailData?.data.data
  if (!product) return null

  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div className='relative w-full pt-[100%] shadow'>
                <img
                  className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black text-white opacity-20'>
                  <ChevronLeftSvg />
                </button>

                {product.images.slice(0, 5).map((image: string, index: number) => {
                  const isActive = index === 0
                  return (
                    <div
                      key={index}
                      className='relative w-full pt-[100%] shadow'
                    >
                      <img
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                        src={image}
                        alt={product.name}
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-red-500'></div>}
                    </div>
                  )
                })}

                <button className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black text-white opacity-20'>
                  <ChevronRightSvg />
                </button>
              </div>
            </div>

            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>

              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    classActive='fill-orange text-orange h-4 w-4'
                    classNoneActive='h-4 w-4 fill-current text-gray-300'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300' />
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>đã bán</span>
                </div>
              </div>

              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>

                <div className='ml-4 rounded-sm bg-red-600 px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  <span>{rateSale(product.price_before_discount, product.price)} giảm</span>
                </div>
              </div>

              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>số lượng</div>

                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <MinusSvg />
                  </button>
                  <InputNumber
                    classNameError='hidden'
                    value={1}
                    className=''
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />

                  <div className='flex items-center'>
                    <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                      <PlusSvg />
                    </button>
                  </div>
                </div>

                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>

              <div className='mt-8 flex items-center'>
                <button className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'>
                  <CartSvg className='mr-[10px] h-5 w-5' />
                  Thêm vào giỏ hàng
                </button>
                <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                  mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 bg-white p-4 shadow'>
        <div className='container'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>mô tả sản phẩm</div>
          <div className='mx-4 mb-4 mt-8 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          </div>
        </div>
      </div>
    </div>
  )
}

import productApi from '@/apis/product.api'
import ChevronLeftSvg from '@/components/Svg/ChevronLeftSvg'
import ChevronRightSvg from '@/components/Svg/ChevronRightSvg'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ProductRating from '@/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromSlug, rateSale } from '@/utils/utils'
import CartSvg from '@/components/Svg/CartSvg'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProductListConfig } from '@/types/product.type'
import Product from '../ProductList/components/Product'
import QuantityController from '@/components/QuantityController'
import purchaseApi from '@/apis/purchase.api'
import { purchasesStatus } from '@/constants/purchase'
import { toast } from 'react-toastify'
import routerName from '@/router/routerName'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { nameId } = useParams()
  const id = getIdFromSlug(nameId as string)

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [buyCount, setBuyCount] = useState(1)

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const queryConfig: ProductListConfig = {
    page: '1',
    limit: '5',
    category: product?.category._id
  }

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })

  useEffect(() => {
    if (product && product.images.length > 0) setActiveImage(product.images[0])
  }, [product])

  const next = () => {
    if (product && product.images.length > currentIndexImages[1]) {
      setCurrentIndexImages((currentIndexImages) => [currentIndexImages[0] + 1, currentIndexImages[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((currentIndexImages) => [currentIndexImages[0] - 1, currentIndexImages[1] - 1])
    }
  }

  const chooseActiveImage = (image: string) => {
    setActiveImage(image)
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const react = e.currentTarget.getBoundingClientRect()

    if (imageRef.current) {
      const { naturalHeight, naturalWidth } = imageRef.current

      // lay vi tri chuot trong anh khi xu ly duoc bubble event
      // const { offsetX, offsetY } = e.nativeEvent

      // lay vi tri chuot trong anh khi khong xu ly duoc bubble event
      const offsetX2 = e.pageX - (window.scrollX + react.x)
      const offsetY2 = e.pageY - (window.scrollY + react.y)

      const left = offsetX2 * (1 - naturalWidth / react.width)
      const top = offsetY2 * (1 - naturalHeight / react.height)

      imageRef.current.style.width = `${naturalWidth}px`
      imageRef.current.style.height = `${naturalHeight}px`
      imageRef.current.style.maxWidth = 'unset'

      imageRef.current.style.top = `${top}px`
      imageRef.current.style.left = `${left}px`
    }
  }

  const removeZoom = () => {
    if (imageRef.current) {
      imageRef.current.removeAttribute('style')
    }
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation(purchaseApi.addToCart)
  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const handleBuyNow = async () => {
    const res = await purchaseApi.addToCart({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data

    navigate(routerName.cart, {
      state: {
        purchasesId: purchase._id
      }
    })
  }

  if (!product) return null

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={removeZoom}
              >
                <img
                  className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gray-700/60 text-white'
                  onClick={prev}
                >
                  <ChevronLeftSvg />
                </button>

                {currentImages.map((image: string) => {
                  const isActive = image === activeImage
                  return (
                    <div
                      key={image}
                      className='relative w-full pt-[100%] shadow'
                      onMouseEnter={() => chooseActiveImage(image)}
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

                <button
                  className='absolute right-0 top-1/2 z-10 flex h-9 w-9  -translate-y-1/2 items-center justify-center rounded-full bg-gray-700/60 text-white'
                  onClick={next}
                >
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

                <QuantityController
                  max={product.quantity}
                  value={buyCount}
                  onType={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                />

                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>

              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={addToCart}
                >
                  <CartSvg className='mr-[10px] h-5 w-5' />
                  Thêm vào giỏ hàng
                </button>
                <button
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  onClick={handleBuyNow}
                >
                  mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='container'>
          <div className='mt-8 bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>mô tả sản phẩm</div>
            <div className='mx-4 mb-4 mt-8 text-sm leading-loose'>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
            </div>
          </div>
        </div>
      </div>

      <div className=' mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>có thể bạn cũng thích</div>
          {productData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productData.data.data.products.map((product) => (
                <div
                  className='col-span-1'
                  key={product._id}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

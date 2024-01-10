import purchaseApi from '@/apis/purchase.api'
import Button from '@/components/Button'
import QuantityController from '@/components/QuantityController'
import { purchasesStatus } from '@/constants/purchase'
import routerName from '@/router/routerName'
import { formatCurrency, generateSlug } from '@/utils/utils'
import { useContext, useEffect, useMemo } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useLocation } from 'react-router-dom'
import { produce } from 'immer'
import findIndex from 'lodash/findIndex'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from '@/contexts/app.context'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const location = useLocation()

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyPurchasesMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const chosenPurchasesIdFromLocation = (location.state as { purchasesId: string } | null)?.purchasesId
  const purchasesInCart = purchasesInCartData?.data.data

  const isAllPurchasesChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  )

  const listChecked = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const listIdChecked = useMemo(() => listChecked.map((purchase) => purchase._id), [listChecked])

  const sumPriceChecked = useMemo(
    () => listChecked.reduce((sum, purchase) => sum + purchase.price * purchase.buy_count, 0),
    [listChecked]
  )
  const sumPriceCheckedBeforeDiscount = useMemo(
    () =>
      listChecked.reduce(
        (sum, purchase) => sum + (purchase.price_before_discount - purchase.price) * purchase.buy_count,
        0
      ),
    [listChecked]
  )

  useEffect(() => {
    if (!purchasesInCart) return

    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')

      return purchasesInCart.map((purchase) => ({
        ...purchase,
        disabled: false,
        checked: Boolean(
          extendedPurchasesObject[purchase._id]?.checked || purchase._id === chosenPurchasesIdFromLocation
        )
      }))
    })
  }, [purchasesInCart, chosenPurchasesIdFromLocation, setExtendedPurchases])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const purchaseIndex = findIndex(extendedPurchases, (purchase) => purchase._id === purchaseId)
    if (purchaseIndex === -1) return

    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllPurchasesChecked
      }))
    )
  }

  const handleQuantity = (purchaseId: string, value: number) => {
    const purchaseIndex = findIndex(extendedPurchases, (purchase) => purchase._id === purchaseId)

    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].disabled = true
      })
    )

    updatePurchaseMutation.mutate({ product_id: extendedPurchases[purchaseIndex].product._id, buy_count: value })
  }

  const handleTypeQuantity = (purchaseId: string, value: number) => {
    const purchaseIndex = findIndex(extendedPurchases, (purchase) => purchase._id === purchaseId)
    if (purchaseIndex === -1) return

    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDeletePurchase = (type: 'one' | 'all') => (id?: string) => () => {
    if (type === 'one' && !id) return

    if (type === 'one') {
      deletePurchaseMutation.mutate([id as string])
      return
    }

    deletePurchaseMutation.mutate(listIdChecked)
  }

  const handleBuyPurchases = () => {
    if (listChecked.length === 0) return

    const body = listChecked.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }))

    buyPurchasesMutation.mutate(body)
  }

  return (
    <div className='bg-neutral-100 py-16'>
      {extendedPurchases.length ? (
        <div className='container'>
          <div className='overflow-auto'>
            <div className=' min-w-[1000px]'>
              <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                <div className='col-span-6'>
                  <div className='flex items-center'>
                    <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 accent-orange'
                        checked={isAllPurchasesChecked}
                        onChange={handleCheckAll}
                      />
                    </div>
                    <div className='flex-grow text-black'>Sản phẩm</div>
                  </div>
                </div>

                <div className='col-span-6'>
                  <div className='grid grid-cols-5 text-center'>
                    <div className='col-span-2'>Đơn giá</div>
                    <div className='col-span-1'>Số lượng</div>
                    <div className='col-span-1'>Số tiền</div>
                    <div className='col-span-1'>Thao tác</div>
                  </div>
                </div>
              </div>

              {extendedPurchases?.length > 0 && (
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                    >
                      <div className='col-span-6 '>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              checked={purchase.checked}
                              onChange={handleChecked(purchase._id)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                to={`${routerName.home}${generateSlug({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='h-20 w-20 flex-shrink-0'
                              >
                                <img
                                  src={purchase.product.image}
                                  alt={purchase.product.name}
                                />
                              </Link>
                              <div className='flex-grow px-2 pb-2 pt-1'>
                                <Link
                                  to={`${routerName.home}${generateSlug({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='line-clamp-2 text-left text-xs'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 text-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-300 line-through'>
                                ₫{formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              disabled={purchase.disabled}
                              classNameWrapper='flex items-center'
                              onIncrease={(value) => handleQuantity(purchase._id, value)}
                              onDecrease={(value) => handleQuantity(purchase._id, value)}
                              onFocusOut={(value) => handleQuantity(purchase._id, value)}
                              onType={(value) => handleTypeQuantity(purchase._id, value)}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>₫{formatCurrency(purchase.price * purchase.buy_count)}</span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDeletePurchase('one')(purchase._id)}
                            >
                              xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='sticky bottom-0 z-10 mt-8 flex items-center overflow-auto rounded-sm border border-gray-100 bg-white p-5 shadow'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
                checked={isAllPurchasesChecked}
                onChange={handleCheckAll}
              />
            </div>

            <button
              className='mx-3 border-none bg-none'
              onClick={handleCheckAll}
            >
              Chọn tất cả {extendedPurchases.length}
            </button>
            <button
              className='mx-3 border-none bg-none'
              onClick={handleDeletePurchase('all')()}
            >
              Xoá
            </button>
            <div className='ml-auto flex items-center'>
              <div>
                <div className='flex items-center justify-end'>
                  <div>Tổng thanh toán ({listIdChecked.length} sản phẩm):</div>
                  <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(sumPriceChecked)}</div>
                </div>
                <div className='flex items-center justify-end text-sm'>
                  <div className='text-gray-500 '>Tiết kiệm</div>
                  <div className='ml-6 text-orange'>₫{formatCurrency(sumPriceCheckedBeforeDiscount)}</div>
                </div>
              </div>
              <Button
                className='ml-4 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600'
                onClick={handleBuyPurchases}
                disabled={buyPurchasesMutation.isLoading}
              >
                Mua Hàng
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center px-2 py-16'>
          <div className='h-[100px] w-[100px]'>
            <img
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
              alt=' no purchases'
              className='h-full w-full object-cover'
            />
          </div>
          <p className='my-3 font-semibold text-gray-400'>Giỏ hàng của bạn còn trống</p>
          <Link
            to={routerName.home}
            className='flex h-10 min-w-[200px] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
          >
            Mua ngay
          </Link>
        </div>
      )}
    </div>
  )
}

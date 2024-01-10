import purchaseApi from '@/apis/purchase.api'
import { listName, purchasesStatus } from '@/constants/purchase'
import useQueryParams from '@/hooks/useQueryParams'
import routerName from '@/router/routerName'
import { PurchaseListStatus } from '@/types/purchase.type'
import { formatCurrency, generateSlug } from '@/utils/utils'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { useQuery } from 'react-query'
import { Link, createSearchParams } from 'react-router-dom'

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = queryParams.status ? Number(queryParams.status) : purchasesStatus.all

  const listStatus = Object.values(omit(purchasesStatus, ['inCart']))

  const listLink = listStatus.map((item) => ({
    name: listName[item],
    status: item,
    to: {
      pathname: routerName.historyPurchase,
      search: createSearchParams({
        status: String(item)
      }).toString()
    }
  }))

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {listLink.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
              'border-b-orange text-orange': status === item.status,
              'border-b-black/10 text-gray-900': status !== item.status
            })}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div>
        {purchasesInCart?.map((purchase) => (
          <div
            key={purchase._id}
            className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
          >
            <Link
              to={`${routerName.home}${generateSlug({ name: purchase.product.name, id: purchase.product._id })}`}
              className='flex'
            >
              <div className='flex-shrink-0'>
                <img
                  src={purchase.product.image}
                  alt={purchase.product.name}
                  className='mr-3 h-20 w-20 object-cover'
                />
              </div>
              <div className='ml-3 flex-grow overflow-hidden'>
                <div className='truncate'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>

              <div className='ml-3 flex-shrink-0'>
                <span className='truncate text-gray-500 line-through'>
                  ₫{formatCurrency(purchase.product.price_before_discount)}
                </span>

                <span className='ml-2 truncate text-orange line-through'>
                  ₫{formatCurrency(purchase.product.price)}
                </span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div>
                <span>Tổng giá tiền</span>
                <span className='ml-4 text-xl text-orange'>
                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import ChevronLeftSvg from '@/components/Svg/ChevronLeftSvg'
import ChevronRightSvg from '@/components/Svg/ChevronRightSvg'
import { sortBy, order as orderConstant } from '@/constants/product'
import { QueryConfig } from '@/hooks/useQueryConfig'
import routerName from '@/router/routerName'
import { ProductListConfig } from '@/types/product.type'
import classNames from 'classnames'
import { omit } from 'lodash'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()

  const renderClass = (sortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return classNames('h-8 px-4 text-center text-sm capitalize ', {
      'bg-orange text-white hover:bg-orange/80': sort_by === sortBy,
      'bg-white text-black hover:bg-slate-100': sort_by !== sortBy
    })
  }

  const handleSortBy = (sortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: routerName.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortBy
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: routerName.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={renderClass(sortBy.view)}
            onClick={() => handleSortBy(sortBy.view)}
          >
            Phổ biến
          </button>

          <button
            className={renderClass(sortBy.createdAt)}
            onClick={() => handleSortBy(sortBy.createdAt)}
          >
            Mới nhất
          </button>

          <button
            className={renderClass(sortBy.sold)}
            onClick={() => handleSortBy(sortBy.sold)}
          >
            bán chạy
          </button>

          <select
            className={renderClass(sortBy.price)}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option
              value=''
              disabled
              hidden
            >
              Giá
            </option>
            <option value={orderConstant.asc}>Giá: Thấp đến cao</option>
            <option value={orderConstant.desc}>Giá: Cao đến thấp</option>
          </select>
        </div>

        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>

          <div className='ml-2 flex'>
            {page > 1 ? (
              <Link
                to={{
                  pathname: routerName.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center justify-center rounded-bl-sm rounded-tl-sm bg-white px-3 shadow hover:bg-slate-100'
              >
                <ChevronLeftSvg />
              </Link>
            ) : (
              <button className='h-8 cursor-not-allowed rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow hover:bg-slate-100'>
                <ChevronLeftSvg />
              </button>
            )}

            {page <= pageSize ? (
              <Link
                to={{
                  pathname: routerName.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center justify-center rounded-br-sm rounded-tr-sm bg-white px-3 shadow hover:bg-slate-100'
              >
                <ChevronRightSvg />
              </Link>
            ) : (
              <button className='h-8 cursor-not-allowed rounded-br-sm rounded-tr-sm bg-white/60 px-3 shadow hover:bg-slate-100'>
                <ChevronRightSvg />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

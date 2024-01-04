import { QueryConfig } from '@/hooks/useQueryConfig'
import routerName from '@/router/routerName'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2

export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true

        return (
          <span
            key={index}
            className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
          >
            ...
          </span>
        )
      }

      return null
    }

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true

        return (
          <span
            key={index}
            className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
          >
            ...
          </span>
        )
      }

      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: routerName.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
            // onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page > 1 ? (
        <Link
          to={{
            pathname: routerName.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Prev
        </Link>
      ) : (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/50 px-3 py-2 shadow-sm'>Prev</span>
      )}

      {renderPagination()}

      {page < pageSize ? (
        <Link
          to={{
            pathname: routerName.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Next
        </Link>
      ) : (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/50 px-3 py-2 shadow-sm'>Next</span>
      )}
    </div>
  )
}

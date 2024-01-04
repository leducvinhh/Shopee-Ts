import StartBorder from '@/components/Svg/StartBorder'
import StartFullSvg from '@/components/Svg/StartFullSvg'
import routerName from '@/router/routerName'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '@/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
}

export default function RatingStars({ queryConfig }: Props) {
  const navigate = useNavigate()

  const handleFilterStar = (stars: string) => {
    navigate({
      pathname: routerName.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: stars
      }).toString()
    })
  }

  return (
    <div className='my-3'>
      <ul>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <li
              className='cursor-pointer py-1 pl-2'
              key={index}
              onClick={() => handleFilterStar(String(5 - index))}
              tabIndex={0}
              role='button'
              aria-hidden='true'
            >
              <div className='flex items-center text-sm'>
                {Array.from({ length: 5 }).map((_, _index) =>
                  _index < 5 - index ? <StartFullSvg key={_index} /> : <StartBorder key={_index} />
                )}
                <span className='h-4'>{index !== 0 ? 'Trở lên' : ''}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

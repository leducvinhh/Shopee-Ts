import Button from '@/components/Button'
import Input from '@/components/Input'
import ArrowSvg from '@/components/Svg/ArrowSvg'
import FilterSvg from '@/components/Svg/FilterSvg'
import MenuSvg from '@/components/Svg/MenuSvg'
import StartFullSvg from '@/components/Svg/StartFullSvg'
import routerName from '@/router/routerName'
import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from '@/pages/ProductList/ProductList'
import { Category } from '@/types/category.type'
import classNames from 'classnames'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig

  return (
    <div className='py-4 '>
      <Link
        to={routerName.home}
        className={classNames('flex items-center font-bold capitalize', {
          'text-orange': !category
        })}
      >
        <MenuSvg />
        Tất cả danh mục
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      <ul>
        {categories.map((categoryItem) => (
          <li
            className='py-2 pl-2 capitalize'
            key={categoryItem._id}
          >
            <Link
              to={{
                pathname: routerName.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('relative px-2 pl-2', {
                'font-semibold  text-orange': categoryItem._id === category
              })}
            >
              {categoryItem._id === category && <ArrowSvg />}
              {categoryItem.name}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to={routerName.home}
        className='mt-4 flex items-center font-bold uppercase'
      >
        <FilterSvg />
        bộ lọc tìm kiếm
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      <div className='mt-5'>
        <div>Khoảng giá</div>
        <form className='mt-2'>
          <div className='flex items-start'>
            <Input
              type='text'
              className='grow'
              name='from'
              placeholder='₫ TỪ'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-none focus:shadow-sm'
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Input
              type='text'
              className='grow'
              name='to'
              placeholder='₫ ĐẾN'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-none focus:shadow-sm'
            />
          </div>
          <Button
            className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
            type='submit'
          >
            áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />

      <div className='text-sm'>Đánh giá</div>
      <div className='my-3'>
        <ul>
          <li className='py-1 pl-2'>
            <Link
              to=''
              className='flex items-center text-sm'
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <StartFullSvg key={index} />
              ))}
              <span>trở lên</span>
            </Link>
          </li>
          <li className='py-1 pl-2'>
            <Link
              to=''
              className='flex items-center text-sm'
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <StartFullSvg key={index} />
              ))}
              <span>trở lên</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className='my-4 h-[1px] bg-gray-300' />

      <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
        Xoá tất cả
      </Button>
    </div>
  )
}

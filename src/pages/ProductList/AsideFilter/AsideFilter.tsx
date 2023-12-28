import Button from '@/components/Button'
import ArrowSvg from '@/components/Svg/ArrowSvg'
import FilterSvg from '@/components/Svg/FilterSvg'
import MenuSvg from '@/components/Svg/MenuSvg'
import StartFullSvg from '@/components/Svg/StartFullSvg'
import routerName from '@/router/routerName'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '@/pages/ProductList/ProductList'
import { Category } from '@/types/category.type'
import classNames from 'classnames'
import InputNumber from '@/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { schema, type Schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from '@/types/utils.type'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, categories }: Props) {
  const navigate = useNavigate()

  const { category } = queryConfig

  const {
    control,
    formState: { errors },
    trigger,
    handleSubmit
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const onsubmit = handleSubmit((data) => {
    navigate({
      pathname: routerName.home,
      search: createSearchParams({
        ...queryConfig,
        ...data
      }).toString()
    })
  })

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
        <form
          className='mt-2'
          onSubmit={onsubmit}
        >
          <div className='flex items-start'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ TỪ'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-none focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                />
              )}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>

            <Controller
              name='price_max'
              control={control}
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ ĐẾN'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-none focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>

          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'> {errors.price_min?.message}</div>

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

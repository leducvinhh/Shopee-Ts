import { useQuery } from 'react-query'
import AsideFilter from './AsideFilter'
import Product from './Product'
import SortProductList from './SortProductList'
import productApi from '@/apis/product.api'
import useQueryParams from '@/hooks/useQueryParams'
import Pagination from '@/components/Pagination'
import { ProductListConfig } from '@/types/product.type'
import { omitBy, isUndefined } from 'lodash'
import categoryApi from '@/apis/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name,
      category: queryParams.category
    },
    isUndefined
  )

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter
                queryConfig={queryConfig}
                categories={categoryData?.data.data || []}
              />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={productData.data.data.pagination.page_size}
              />

              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData.data.data.products.map((product) => (
                  <div
                    className='col-span-1'
                    key={product._id}
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>

              <Pagination
                queryConfig={queryConfig}
                pageSize={productData.data.data.pagination.page_size}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

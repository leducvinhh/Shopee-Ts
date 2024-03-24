import { useQuery } from 'react-query'
import AsideFilter from '@/pages/ProductList/components/AsideFilter'
import Product from '@/pages/ProductList/components/Product'
import SortProductList from '@/pages/ProductList/components/SortProductList'
import productApi from '@/apis/product.api'
import Pagination from '@/components/Pagination'
import categoryApi from '@/apis/category.api'
import useQueryConfig from '@/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const [page] = useState(1)

  const { data: productData } = useQuery(
    ['products', page],
    () =>
      productApi.getProducts({
        page,
        limit: 5
      }),
    {
      keepPreviousData: true,
      staleTime: 3 * 60 * 1000
    }
  )

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  if (!productData) return null

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Product List</title>
        <meta
          name='description'
          content='Danh sách các sản phẩm'
        />
      </Helmet>
      <button onClick={() => window.print()}>Change Page</button>
      <div className='container'>
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
      </div>
    </div>
  )
}

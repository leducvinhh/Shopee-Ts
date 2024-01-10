import CartLayout from '@/layouts/CartLayout'
import MainLayout from '@/layouts/MainLayout'
import RegisterLayout from '@/layouts/RegisterLayout'
import UserLayout from '@/pages/User/layouts/UserLayout'
import { Suspense, lazy } from 'react'
import { useRoutes } from 'react-router-dom'
import { AuthGuard } from './guard/AuthGuard'
import { NotAuthGuard } from './guard/NotAuthGuard'
import routerName from './routerName'

export default function useRouteElement() {
  const Login = lazy(() => import('@/pages/Login'))
  const Cart = lazy(() => import('@/pages/Cart'))
  const Register = lazy(() => import('@/pages/Register'))
  const Profile = lazy(() => import('@/pages/User/pages/Profile'))
  const ChangePassword = lazy(() => import('@/pages/User/pages/ChangePassword'))
  const HistoryPurchase = lazy(() => import('@/pages/User/pages/HistoryPurchase'))
  const ProductList = lazy(() => import('@/pages/ProductList'))
  const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
  const NotFound = lazy(() => import('@/pages/NotFound'))

  const routeElement = useRoutes([
    {
      path: routerName.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: routerName.productDetail,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      element: <AuthGuard />,
      children: [
        {
          path: routerName.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: routerName.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: routerName.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: routerName.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        },
        {
          path: routerName.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <NotAuthGuard />,
      children: [
        {
          path: routerName.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: routerName.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])

  return routeElement
}

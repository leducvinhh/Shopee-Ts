import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from '@/pages/ProductList'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import RegisterLayout from '@/layouts/RegisterLayout'
import MainLayout from '@/layouts/MainLayout'
import Profile from '@/pages/Profile'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import routerName from './routerName'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import CartLayout from '@/layouts/CartLayout'

function ProtectedRoutes() {
  const { isAuthenticated } = useContext(AppContext)

  return isAuthenticated ? <Outlet /> : <Navigate to={routerName.login} />
}

function RejectRoutes() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to={routerName.home} />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: routerName.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: routerName.productDetail,
      index: true,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoutes />,
      children: [
        {
          path: routerName.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: routerName.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: '*',
          element: (
            <MainLayout>
              <div>404</div>
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectRoutes />,
      children: [
        {
          path: routerName.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: routerName.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])

  return routeElement
}

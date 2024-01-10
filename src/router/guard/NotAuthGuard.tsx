import { Navigate, Outlet } from 'react-router-dom'
import routerName from '../routerName'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'

export const NotAuthGuard = () => {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to={routerName.home} />
}

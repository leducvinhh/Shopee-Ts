import { ExtendedPurchases } from '@/types/purchase.type'
import { User } from '@/types/user.type'
import { getAuthFromLS } from '@/utils/auth'
import { createContext, useState } from 'react'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchases[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchases[]>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAuthFromLS().token),
  setIsAuthenticated: () => null,
  profile: getAuthFromLS().profile,
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>(initialAppContext.extendedPurchases)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    extendedPurchases,
    setExtendedPurchases
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

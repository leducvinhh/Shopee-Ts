const routerName = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  historyPurchase: '/user/history-purchase',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default routerName

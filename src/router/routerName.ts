const routerName = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default routerName

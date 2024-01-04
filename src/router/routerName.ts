const routerName = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  productDetail: ':nameId'
} as const

export default routerName

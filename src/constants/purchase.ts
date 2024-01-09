export const purchasesStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  canceled: 5
} as const

export const listName = ['Tất cả', 'Chờ xác nhận', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đã hủy']

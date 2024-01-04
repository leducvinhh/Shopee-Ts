import HttpStatusCode from '@/constants/httpStatusCode.enum'
import axios, { AxiosError } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value)
}

export function formatNumberToSocialStyle(value: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(Number(value))
    .replace('.', ',')
    .toLowerCase()
}

export function rateSale(originalPrice: number, salePrice: number): string {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100) + '%'
}

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateSlug = ({ name, id }: { name: string; id: string }) => {
  const slug = removeSpecialCharacter(name).replace(/\s+/g, '-').toLowerCase()

  return `${slug}-i.${id}`
}

export const getIdFromSlug = (slug: string) => {
  const arr = slug.split('-i.')

  return arr[arr.length - 1]
}

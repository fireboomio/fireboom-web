import moment from 'moment'

import { DATETIME_FORMAT } from '@/components/PrismaTable/constants'

const capitalize = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
}

const isEmpty = (obj: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length

const formatBytes = (bytes: number | undefined, decimals = 2) => {
  if (bytes === 0 || !bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const formatDate = (date: string): string => {
  return moment(date).format(DATETIME_FORMAT)
}

const isInputKey = (keyCode: number): boolean => {
  return keyCode >= 48 && keyCode <= 90
}

export { capitalize, formatBytes, formatDate, isEmpty, isInputKey }

/* eslint-disable @typescript-eslint/no-explicit-any */

const capitalize = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
}

const isUpperCase = (str: string) => {
  return str == str.toUpperCase() && str != str.toLowerCase()
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

export { isEmpty, capitalize, formatBytes, isUpperCase }

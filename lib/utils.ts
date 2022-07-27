/* eslint-disable @typescript-eslint/no-explicit-any */

const capitalize = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
}

const isEmpty = (obj: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length

export { isEmpty, capitalize }

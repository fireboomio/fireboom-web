/* eslint-disable @typescript-eslint/no-empty-function */
export const emptyStorage = {
  getItem: () => null,
  setItem() {},
  removeItem() {},
  clear() {},
  length: 0,
}

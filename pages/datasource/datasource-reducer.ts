import type { DatasourceItem, DatasourceAction } from '@/interfaces/datasource'

export default function modelingReducer(
  datasoucreList: DatasourceItem[],
  action: DatasourceAction
) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return datasoucreList
    }
    case 'added': {
      return [...datasoucreList, action.data]
    }
    case 'changed':
      return datasoucreList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return datasoucreList.filter((b) => b.id !== action.data.id)
    }
    default: {
      throw Error('Unknown action')
    }
  }
}

import type { DatasourceAction, DatasourceResp } from '@/interfaces/datasource'

export default function datasourceReducer(datasource: DatasourceResp[], action: DatasourceAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return datasource
    }
    case 'added': {
      return [...datasource, action.data]
    }
    case 'changed':
      return datasource.map(b => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return datasource.filter(b => b.id !== action.data.id)
    }
    default:
      return datasource
  }
}

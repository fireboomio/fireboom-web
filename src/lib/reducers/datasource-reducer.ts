import type { DatasourceAction } from '@/interfaces/datasource'
import type { ApiDocuments } from '@/services/a2s.namespace'

export default function datasourceReducer(
  datasource: ApiDocuments.Datasource[],
  action: DatasourceAction
) {
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
        if (b.name === action.data.name) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return datasource.filter(b => b.name !== action.data.name)
    }
    default:
      return datasource
  }
}

import type { StorageAction } from '@/interfaces/storage'
import type { ApiDocuments } from '@/services/a2s.namespace'

export default function storageReducer(bucketList: ApiDocuments.Storage[], action: StorageAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data ?? []
    }
    case 'selected': {
      return bucketList
    }
    case 'added': {
      return [...bucketList, action.data]
    }
    case 'changed':
      return bucketList.map(b => {
        if (b.name === action.data.name) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return bucketList.filter(b => b.name !== action.data.name)
    }
    default:
      return bucketList
  }
}

import type { StorageResp, StorageAction } from '@/interfaces/storage'

export default function storageReducer(bucketList: StorageResp[], action: StorageAction) {
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
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return bucketList.filter(b => b.id !== action.data.id)
    }
    default:
      return bucketList
  }
}

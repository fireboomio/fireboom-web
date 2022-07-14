import type { FileStorageItem, FlieAction } from '@/interfaces/filestorage'

export default function filesReducer(fileList: FileStorageItem[], action: FlieAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return fileList
    }
    case 'added': {
      return [...fileList, action.data]
    }
    case 'changed':
      return fileList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return fileList.filter((b) => b.id !== action.data.id)
    }
    default:
      return fileList
  }
}

import type { ApiDocuments } from '@/services/a2s.namespace'

export type StorageAction = StorageSingleAction | StorageListAction

interface StorageSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: ApiDocuments.Storage
}

interface StorageListAction {
  type: 'fetched'
  data: ApiDocuments.Storage[]
}

import type { ApiDocuments } from '@/services/a2s.namespace'

export interface FileTreeNode extends ApiDocuments.fileloader_DataTree {
  parent?: FileTreeNode
  key: string
  pos: string
  children?: FileTreeNode[]
}

export interface InnerNode extends FileTreeNode {
  isInput?: boolean
  isNew?: boolean
  parent?: InnerNode
}

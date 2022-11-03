import type { Schema, SchemaField, SchemaModel } from '@paljs/types'
import type React from 'react'

import type Language from './language'

export type GraphQLResp = Record<string, Record<string, any>[] | number>

export type TableData = {
  tableData: Record<string, any>[]
  tableDataTotalCount: number
}

export type FilterValueType = string | number | boolean | string[] | number[]

export interface FilterState {
  field: SchemaField
  relationField: SchemaField | undefined
  operator: string
  value: FilterValueType | undefined
}

export interface FilterVariableType {
  where: Record<string, any>
}

export type { Schema, SchemaField, SchemaModel }

export interface ContextProps extends RequireContextProps, SameProps {
  schema: Schema
  children?: React.ReactNode
}

interface RequireContextProps {
  pagesPath: string
  pageSize: number
  pageSizeOptions: number[]
  paginationOptions: number
  lang: typeof Language
  dir: 'rtl' | 'ltr'
}

interface SameProps {
  actions?: ('create' | 'update' | 'delete')[]
  useSet?: boolean
  tableColumns?: any
  formInputs?: Partial<any>
  inputValidation?: Record<string, Record<string, any>>
  push: (url: string) => void
  query: Record<string, any>
  onSelect?: (values: any[]) => void
  onCancelCreate?: (options: { model: string; setCreateModal: (state: boolean) => void }) => void
  onSaveCreate?: (options: {
    model: string
    setCreateModal: (state: boolean) => void
    refetchTable: (options?: any) => void
  }) => void
  onCancelUpdate?: (options: { model: string }) => void
  onSaveUpdate?: (options: { model: string; refetchTable: (options?: any) => void }) => void
  valueHandler?: (value: string, field?: SchemaField, create?: boolean) => any
  actionButtons?: {
    Add?: React.FC
    Update?: React.FC<{ id: any }>
    Delete?: React.FC<{ id: any }>
  }
  defaultOrderBy?: Record<string, Record<string, 'asc' | 'desc'>[]>
}

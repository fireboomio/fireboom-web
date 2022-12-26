import type { SchemaField, SchemaModel } from '@paljs/types'
import { Button } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { PropsWithChildren } from 'react'
import type React from 'react'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import { getDisplayName } from '@/components/PrismaTable/libs/utils'
import { formatDate } from '@/lib/helpers/utils'

import lang from '../../libs/language'

type columnsObjectType = {
  renderCell: (param: {
    value: unknown
    record?: Record<string, any>
    index?: number
    onRelationLinkClick?: onRelationLinkClickFunc
  }) => JSX.Element
}

type Columns = Record<
  'DateTime' | 'object' | 'Boolean' | 'default' | 'list' | 'json',
  columnsObjectType
>

const TableDataCell: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="w-full whitespace-nowrap">{children}</div>
}

const handleListShowClick =
  (
    value: any,
    field: SchemaField,
    model: SchemaModel,
    models: SchemaModel[],
    record: Record<string, any>,
    onRelationLinkClick?: onRelationLinkClickFunc
  ) =>
  () => {
    const relationModel = models.find(m => m.id === field.type)
    const filterField = relationModel!.fields.find(f => f.type === model.id)
    const relationField = model.fields.find(f => f.isId)
    const filter: FilterState = {
      field: filterField!,
      relationField: relationField!,
      operator: 'equals',
      value: record[relationField!.name]
    }
    onRelationLinkClick && onRelationLinkClick(relationModel!.id, [filter])
  }

const handleSingleObjectClick =
  (
    value: any,
    field: SchemaField,
    model: SchemaModel,
    models: SchemaModel[],
    record: Record<string, any>,
    onRelationLinkClick?: onRelationLinkClickFunc
  ) =>
  () => {
    const relationModel = models.find(m => m.id === field.type)
    const filterField = relationModel!.fields.find(f => f.isId)
    const relationRecord = record[field.name] as Record<string, any>
    const filter: FilterState = {
      field: filterField!,
      relationField: undefined,
      operator: 'equals',
      value: relationRecord[filterField!.name]
    }
    onRelationLinkClick && onRelationLinkClick(relationModel!.id, [filter])
  }

const getRenderFuncMap = (
  field: SchemaField,
  model: SchemaModel,
  models: SchemaModel[]
): Columns => {
  return {
    DateTime: {
      renderCell: ({ value }) => (
        <TableDataCell>{value ? formatDate(value as string) : ''}</TableDataCell>
      )
    },
    json: {
      renderCell: ({ value }) => <TableDataCell>{JSON.stringify(value)}</TableDataCell>
    },
    Boolean: {
      renderCell: ({ value }) => <TableDataCell>{JSON.stringify(value)}</TableDataCell>
    },
    default: {
      renderCell: ({ value }) => (
        <TableDataCell>{field.list ? (value as string[]).join(',') : <>{value}</>}</TableDataCell>
      )
    },
    list: {
      renderCell: ({ value, record, onRelationLinkClick }) => {
        return (
          <TableDataCell>
            <Button
              type="link"
              onClick={handleListShowClick(
                value,
                field,
                model,
                models,
                record!,
                onRelationLinkClick
              )}
            >
              <span className="font-bold text-blue-500">{lang.show}</span>
            </Button>
          </TableDataCell>
        )
      }
    },
    object: {
      renderCell: ({ value, record, onRelationLinkClick }) => {
        if (!value) return <></>

        const relationModel = models.find(m => m.id === field.type)
        return (
          <TableDataCell>
            <Button
              type="link"
              className="font-bold text-blue-500"
              onClick={handleSingleObjectClick(
                value,
                field,
                model,
                models,
                record!,
                onRelationLinkClick
              )}
            >
              <span className="font-bold max-w-150px text-blue-500 overflow-hidden">
                {getDisplayName(value as Record<string, any>, relationModel!)}
              </span>
            </Button>
          </TableDataCell>
        )
      }
    }
  }
}

const renderTableColumn = (field: SchemaField) => {
  return <span className="whitespace-nowrap">{field.title}</span>
}

export const getTableColumns = (
  currentModelFields: SchemaField[],
  model: SchemaModel,
  models: SchemaModel[],
  onRelationLinkClick: onRelationLinkClickFunc
): ColumnsType<Record<string, any>> => {
  return currentModelFields
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter(field => field.read)
    .map(field => ({
      title: renderTableColumn(field),
      dataIndex: field.name,
      key: field.id,
      render: renderTableDataCell(field, model, models, onRelationLinkClick),
      sorter: field.sort && field.kind === 'scalar'
    }))
}

type onRelationLinkClickFunc = (relationModelName: string, filters: FilterState[]) => void
const renderTableDataCell =
  (
    field: SchemaField,
    model: SchemaModel,
    models: SchemaModel[],
    onRelationLinkClick: onRelationLinkClickFunc
  ) =>
  (value: unknown, record: Record<string, any>) => {
    if (field.list && field.kind === 'object') {
      return getRenderFuncMap(field, model, models).list.renderCell({
        value,
        record,
        onRelationLinkClick
      })
    }
    if (field.kind === 'object') {
      return getRenderFuncMap(field, model, models).object.renderCell({
        value,
        record,
        onRelationLinkClick
      })
    }
    switch (field.type) {
      case 'DateTime':
        return getRenderFuncMap(field, model, models).DateTime.renderCell({ value })
      case 'Json':
        return getRenderFuncMap(field, model, models).json.renderCell({ value })
      case 'Boolean':
        return getRenderFuncMap(field, model, models).json.renderCell({ value })
      default:
        return getRenderFuncMap(field, model, models).default.renderCell({ value })
    }
  }

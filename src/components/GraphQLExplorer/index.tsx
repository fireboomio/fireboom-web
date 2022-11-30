import type { GraphQLField, GraphQLFieldMap, GraphQLSchema } from 'graphql'
import { useMemo, useState } from 'react'

import ExplorerFilter from './ExplorerFilter'
import ResultField from './ResultField'
import { arraySort, convertMapToArray } from './utils'
import { MultipleFieldViews } from './ViewFactory'

const filters = [
  { label: '全部', value: '' },
  { label: '查询', value: 'query' },
  { label: '变更', value: 'mutation' },
  { label: '订阅', value: 'subscription' }
] as const

const values = filters.map(item => item.value)
type FilterType = typeof values[number]

interface GraphiqlExplorerProps {
  isLoading?: boolean
  schema?: GraphQLSchema
  dataSourceList: string[]
  onSelect?: () => void
  onRefresh?: () => void
}

const GraphiqlExplorer = ({
  isLoading,
  dataSourceList,
  schema,
  onSelect,
  onRefresh
}: GraphiqlExplorerProps) => {
  const [selectedDataSource, setSeletedDataSource] = useState<string>()
  const [selectedType, setSelectedType] = useState<FilterType>('')

  // 按照类型过滤 按照分类筛选
  const visibleFields = useMemo(() => {
    let fields: GraphQLFieldMap<any, any> | undefined
    if (selectedType === 'query') {
      fields = schema?.getQueryType()?.getFields()
    } else if (selectedType === 'mutation') {
      fields = schema?.getMutationType()?.getFields()
    } else if (selectedType === 'subscription') {
      fields = schema?.getSubscriptionType()?.getFields()
    } else {
      fields = {
        ...schema?.getQueryType()?.getFields(),
        ...schema?.getMutationType()?.getFields(),
        ...schema?.getSubscriptionType()?.getFields()
      }
    }
    if (!selectedDataSource) {
      return fields
    }
    if (fields) {
      return Object.keys(fields).reduce<GraphQLFieldMap<any, any>>((obj, key) => {
        if (fields![key].name.includes(selectedDataSource)) {
          obj[key] = fields![key]
        }
        return obj
      }, {})
    }
    return fields
  }, [schema, selectedType, selectedDataSource])

  const fields = useMemo(() => {
    if (visibleFields) {
      return arraySort(convertMapToArray(visibleFields)) as GraphQLField<any, any>[]
    }
    return []
  }, [visibleFields])

  return (
    <div className="flex flex-col h-full bg-[rgba(135,140,153,0.03)] min-w-64 w-full">
      <ExplorerFilter
        filters={filters}
        isLoading={isLoading}
        selectedType={selectedType}
        selectedDataSource={selectedDataSource}
        onSeletedDataSource={setSeletedDataSource}
        dataSourceList={dataSourceList}
        setSelectedType={v => setSelectedType((v as FilterType | undefined) || '')}
        onRefresh={onRefresh}
      />
      {schema && (
        <div
          className="flex-1 text-xs p-2 over-x-auto overflow-y-auto select-none"
          style={{
            fontFamily: 'Consolas, Inconsolata, "Droid Sans Mono", Monaco, monospace'
          }}
        >
          {fields.map(field => (
            <ResultField key={field.name} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GraphiqlExplorer

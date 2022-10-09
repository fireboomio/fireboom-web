import { GraphQLField, GraphQLFieldMap, GraphQLSchema } from 'graphql'
import { useMemo, useState } from 'react'

import ExplorerFilter from './ExplorerFilter'
import FieldView from './FieldView'
import { generateFieldViews } from './ViewFactory'
import { arraySort, convertGraphiQLFieldMapToArray } from './utils'

const filters = [
  { label: '全部', value: '' },
  { label: '查询', value: 'query' },
  { label: '变更', value: 'mutation' },
  { label: '订阅', value: 'subscription' },
] as const

const values = filters.map(item => item.value)
type FilterType = typeof values[number]
type GraphiQLFieldArray = GraphQLField<any, any>[]

interface GraphiqlExplorerProps {
  schema?: GraphQLSchema
  onSelect?: () => void
}

const GraphiqlExplorer = ({ schema, onSelect }: GraphiqlExplorerProps) => {
  const [selected, setSelected] = useState<FilterType>('')

  const visibleFields = useMemo(() => {
    if (selected === 'query') {
      return schema?.getQueryType()?.getFields()
    }
    if (selected === 'mutation') {
      return schema?.getMutationType()?.getFields()
    }
    if (selected === 'subscription') {
      return schema?.getSubscriptionType()?.getFields()
    }
    return {
      ...schema?.getQueryType()?.getFields(),
      ...schema?.getMutationType()?.getFields(),
      ...schema?.getSubscriptionType()?.getFields(),
    }
  }, [schema, selected])

  return (
    <div className="flex flex-col h-full bg-[rgba(135,140,153,0.03)] w-64.5 overflow-x-hidden">
      {/** eslint-disable-next-line */}
      <ExplorerFilter
        filters={filters}
        selected={selected}
        setSelected={v => setSelected((v as FilterType | undefined) || '')}
      />
      {schema && (
        <div
          className="flex-1 text-xs p-2 over-x-auto overflow-y-auto select-none"
          style={{
            fontFamily: 'Consolas, Inconsolata, "Droid Sans Mono", Monaco, monospace',
          }}
        >
          {generateFieldViews(visibleFields, true)}
        </div>
      )}
    </div>
  )
}

export default GraphiqlExplorer

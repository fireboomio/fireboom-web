import type {
  DocumentNode,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLSchema,
  OperationDefinitionNode,
  OperationTypeNode
} from 'graphql'
import { Kind, print } from 'graphql'
import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { intl } from '@/providers/IntlProvider'

import { GraphQLExplorerContext } from './context'
import ExplorerFilter from './ExplorerFilter'
import ResultField from './ResultField'
import { arraySort, convertMapToArray } from './utils'

const filters = [
  { label: intl.formatMessage({ defaultMessage: '全部' }), value: '' },
  { label: intl.formatMessage({ defaultMessage: '查询' }), value: 'query' },
  { label: intl.formatMessage({ defaultMessage: '变更' }), value: 'mutation' },
  { label: intl.formatMessage({ defaultMessage: '订阅' }), value: 'subscription' }
] as const

const values = filters.map(item => item.value)
type FilterType = typeof values[number]

export interface GraphiqlExplorerAction {
  manualExpand: () => void
}
interface GraphiqlExplorerProps {
  actionRef?: MutableRefObject<GraphiqlExplorerAction | undefined>
  isLoading?: boolean
  query?: string
  queryAST?: DocumentNode
  schema?: GraphQLSchema
  dataSourceList: string[]
  onChange?: (v: string) => void
  onRefresh?: () => void
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

const GraphiqlExplorer = ({
  actionRef,
  isLoading,
  dataSourceList,
  schema,
  query,
  queryAST,
  onChange,
  onRefresh
}: GraphiqlExplorerProps) => {
  const [selectedDataSource, setSeletedDataSource] = useState<string>()
  const [selectedType, setSelectedType] = useState<FilterType>('')
  const [k, setK] = useState(+new Date())

  const fieldTypeMap = useMemo(() => {
    if (!schema) return {}
    const queries = schema.getQueryType()?.getFields() ?? {}
    const mutations = schema.getMutationType()?.getFields() ?? {}
    const subscriptions = schema.getSubscriptionType()?.getFields() ?? {}
    const ret: Record<string, OperationTypeNode> = {}
    Object.keys(queries).forEach(q => {
      ret[q] = 'query'
    })
    Object.keys(mutations).forEach(q => {
      ret[q] = 'mutation'
    })
    Object.keys(subscriptions).forEach(q => {
      ret[q] = 'subscription'
    })
    return ret
  }, [schema])

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

  const _queryAST = useMemo(() => {
    // @ts-ignore
    let ast: Writeable<DocumentNode> = queryAST
    if (!ast) {
      ast = { kind: Kind.DOCUMENT, definitions: [] }
    }
    const queryType: OperationTypeNode = 'query'
    if (!ast.definitions.length) {
      ast.definitions = [
        {
          directives: [],
          kind: Kind.OPERATION_DEFINITION,
          name: { kind: Kind.NAME, value: '' },
          operation: queryType,
          selectionSet: { kind: Kind.SELECTION_SET, selections: [] },
          variableDefinitions: []
        }
      ]
    }
    return ast
  }, [queryAST])

  const updateAST = useCallback(() => {
    const targetQuery = print(_queryAST)
    if (targetQuery !== query) {
      onChange?.(targetQuery)
    }
  }, [_queryAST, onChange, query])

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        manualExpand() {
          setK(+new Date())
        }
      }
    }
  }, [actionRef])

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
          <GraphQLExplorerContext.Provider
            value={{
              queryAST: _queryAST,
              schema,
              fieldTypeMap,
              updateAST
            }}
            key={k}
          >
            {fields.map(field => (
              <ResultField
                key={field.name}
                field={field}
                // @ts-ignore
                selections={
                  (_queryAST?.definitions[0] as OperationDefinitionNode).selectionSet.selections
                }
              />
            ))}
          </GraphQLExplorerContext.Provider>
        </div>
      )}
    </div>
  )
}

export default GraphiqlExplorer

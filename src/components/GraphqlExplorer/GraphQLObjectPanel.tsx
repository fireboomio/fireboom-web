import { GraphQLObjectType } from 'graphql'
import { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import Fields from './Fields'
import FieldsTitle from './FieldsTitle'
import FieldTitle from './FieldTitle'
import { GraphQLObject } from './provider'

interface GraphQLObjectPanelProps {
  obj: GraphQLObject
}

const GraphQLObjectPanel = ({ obj }: GraphQLObjectPanelProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <FieldTitle title={obj.name} selected />
      {obj.description && (
        <div className="mb-4 mt-2 text-sm text-dark-400">
          <FieldDescription description={obj.description} />
        </div>
      )}
      <FieldsTitle />
      {'getFields' in obj ? <Fields fields={obj.getFields()} /> : <Fields fields={{}} />}
    </div>
  )
}

export default GraphQLObjectPanel

/**
 * Fireboom description 解析
 * <#datasource#>([^}]+)<#datasource#>
 * <#originName#>([^}]+)<#originName#>
 */
const FieldDescription = ({ description }: { description: string }) => {
  const objMap: Record<string, string> = {}
  const matched = description.matchAll(/<#(\w+)#>([^<]+)<#(\w+)#>/g)
  for (const peace of matched) {
    if (peace.length > 3) {
      objMap[peace[1]] = peace[2]
    }
  }
  const leftDesc = description
    .split(/<#\w+#>/)
    .pop()
    ?.trim()
  const arr: ReactNode[] = []
  if (leftDesc) {
    arr.push(leftDesc)
  }
  const ds = objMap['datasource']
  if (ds) {
    arr.push(<FormattedMessage defaultMessage="数据源: {ds}" values={{ ds }} />)
  }
  const originName = objMap['originName']
  if (originName) {
    arr.push(<FormattedMessage defaultMessage="原始字段: {originName}" values={{ originName }} />)
  }
  return <>{arr}</>
}

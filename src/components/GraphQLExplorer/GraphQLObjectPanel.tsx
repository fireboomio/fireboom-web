import { getNamedType, GraphQLFieldMap, GraphQLObjectType, isEnumType, isObjectType, isScalarType } from 'graphql'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import Arguments from './Arguments'
import Description from './Description'
import EnumTypeOutput from './EnumTypeOutput'
import Fields from './Fields'
import FieldsTitle from './FieldsTitle'
import FieldTitle from './FieldTitle'
import GraphQlOutputPanel from './GraphQLOutputPanel'
import { GraphQLObject, useGraphQLExplorer } from './provider'
import ScalarTypeOutput from './ScalarTypeOutput'

const GraphQLObjectPanel = () => {
  const { graphqlObjectStack, currentFields } = useGraphQLExplorer()
  const obj = graphqlObjectStack[graphqlObjectStack.length - 1]
  
  return (
    <div className="flex flex-1 flex-col">
      <FieldTitle title={obj.name} selected />
      {'args' in obj && !!obj.args.length && <Arguments args={obj.args} />}
      {obj.description && (
        <Description>
          <FieldDescription description={obj.description} />
        </Description>
      )}
      {(('getFields' in obj) || isObjectType(getNamedType(obj.type))) && <FieldsTitle />}
      {(() => {
        if (isScalarType(currentFields)) {
          return <ScalarTypeOutput type={currentFields} name={obj.name} />
        }
        if (isEnumType(currentFields)) {
          return <EnumTypeOutput type={currentFields} name={obj.name} />
        }
        return <Fields fields={currentFields as GraphQLFieldMap<any, any>} />
      })()}
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

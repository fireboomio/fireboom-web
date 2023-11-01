import type { GraphQLFieldMap } from 'graphql'
import { getNamedType, isEnumType, isObjectType, isScalarType } from 'graphql'

import Arguments from './Arguments'
import Description from './Description'
import EnumTypeOutput from './EnumTypeOutput'
import Fields from './Fields'
import FieldsTitle from './FieldsTitle'
import FieldTitle from './FieldTitle'
import { useGraphQLExplorer } from './provider'
import ScalarTypeOutput from './ScalarTypeOutput'

const GraphQlOutputPanel = () => {
  const { graphqlObjectStack, currentFields } = useGraphQLExplorer()
  const obj = graphqlObjectStack[graphqlObjectStack.length - 1]

  return (
    <div className="flex flex-1 flex-col">
      <FieldTitle title={obj.name} selected />
      {obj.description && <Description description={obj.description} />}
      {'args' in obj && !!obj.args.length && <Arguments args={obj.args} />}
      {('getFields' in obj || isObjectType(getNamedType(obj.type))) && <FieldsTitle />}
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

export default GraphQlOutputPanel

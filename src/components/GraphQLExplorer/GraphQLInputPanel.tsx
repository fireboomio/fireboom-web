import { getNamedType, isEnumType, isInputObjectType, isScalarType } from 'graphql'

import Arguments from './Arguments'
import ArgumentTitle from './ArgumentTitle'
import Description from './Description'
import EnumTypeOutput from './EnumTypeOutput'
import FieldTitle from './FieldTitle'
import { useGraphQLExplorer } from './provider'
import ScalarTypeOutput from './ScalarTypeOutput'
import { unwrapInputType } from './utils'

const GraphQLInputPanel = () => {
  const { argumentStack } = useGraphQLExplorer()
  const currentInput = argumentStack[argumentStack.length - 1]

  const inputType = 'type' in currentInput ? unwrapInputType(currentInput.type) : currentInput
  const type = getNamedType(inputType)

  return (
    <div className="flex flex-1 flex-col">
      <ArgumentTitle title={currentInput.name} selected />
      {'description' in currentInput && <Description description={currentInput.description ?? ''} />}
      {(() => {
        if (isScalarType(type)) {
          return <ScalarTypeOutput type={type} name={currentInput.name} />
        }
        if (isEnumType(type)) {
          return <EnumTypeOutput type={type} name={currentInput.name} />
        }
        if (isInputObjectType(type)) {
          return <Arguments args={type.getFields()} />
        }
        // TODO 其它类型
        return <div>Others not implemented</div>
      })()}
    </div>
  )
}

export default GraphQLInputPanel

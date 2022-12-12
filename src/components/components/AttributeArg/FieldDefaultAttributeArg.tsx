import type { Value } from '@mrleebo/prisma-ast'

import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'

import AttributeArgHelper from './AttributeArgHelper'
import AttributeArgSelector from './AttributeArgSelector'

const AttributeFunctions = ['auto', 'autoincrement', 'cuid', 'uuid', 'now']
const AttributeBoolean = ['true', 'false']

const FieldDefaultAttributeArg = ({ args, updateAttrArgs, field }: AttributeHandlersProp) => {
  const handleDataChange = (values: string | string[]) => {
    const value = values as string
    const argValue: Value = AttributeFunctions.includes(value)
      ? {
          type: 'function',
          name: value,
          params: []
        }
      : value
    updateAttrArgs([
      {
        type: 'attributeArgument',
        value: argValue
      }
    ])
  }
  const argValue = AttributeArgHelper.extractDefaultAttrArgs(args)
  const showAttr = field?.fieldType === 'Boolean' ? AttributeBoolean : AttributeFunctions
  return (
    <span className="flex flex-row">
      <span>(</span>
      <span className="text-[#ECA160]">
        <AttributeArgSelector
          inputable={true}
          handleDataChange={handleDataChange}
          argIsFunction={AttributeFunctions.includes(argValue)}
          options={showAttr.map(f => ({ label: f, value: f }))}
          selectedOptionsValue={argValue ? [argValue] : []}
        />
      </span>
      <span>)</span>
    </span>
  )
}

export default FieldDefaultAttributeArg

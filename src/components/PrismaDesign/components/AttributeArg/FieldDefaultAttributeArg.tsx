import type { Value } from '@mrleebo/prisma-ast'

import AttributeArgHelper from '@/components/PrismaDesign/components/AttributeArg/AttributeArgHelper'
import AttributeArgSelector from '@/components/PrismaDesign/components/AttributeArg/AttributeArgSelector'
import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'

const AttributeFunctions = ['auto', 'autoincrement', 'cuid', 'uuid', 'now']

const FieldDefaultAttributeArg = ({ args, updateAttrArgs }: AttributeHandlersProp) => {
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

  return (
    <span className="flex flex-row">
      <span>(</span>
      <span className="text-[#ECA160]">
        <AttributeArgSelector
          inputable={true}
          handleDataChange={handleDataChange}
          argIsFunction={AttributeFunctions.includes(argValue)}
          options={AttributeFunctions.map(f => ({ label: f, value: f }))}
          selectedOptionsValue={argValue ? [argValue] : []}
        />
      </span>
      <span>)</span>
    </span>
  )
}

export default FieldDefaultAttributeArg

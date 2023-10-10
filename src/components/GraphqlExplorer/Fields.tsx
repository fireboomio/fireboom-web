import { GraphQLFieldMap } from 'graphql'
import SelectableRow from './SelectableRow'
import { getTypeName } from './utils'

interface FieldsProps {
  fields: GraphQLFieldMap<any, any>
}

const Fields = ({ fields }: FieldsProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {Object.keys(fields).map(key => {
        const field = fields[key]
        return (
          <SelectableRow
            key={field.name}
            selected
            name={key}
            type={getTypeName(field.type)}
            onSelect={() => {}}
            onClick={() => {}}
          />
        )
      })}
    </div>
  )
}

export default Fields

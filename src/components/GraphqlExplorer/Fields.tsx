import { GraphQLFieldMap } from 'graphql'
import SelectableRow from './SelectableRow'

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
            type="{field.type}"
            onSelect={() => {}}
            onClick={() => {}}
          />
        )
      })}
    </div>
  )
}

export default Fields

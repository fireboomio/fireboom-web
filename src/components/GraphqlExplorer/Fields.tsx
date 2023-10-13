import { GraphQLFieldMap } from 'graphql'
import { useGraphQLExplorer } from './provider'
import SelectableRow from './SelectableRow'
import { getTypeName } from './utils'

interface FieldsProps {
  fields: GraphQLFieldMap<any, any>
}

const Fields = ({ fields }: FieldsProps) => {
  const { graphqlObjectStack, setGraphqlObjectStack } = useGraphQLExplorer()
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
            onClick={() => {
              setGraphqlObjectStack([...graphqlObjectStack, field])
            }}
          />
        )
      })}
    </div>
  )
}

export default Fields

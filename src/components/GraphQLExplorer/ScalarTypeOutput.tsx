import type { GraphQLScalarType } from 'graphql'
import { FormattedMessage } from 'react-intl'

interface ScalarTypeOutputProps {
  type: GraphQLScalarType
  name: string
}

const ScalarTypeOutput = ({ type, name }: ScalarTypeOutputProps) => {
  return (
    <div>
      <p className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="描述" />
      </p>
      <div className="text-xs">{type.description || name}</div>
    </div>
  )
}

export default ScalarTypeOutput

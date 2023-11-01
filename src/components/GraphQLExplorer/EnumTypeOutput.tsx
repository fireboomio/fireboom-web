import type { GraphQLEnumType } from 'graphql'
import { FormattedMessage } from 'react-intl'

interface EnumTypeOutputProps {
  type: GraphQLEnumType
  name: string
}

const EnumTypeOutput = ({ type, name }: EnumTypeOutputProps) => {
  return (
    <div>
      <p className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="描述" />
      </p>
      <div className="text-xs">{type.description || name}</div>
      <p className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="可选值" />
      </p>
      <div className="text-xs">
        {type.getValues().map(value => (
          <div className="py-1" key={value.name}>
            {value.name}
            {value.description && <span className="ml-2 text-dark-700">: {value.description}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnumTypeOutput

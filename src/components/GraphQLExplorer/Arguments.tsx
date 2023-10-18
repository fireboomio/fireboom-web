import type { GraphQLArgument } from 'graphql'
import { FormattedMessage } from 'react-intl'
import { useGraphQLExplorer } from './provider'

import SelectableRow from './SelectableRow'
import { getTypeName } from './utils'

interface ArgumentsProps {
  args: ReadonlyArray<GraphQLArgument>
}

const Arguments = ({ args }: ArgumentsProps) => {
  const { argumentStack, setArgumentStack } = useGraphQLExplorer()

  const onClick = (arg: GraphQLArgument) => {
    setArgumentStack([...argumentStack, arg])
  }

  return (
    <div className="">
      <div className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="参数列表" />
      </div>
      {args.map(arg => (
        <SelectableRow
          key={arg.name}
          name={arg.name}
          type={getTypeName(arg.type)}
          onSelect={() => {}}
          onClick={() => onClick(arg)}
        />
      ))}
    </div>
  )
}

export default Arguments

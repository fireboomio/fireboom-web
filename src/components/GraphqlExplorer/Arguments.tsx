import { GraphQLArgument } from 'graphql'
import { FormattedMessage } from 'react-intl'
import SelectableRow from './SelectableRow'
import { getTypeName } from './utils'

interface ArgumentsProps {
  args: ReadonlyArray<GraphQLArgument>
}

const Arguments = ({ args }: ArgumentsProps) => {
  return (
    <div className="">
      <div className="mt-4 mb-2 font-semibold text-md">
        <FormattedMessage defaultMessage="参数列表" />
      </div>
      {args.map(arg => (
        <SelectableRow
          name={arg.name}
          type={getTypeName(arg.type)}
          onSelect={() => {}}
          onClick={() => {}}
        />
      ))}
    </div>
  )
}

export default Arguments

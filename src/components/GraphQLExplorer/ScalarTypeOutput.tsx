import { GraphQLScalarType } from "graphql"

interface ScalarTypeOutputProps {
  type: GraphQLScalarType
  name: string
}

const ScalarTypeOutput = ({ type, name }: ScalarTypeOutputProps) => {

  return (
    <div className="text-xs">{type.description || name}</div>
  )
}

export default ScalarTypeOutput
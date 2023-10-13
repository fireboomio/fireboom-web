import { isNonNullObject } from '@apollo/client/utilities'
import { GraphQLOutputType, isNonNullType, isScalarType } from 'graphql'
import Description from './Description'
import FieldTitle from './FieldTitle'

interface GraphQlOutputPanelProps {
  type: GraphQLOutputType
}

const GraphQlOutputPanel = ({ type }: GraphQlOutputPanelProps) => {
  // var _type = isNonNullType(type) ? type.ofType : type
  if (isScalarType(type)) {
    const title = <FieldTitle title={type.name} type={type.name} selected />
    return (
      <>
        {title}
        <Description>{type.description}</Description>
      </>
    )
  }
  return <div></div>
}

export default GraphQlOutputPanel

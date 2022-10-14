import { GraphQLField, isNonNullType, isObjectType, isScalarType } from 'graphql'

import { arraySort } from '../utils'
import ArgView from './ArgView'
import BaseView from './BaseView'
import { CommonViews } from './ViewFactory'

interface FieldViewProps {
  field: GraphQLField<any, any>
}

const FieldView = ({ field }: FieldViewProps) => {
  console.log(isScalarType(field), field.name)
  const selectable = !field.args.length && !isObjectType(field.type) && !isNonNullType(field.type)
  return (
    <>
      <BaseView
        color="blue"
        name={field.name}
        selectable={selectable}
        expandedChildren={
          <>
            {'args' in field &&
              arraySort([...field.args]).map(arg => <ArgView arg={arg} key={arg.name} />)}
            <CommonViews obj={field.type} />
          </>
        }
      />
    </>
  )
}

export default FieldView

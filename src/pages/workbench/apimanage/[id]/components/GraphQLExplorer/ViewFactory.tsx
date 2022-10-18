import type {
  GraphQLFieldMap,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLType
} from 'graphql'
import {
  isEnumType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType
} from 'graphql'

import { arraySort, convertGraphiQLFieldMapToArray } from '../utils'
import BaseView from './BaseView'
import FieldView from './FieldView'

export function MultipleFieldViews({
  map,
  sort = true
}: {
  map: GraphQLFieldMap<any, any> | undefined
  sort?: boolean
}) {
  let arr = convertGraphiQLFieldMapToArray(map)
  if (sort) {
    arr = arraySort(arr)
  }
  return (
    <>
      {arr.map(field => {
        return <FieldView key={field.name} field={field} />
      })}
    </>
  )
}

export function ObjectViews({ obj }: { obj: GraphQLObjectType }) {
  return <MultipleFieldViews map={obj.getFields()} />
}

export function InputObjectViews({ obj }: { obj: GraphQLInputObjectType }) {
  // return generateFieldViews(obj.getFields())
  return <>InputObjectViews</>
}

export function ScalarViews({ obj, checked }: { obj: GraphQLScalarType; checked: boolean }) {
  return <BaseView name={obj.name} color="blue" selectable />
}

export function NonNullViews({ obj }: { obj: GraphQLNonNull<GraphQLNullableType> }) {
  if (isObjectType(obj.ofType)) {
    return <ObjectViews obj={obj.ofType} />
  }
  if (isScalarType(obj)) {
    return <ScalarViews obj={obj} checked={false} />
  }
  if (isInterfaceType(obj)) {
    return <InterfaceViews />
  }
  if (isUnionType(obj)) {
    return <UnionViews />
  }
  if (isEnumType(obj)) {
    return <EnumViews />
  }
  if (isListType(obj)) {
    return <ListViews />
  }
  console.log('other')
  return <>{'other'}</>
}

export function InterfaceViews() {
  return <>InterfaceViews</>
}

export function UnionViews() {
  return <>UnionViews</>
}

export function EnumViews() {
  return <>EnumViews</>
}

export function ListViews() {
  return <>ListViews</>
}

export function CommonViews({ obj }: { obj: GraphQLType }) {
  if (isNonNullType(obj)) {
    return <NonNullViews obj={obj} />
  }
  if (isObjectType(obj)) {
    return <ObjectViews obj={obj} />
  }
  if (isScalarType(obj)) {
    return <ScalarViews obj={obj} checked={false} />
  }
  if (isInterfaceType(obj)) {
    return <InterfaceViews />
  }
  if (isUnionType(obj)) {
    return <UnionViews />
  }
  if (isEnumType(obj)) {
    return <EnumViews />
  }
  if (isListType(obj)) {
    return <ListViews />
  }
  console.log('other')
  return <>{'other'}</>
}

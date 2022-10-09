import { GraphQLFieldMap, GraphQLNonNull, GraphQLNullableType, GraphQLObjectType, isObjectType } from 'graphql';

import FieldView from './FieldView';
import { arraySort, convertGraphiQLFieldMapToArray } from './utils';

export function generateFieldViews(map: GraphQLFieldMap<any, any> | undefined, sort = true) {
  let arr = convertGraphiQLFieldMapToArray(map)
  if (sort) {
    arr = arraySort(arr)
  }
  return arr.map(field => {
    return <FieldView key={field.name} field={field} />
  })
}

export function generateObjectViews(obj: GraphQLObjectType) {
  return generateFieldViews(obj.getFields())
}

export function generateNonNullViews(obj: GraphQLNonNull<GraphQLNullableType>) {
  if (isObjectType(obj.ofType)) {
    return generateObjectViews(obj.ofType)
  }
}
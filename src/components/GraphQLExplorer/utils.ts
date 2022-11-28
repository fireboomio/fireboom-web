import type { GraphQLFieldMap } from 'graphql'
import type { CSSProperties } from 'react'

export function convertGraphiQLFieldMapToArray(map: undefined | GraphQLFieldMap<any, any>) {
  return map ? Object.keys(map).map(key => map[key]) : []
}

type SortableItem = { name: string }
export function arraySort<T extends SortableItem>(array: T[]): T[] {
  return array.sort((a, b) => a.name.localeCompare(b.name))
}

export const checkboxStyle: CSSProperties = {
  marginLeft: '-3px',
  marginRight: '3px'
}

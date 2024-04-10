import language from '@/components/PrismaTable/libs/language'
import type { FilterState, FilterVariableType } from '@/components/PrismaTable/libs/types'

export type FieldType =
  | 'Int'
  | 'BigInt'
  | 'Decimal'
  | 'Float'
  | 'DateTime'
  | 'Geometry'
  | 'String'
  | 'Boolean'
  | 'Enum'
  | 'object'

type filterOperatorsMapType = {
  notExistsInType: FieldType[]
  onlyInType?: FieldType[]
  display: string
}
export const filterOperators: Record<string, filterOperatorsMapType> = {
  equals: {
    notExistsInType: [],
    display: language.equals
  },
  in: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.in
  },
  notIn: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.notIn
  },
  lt: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.lt
  },
  lte: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.lte
  },
  gt: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.gt
  },
  gte: {
    notExistsInType: ['Boolean', 'Enum', 'Geometry'],
    display: language.gte
  },
  not: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.not
  },
  contains: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime', 'Geometry'],
    display: language.contains
  },
  startsWith: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime', 'Geometry'],
    display: language.startsWith
  },
  endsWith: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime', 'Geometry'],
    display: language.endsWith
  },
  geoWithin: {
    onlyInType: ['Geometry'],
    display: language.geoWithin,
    notExistsInType: []
  },
  geoIntersects: {
    onlyInType: ['Geometry'],
    display: language.geoIntersects,
    notExistsInType: []
  },
  // 暂不支持
  // geoDWithin: {
  //   onlyInType: ['Geometry'],
  //   display: language.geoDWithin,
  //   notExistsInType: []
  // }
}

export const buildFilterVariableFrom = (filterStates: FilterState[]): FilterVariableType => {
  const filterRecord: Record<string, unknown> = {}
  filterStates.forEach(filterState => {
    const { field, operator, relationField, value } = filterState
    const operateValue = { [operator]: value }
    filterRecord[field.name] = relationField
      ? field.list
        ? { some: { [relationField.name]: operateValue } }
        : { [relationField.name]: operateValue }
      : operateValue
  })
  return { where: filterRecord }
}

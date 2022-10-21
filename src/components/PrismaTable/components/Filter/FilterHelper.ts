import language from '@/components/PrismaTable/libs/language';
import { FilterState, FilterVariableType } from '@/components/PrismaTable/libs/types';

export type FieldType = 'Int' | 'BigInt' | 'Decimal' | 'Float' | 'DateTime' | 'String' | 'Boolean' | 'Enum' | 'object'

type filterOperatorsMapType = {
  notExistsInType: FieldType[]
  display: string
}
export const filterOperators: { [key: string]: filterOperatorsMapType } = {
  equals: {
    notExistsInType: [],
    display: language.equals,
  },
  in: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.in,
  },
  notIn: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.notIn,
  },
  lt: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.lt,
  },
  lte: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.lte,
  },
  gt: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.gt,
  },
  gte: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.gte,
  },
  not: {
    notExistsInType: ['Boolean', 'Enum'],
    display: language.not,
  },
  contains: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime'],
    display: language.contains,
  },
  startsWith: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime'],
    display: language.startsWith,
  },
  endsWith: {
    notExistsInType: ['Boolean', 'Enum', 'Int', 'BigInt', 'Decimal', 'Float', 'DateTime'],
    display: language.endsWith,
  },
};

export const buildFilterVariableFrom = (filterStates: FilterState[]): FilterVariableType => {
  const filterRecord: {[key: string]: unknown} = {};
  filterStates.forEach(filterState => {
    const { field, operator, relationField, value } = filterState;
    const operateValue = { [operator]: value };
    filterRecord[field.name] = relationField
      ? field.list
        ? { some: { [relationField.name]: operateValue } }
        : { [relationField.name]: operateValue }
      : operateValue;
  });
  return { where: filterRecord };
};

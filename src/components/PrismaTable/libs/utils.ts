import { SchemaModel } from '@paljs/types';

import { TableData } from '@/components/PrismaTable/libs/types';

export const getDisplayName = (value: Record<string, any>, model: SchemaModel) => {
  if (Object.keys(value).length > 0) {
    const values: string[] = [];
    model.displayFields.forEach((item) => {
      const splitItem = item.split('.');
      if (splitItem.length === 1) {
        values.push(String(value[splitItem[0]]));
      } else {
        let nameValue: any = { ...value };
        splitItem.forEach((field) => {
          if (nameValue) {
            nameValue = nameValue[field];
          }
        });
        if (nameValue) {
          values.push(String(nameValue));
        }
      }
    });
    return values.join(' ');
  }
  return '';
};

type AggregateCount = {
  _count: {
    _all: number
  }
}

export const getTableDataFromGraphQLResp = (model: string, dataRecord: any, namespace?: string): TableData => {
  return {
    tableData: dataRecord ? dataRecord[`${namespace ? namespace + '_' : ''}findMany${model}`] as Record<string, any>[] ?? [] : [],
    // tableDataTotalCount: dataRecord ? dataRecord[`${namespace ? namespace + '_' : ''}findMany${model}Count`] as number ?? 0 : 0,
    tableDataTotalCount: dataRecord ? (dataRecord[`${namespace ? namespace + '_' : ''}aggregate${model}`] as AggregateCount)._count._all ?? 0 : 0,
  };
};

export const deleteEntryFromRecord = (key: string, record: Record<string, any>) => {
  const newRecord: Record<string, any> = {};
  Object.keys(record).forEach(k => {
    k !== key && (newRecord[k] = record[k]);
  });
  return newRecord;
};

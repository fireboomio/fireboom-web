import { type DMMF } from '@/interfaces/dbml';
import { getModelByType } from './model';

export function generateManyToManyTables(
  models: DMMF.Model[],
  mapToDbSchema: boolean = false
): string[] {
  const manyToManyFields = filterManyToManyRelationFields(models);
  if (manyToManyFields.length === 0) {
    return [];
  }
  return generateTables(manyToManyFields, models, [], mapToDbSchema);
}

function generateTables(
  manyToManyFields: DMMF.Field[],
  models: DMMF.Model[],
  manyToManyTables: string[] = [],
  mapToDbSchema: boolean = false
): string[] {
  const manyFirst = manyToManyFields.shift();
  if (!manyFirst) {
    return manyToManyTables;
  }

  const manySecond = manyToManyFields.find(
    (field) => field.relationName === manyFirst.relationName
  )!;

  if (!manySecond) {
    return manyToManyTables;
  }

  manyToManyTables.push(
    `Table ${manyFirst?.relationName} {\n` +
      `${generateJoinFields([manyFirst, manySecond], models, mapToDbSchema)}` +
      '\n}'
  );

  return generateTables(
    manyToManyFields.filter(
      (field) => field.relationName !== manyFirst.relationName
    ),
    models,
    manyToManyTables,
    mapToDbSchema
  );
}

function generateJoinFields(
  field: DMMF.Field[],
  models: DMMF.Model[],
  mapToDbSchema: boolean = false
): string {
  return field
    .map((field) => joinField(field, models, mapToDbSchema))
    .join('\n');
}

function joinField(
  field: DMMF.Field,
  models: DMMF.Model[],
  mapToDbSchema: boolean = false
): string {
  const fieldName = mapToDbSchema
    ? getModelByType(models, field.type)?.dbName || field.type
    : field.type;

  return `  ${field.name.toLowerCase()}Id ${getJoinIdType(
    field,
    models
  )} [ref: > ${fieldName}.${field.relationToFields![0]}]`;
}

function getJoinIdType(joinField: DMMF.Field, models: DMMF.Model[]): string {
  const joinIdField = models
    .filter((model) => model.name === joinField.type)
    .map(
      (model) =>
        model.fields.find(
          (field) => field.name === joinField.relationToFields![0]
        )!
    )[0];

  return joinIdField.type;
}

function filterManyToManyRelationFields(models: DMMF.Model[]): DMMF.Field[] {
  return models
    .map((model) =>
      model.fields
        .filter(
          (field) =>
            field.relationName &&
            field.isList &&
            field.relationFromFields?.length === 0 &&
            field.relationToFields?.length
        )
        .map((field) => field)
    )
    .flat();
}
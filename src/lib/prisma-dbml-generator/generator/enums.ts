import { type DMMF } from '@/interfaces/dbml';

export function generateEnums(enums: DMMF.DatamodelEnum[]): string[] {
  return enums.map(
    (e) => `Enum ${e.name} {\n` + generateEnumValues(e.values) + '\n}'
  );
}

const generateEnumValues = (values: DMMF.EnumValue[]): string => {
  return values.map((value) => `  ${value.name}`).join('\n');
};
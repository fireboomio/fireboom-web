import { type DMMF } from '@/interfaces/dbml';

export const getModelByType = (
  models: DMMF.Model[],
  type: string
): DMMF.Model | undefined => {
  return models.find((model) => model.name === type);
};
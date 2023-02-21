import type { Model } from '@/interfaces/modeling'

export const BASE_URL = '/api/v1'
export const DATABASE_SOURCE = '/dataSource'
export const MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_ID = '/prisma/migrate/:id'
export const PRISMA_PREVIEW_GRAPHQL_SCHEMA = '/prisma/dmf/:id'
export const PRISMA_PREVIEW_GRAPHQL_URL = '/model/graphql/'

export const UNTITLED_NEW_ENTITY = 'Untitled'
export const ENTITY_NAME_REGEX = '^[A-Za-z][A-Za-z0-9_]*$'

export const MANAGE_DATASOURCE_URL = '/workbench/data-source/new'

export const MAGIC_DELETE_ENTITY_NAME = 'fb_delete'
export const MAGIC_DELETE_ENTITY: Model = {
  id: 0,
  name: MAGIC_DELETE_ENTITY_NAME,
  type: 'model',
  properties: [
    {
      type: 'field',
      name: 'id',
      fieldType: 'Int',
      attributes: [
        {
          type: 'attribute',
          kind: 'field',
          name: 'id'
        }
      ]
    }
  ]
}

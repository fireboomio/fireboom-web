import type { Model } from '@/interfaces/modeling'

export const BASE_URL = '/api'
export const DATABASE_SOURCE = '/datasource'
export const MIGRATE_PRISMA_SCHEMA_BY_DB_SOURCE_NAME = '/datasource/migrate/:name'
export const PRISMA_PREVIEW_GRAPHQL_SCHEMA = '/datasource/dmmf/:name'
export const PRISMA_PREVIEW_GRAPHQL_URL = '/api/datasource/graphqlQuery/{dataSourceName}'

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

export const REGEX_FIELD_NAME = /^([A-Za-z][A-Za-z0-9_]*[A-Za-z0-9])|[A-Za-z]$/
export const REGEX_FILED_NAME_UPPER_FIRST = /^([A-Z][A-Za-z0-9_]*[A-Za-z0-9])|[A-Z]$/

export const SCHEMA_FOR_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://json-schema.org/draft/2020-12/schema',
  $vocabulary: {
    'https://json-schema.org/draft/2020-12/vocab/core': true,
    'https://json-schema.org/draft/2020-12/vocab/applicator': true,
    'https://json-schema.org/draft/2020-12/vocab/unevaluated': true,
    'https://json-schema.org/draft/2020-12/vocab/validation': true,
    'https://json-schema.org/draft/2020-12/vocab/meta-data': true,
    'https://json-schema.org/draft/2020-12/vocab/format-annotation': true,
    'https://json-schema.org/draft/2020-12/vocab/content': true
  },
  $dynamicAnchor: 'meta',

  title: 'Core and Validation specifications meta-schema',
  allOf: [
    { $ref: 'meta/core' },
    { $ref: 'meta/applicator' },
    { $ref: 'meta/unevaluated' },
    { $ref: 'meta/validation' },
    { $ref: 'meta/meta-data' },
    { $ref: 'meta/format-annotation' },
    { $ref: 'meta/content' }
  ],
  type: ['object', 'boolean'],
  $comment:
    'This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.',
  properties: {
    definitions: {
      $comment: '"definitions" has been replaced by "$defs".',
      type: 'object',
      additionalProperties: { $dynamicRef: '#meta' },
      deprecated: true,
      default: {}
    },
    dependencies: {
      $comment:
        '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
      type: 'object',
      additionalProperties: {
        anyOf: [{ $dynamicRef: '#meta' }, { $ref: 'meta/validation#/$defs/stringArray' }]
      },
      deprecated: true,
      default: {}
    },
    $recursiveAnchor: {
      $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
      $ref: 'meta/core#/$defs/anchorString',
      deprecated: true
    },
    $recursiveRef: {
      $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
      $ref: 'meta/core#/$defs/uriReferenceString',
      deprecated: true
    }
  }
}

export const MIME_LIST = [
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
  'application/zip',
  'application/pdf',
  'application/x-tar',
  'application/x-gzip',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/msword',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'video/mp4',
  'video/ogg',
  'video/webm',
  'application/octet-stream',
  'image/*',
  'video/*',
  'audio/*'
]

export const FILE_EXTENSION_LIST = [
  'html',
  'htm',
  'shtml',
  'xml',
  'css',
  'js',
  'json',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'csv',
  'rtf',
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  'bz2',
  'dmg',
  'iso',
  'mp3',
  'mp4',
  'avi',
  'mov',
  'wmv',
  'flv',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'svg',
  'webp',
  'ico'
]

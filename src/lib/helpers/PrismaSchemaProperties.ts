import type { Field } from '@mrleebo/prisma-ast'
import type { AttributeArgument } from '@mrleebo/prisma-ast/src/getSchema'
import { useIntl } from 'react-intl'

import { DataSourceKind } from '@/interfaces/datasource'
import type { Entity } from '@/interfaces/modeling'

export interface AttributeHandlersProp {
  args: AttributeArgument[]
  updateAttrArgs: (newArgs: AttributeArgument[]) => void
  field?: Field
  currentModelFields?: Field[]
  relationEntity?: Entity
}

export interface AttributeType {
  name: string
  hasArgs: boolean
  comment?: string
  display?: (params: AttributeHandlersProp) => JSX.Element
}

type PrismaSchemaAttributePropertiesType = Record<
  number,
  {
    fieldType: Record<string, { attributes: AttributeType[] }>
    model: { attributes: AttributeType[] }
  }
>

export function usePrismaSchemaProperties(): PrismaSchemaAttributePropertiesType {
  const intl = useIntl()
  const CommonFieldAttributes: AttributeType[] = [
    { name: 'id', hasArgs: false, comment: intl.formatMessage({ defaultMessage: '主键' }) },
    {
      name: 'default',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '默认值' })
    },
    {
      name: 'unique',
      hasArgs: false,
      comment: intl.formatMessage({ defaultMessage: '唯一索引' })
    },
    {
      name: 'map',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '字段别名' })
    },
    {
      name: 'ignore',
      hasArgs: false,
      comment: intl.formatMessage({ defaultMessage: '忽略该字段' })
    }
  ]

  const CommonModelAttributes: AttributeType[] = [
    {
      name: 'index',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '联合索引' })
    },
    {
      name: 'id',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '联合主键' })
    },
    {
      name: 'unique',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '联合唯一索引' })
    },
    {
      name: 'map',
      hasArgs: true,
      comment: intl.formatMessage({ defaultMessage: '实体别名' })
    },
    {
      name: 'ignore',
      hasArgs: false,
      comment: intl.formatMessage({ defaultMessage: '忽略该表' })
    }
  ]
  return {
    [DataSourceKind.PostgreSQL]: {
      fieldType: {
        String: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Text', hasArgs: false },
            { name: 'db.Char', hasArgs: true },
            { name: 'db.VarChar', hasArgs: true },
            { name: 'db.Bit', hasArgs: true },
            { name: 'db.VarBit', hasArgs: false },
            { name: 'db.Uuid', hasArgs: false },
            { name: 'db.Xml', hasArgs: false },
            { name: 'db.Inet', hasArgs: false },
            { name: 'db.Citext', hasArgs: false }
          ]
        },
        Boolean: {
          attributes: [...CommonFieldAttributes, { name: 'db.Boolean', hasArgs: false }]
        },
        Int: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Integer', hasArgs: false },
            { name: 'db.SmallInt', hasArgs: false },
            { name: 'db.SmallInt', hasArgs: false },
            { name: 'db.Int', hasArgs: false },
            { name: 'db.Oid', hasArgs: false }
          ]
        },
        BigInt: {
          attributes: [...CommonFieldAttributes, { name: 'db.BigInt', hasArgs: false }]
        },
        Float: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.DoublePrecision', hasArgs: false },
            { name: 'db.Real', hasArgs: false }
          ]
        },
        Decimal: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Decimal', hasArgs: true },
            { name: 'db.Money', hasArgs: false }
          ]
        },
        DateTime: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Timestamp', hasArgs: true },
            { name: 'db.Timestamptz', hasArgs: true },
            { name: 'db.Date', hasArgs: false },
            { name: 'db.Time', hasArgs: true },
            { name: 'db.Timetz', hasArgs: true },
            { name: 'updatedAt', hasArgs: false, comment: '更新时间' }
          ]
        },
        Json: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Json', hasArgs: false },
            { name: 'db.JsonB', hasArgs: false }
          ]
        },
        Bytes: {
          attributes: [...CommonFieldAttributes, { name: 'db.ByteA', hasArgs: false }]
        },
        Model: {
          attributes: [
            ...CommonFieldAttributes.filter(a => ['map', 'ignore'].includes(a.name)),
            { name: 'relation', hasArgs: true }
          ]
        },
        Enum: {
          attributes: [...CommonFieldAttributes]
        },
        Unsupported: {
          attributes: [
            {
              name: 'map',
              hasArgs: true,
              comment: intl.formatMessage({ defaultMessage: '字段别名' })
            },
            {
              name: 'ignore',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '忽略该字段' })
            }
          ]
        }
      },
      model: {
        attributes: [...CommonModelAttributes]
      }
    },
    [DataSourceKind.MySQL]: {
      fieldType: {
        String: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.VarChar', hasArgs: true },
            { name: 'db.Text', hasArgs: false },
            { name: 'db.Char', hasArgs: true },
            { name: 'db.TinyText', hasArgs: false },
            { name: 'db.MediumText', hasArgs: false },
            { name: 'db.LongText', hasArgs: false }
          ]
        },
        Boolean: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.TinyInt', hasArgs: true },
            { name: 'db.Bit', hasArgs: false }
          ]
        },
        Int: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Int', hasArgs: false },
            { name: 'db.UnsignedInt', hasArgs: false },
            { name: 'db.SmallInt', hasArgs: false },
            { name: 'db.UnsignedSmallInt', hasArgs: false },
            { name: 'db.MediumInt', hasArgs: false },
            { name: 'db.UnsignedMediumInt', hasArgs: false },
            { name: 'db.TinyInt', hasArgs: false },
            { name: 'db.UnsignedTinyInt', hasArgs: false },
            { name: 'db.Year', hasArgs: false }
          ]
        },
        BigInt: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.BigInt', hasArgs: false },
            { name: 'db.UnsignedBigInt', hasArgs: false }
          ]
        },
        Float: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Float', hasArgs: false },
            { name: 'db.Double', hasArgs: false }
          ]
        },
        Decimal: {
          attributes: [...CommonFieldAttributes, { name: 'db.Decimal', hasArgs: true }]
        },
        DateTime: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.DateTime', hasArgs: true },
            { name: 'db.Date', hasArgs: true },
            { name: 'db.Time', hasArgs: true },
            { name: 'db.Timestamp', hasArgs: true },
            {
              name: 'updatedAt',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '更新时间' })
            }
          ]
        },
        Json: {
          attributes: [...CommonFieldAttributes, { name: 'db.Json', hasArgs: false }]
        },
        Bytes: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.LongBlob', hasArgs: false },
            { name: 'db.Binary', hasArgs: false },
            { name: 'db.VarBinary', hasArgs: false },
            { name: 'db.TinyBlob', hasArgs: false },
            { name: 'db.Blob', hasArgs: false },
            { name: 'db.MediumBlob', hasArgs: false },
            { name: 'db.Bit', hasArgs: false }
          ]
        },
        Model: {
          attributes: [
            ...CommonFieldAttributes.filter(a => ['map', 'ignore'].includes(a.name)),
            { name: 'relation', hasArgs: true }
          ]
        },
        Enum: {
          attributes: [...CommonFieldAttributes]
        },
        Unsupported: {
          attributes: [
            {
              name: 'map',
              hasArgs: true,
              comment: intl.formatMessage({ defaultMessage: '字段别名' })
            },
            {
              name: 'ignore',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '忽略该字段' })
            }
          ]
        }
      },
      model: {
        attributes: [...CommonModelAttributes]
      }
    },
    [DataSourceKind.SQLite]: {
      fieldType: {
        String: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.String', hasArgs: true },
            { name: 'db.Char', hasArgs: true },
            { name: 'db.CatalogSingleChar', hasArgs: false },
            { name: 'db.Bit', hasArgs: true },
            { name: 'db.VarBit', hasArgs: false },
            { name: 'db.Uuid', hasArgs: false },
            { name: 'db.Inet', hasArgs: false }
          ]
        },
        Boolean: {
          attributes: [...CommonFieldAttributes, { name: 'db.Bool', hasArgs: false }]
        },
        Int: {
          attributes: [...CommonFieldAttributes]
        },
        BigInt: {
          attributes: [...CommonFieldAttributes]
        },
        Float: {
          attributes: [...CommonFieldAttributes]
        },
        Decimal: {
          attributes: [...CommonFieldAttributes]
        },
        DateTime: {
          attributes: [
            ...CommonFieldAttributes,
            {
              name: 'updatedAt',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '更新时间' })
            }
          ]
        },
        // 'Json': {}, // not supported
        Bytes: {
          attributes: [...CommonFieldAttributes]
        },
        Model: {
          attributes: [
            ...CommonFieldAttributes.filter(a => ['map', 'ignore'].includes(a.name)),
            { name: 'relation', hasArgs: true }
          ]
        },
        Enum: {
          attributes: [...CommonFieldAttributes]
        },
        Unsupported: {
          attributes: [
            {
              name: 'map',
              hasArgs: true,
              comment: intl.formatMessage({ defaultMessage: '字段别名' })
            },
            {
              name: 'ignore',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '忽略该字段' })
            }
          ]
        }
      },
      model: {
        attributes: [...CommonModelAttributes]
      }
    },
    [DataSourceKind.MongoDB]: {
      fieldType: {
        String: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.ObjectId', hasArgs: false },
            { name: 'db.String', hasArgs: false }
          ]
        },
        Boolean: {
          attributes: [...CommonFieldAttributes, { name: 'db.Bool', hasArgs: false }]
        },
        Int: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Int', hasArgs: false },
            { name: 'db.Long', hasArgs: false }
          ]
        },
        BigInt: {
          attributes: [...CommonFieldAttributes, { name: 'db.Long', hasArgs: false }]
        },
        Float: {
          attributes: [...CommonFieldAttributes, { name: 'db.Double', hasArgs: false }]
        },
        DateTime: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.Date', hasArgs: true },
            { name: 'db.Timestamp', hasArgs: true },
            {
              name: 'updatedAt',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '更新时间' })
            }
          ]
        },
        Json: {
          attributes: [...CommonFieldAttributes, { name: 'db.Json', hasArgs: false }]
        },
        Bytes: {
          attributes: [
            ...CommonFieldAttributes,
            { name: 'db.BinData', hasArgs: false },
            { name: 'db.ObjectId', hasArgs: false }
          ]
        },
        Model: {
          attributes: [
            ...CommonFieldAttributes.filter(a => ['map', 'ignore'].includes(a.name)),
            { name: 'relation', hasArgs: true }
          ]
        },
        Enum: {
          attributes: [...CommonFieldAttributes]
        },
        Unsupported: {
          attributes: [
            {
              name: 'map',
              hasArgs: true,
              comment: intl.formatMessage({ defaultMessage: '字段别名' })
            },
            {
              name: 'ignore',
              hasArgs: false,
              comment: intl.formatMessage({ defaultMessage: '忽略该字段' })
            }
          ]
        }
      },
      model: {
        attributes: [...CommonModelAttributes]
      }
    }
  }
}

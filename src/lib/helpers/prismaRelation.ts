// 解析
import { get } from 'lodash'

export type RelationMap = {
  key2obj: Record<string, string>
  obj2key: Record<string, string>
}

export function findRelations(entity: any): RelationMap {
  const obj2key: Record<string, string> = {}
  const key2obj: Record<string, string> = {}
  entity?.properties?.forEach((p: any) => {
    p?.attributes?.forEach((a: any) => {
      if (a.name === 'relation') {
        const relatedKey = get(a, 'args[0].value.value.args[0]')
        if (relatedKey) {
          obj2key[p.name] = relatedKey
          key2obj[relatedKey] = p.name
        }
      }
    })
  })
  return { obj2key, key2obj }
}

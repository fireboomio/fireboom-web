import axios from 'axios'
import { getIntrospectionQuery } from 'graphql/index'
import type { IntrospectionType } from 'graphql/utilities/getIntrospectionQuery'
import { keyBy } from 'lodash'

export default async function (): Promise<Record<string, IntrospectionType>> {
  const result = await axios.post('/app/main/graphql', {
    operationName: 'IntrospectionQuery',
    query: getIntrospectionQuery({
      directiveIsRepeatable: true,
    })
  })
  return keyBy(result.data.data.__schema.types, 'name')
}

import type { DatasourceResp, DatasourceAction } from '@/interfaces/datasource'

import requests from '../fetchers'

const getData = async () => {
  const result = await requests.get<unknown, DatasourceResp[]>('/dataSource')
  return result
}

export default function datasourceReducer(
  datasoucreList: DatasourceResp[],
  action: DatasourceAction
) {
  switch (action.type) {
    case 'fetched': {
      // let result: DatasourceResp[]
      // const bbb = requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      //   result = res
      //   return result.filter((item) => item.source_type == 1)
      // })
      // console.log(bbb, 'bbb')
      // return
      return datasoucreList
    }
    case 'selected': {
      return action.data
    }
    case 'added': {
      return [...datasoucreList, action.data]
    }
    case 'changed':
      return datasoucreList.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return datasoucreList.filter((b) => b.id !== action.data.id)
    }
    default:
      return datasoucreList
  }
}

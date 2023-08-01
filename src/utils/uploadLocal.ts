import axios from 'axios'

import { getHeader } from '@/lib/fetchers'

export default async function uploadLocal(uri: string, content: string, fileName: string) {
  let param = new FormData() //创建form对象
  param.append('content', new File([content], fileName))
  param.append('uri', uri)
  param.append('create', 'true')
  param.append('overwrite', 'true')
  let config = {
    headers: { 'Content-Type': 'multipart/form-data', ...getHeader() } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
  } //添加请求头
  return await axios.post('/api/vscode/writeFile', param, config)
}

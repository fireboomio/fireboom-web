import requests from '@/lib/fetchers'

export default async function writeFile(uri: string, content: string | File, fileName?: string) {
  let param = new FormData() //创建form对象
  if (content instanceof File) {
    param.append('content', content)
  } else {
    param.append('content', new File([content], fileName!))
  }
  param.append('uri', uri)
  param.append('create', 'true')
  param.append('overwrite', 'true')
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
  } //添加请求头
  return await requests.post('/vscode/writeFile', param, config)
}

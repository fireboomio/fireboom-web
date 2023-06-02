import { message } from 'antd'

import { proxy } from '@/lib/fetchers'

export const FB_SERVICE_DISCOVERY_URL =
  'https://fireboom.oss-cn-hangzhou.aliyuncs.com/fb-service-discovery.json'

export type fbRepositoryUrlTemplate = {
  fbFilesUrlTemplate: string
  fbRepositoryUrlTemplate: string
}

let _discoveryJson: fbRepositoryUrlTemplate
let _promise: Promise<fbRepositoryUrlTemplate>

async function _ensureJson() {
  if (!_discoveryJson) {
    if (!_promise) {
      _promise = proxy(FB_SERVICE_DISCOVERY_URL)
    }
    _discoveryJson = await _promise
  }
  return !!_discoveryJson
}

export async function getFireboomFileContent(filename: string) {
  if (await _ensureJson()) {
    const url = _discoveryJson.fbFilesUrlTemplate.replace('{filePath}', filename)
    return await proxy(url)
  }
  message.error('获取地址失败')
}

export async function getFireboomRepositoryUrl(repositoryName: string) {
  if (await _ensureJson()) {
    return _discoveryJson.fbRepositoryUrlTemplate.replace('{repositoryName}', repositoryName)
  }
  message.error('获取地址失败')
}

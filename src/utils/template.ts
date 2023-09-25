import { Eta } from 'eta'
import { upperFirst } from 'lodash'

import { proxy } from '@/lib/fetchers'

const eta = new Eta()

export function getRawUrl(isGithub: boolean, pathList: string[], ext: string) {
  // TODO，后续修改为mirror策略
  const _ext = ext.replace(/^\./, '')
  if (isGithub) {
    return `https://raw.githubusercontent.com/fireboomio/files/main/templates/${pathList.join(
      '/'
    )}.${_ext}`
  }
  return `https://code.100ai.com.cn/fireboomio/files/raw/branch/main/templates/${pathList.join(
    '/'
  )}.${_ext}`
}

export async function getHookTemplate(
  lang: string,
  ext: string,
  hookFilePath: string[]
): Promise<string> {
  const ret = await proxy(getRawUrl(false, [lang === 'go' ? 'golang' : lang, ...hookFilePath], ext))
  return ret
}

export function replaceFileTemplate(
  templateStr: string,
  variables?: Record<string, string | number | boolean>
): string {
  // @ts-ignore
  return eta.renderString(templateStr, { ...variables, upperFirst })
}

export async function getDefaultCode(
  lang: string,
  ext: string,
  hookFilePath: string[],
  variables?: Record<string, string | number | boolean>
) {
  const templateStr = await getHookTemplate(lang, ext, hookFilePath)
  return replaceFileTemplate(templateStr, variables)
}

export async function resolveDefaultCode(
  path: string,
  language: string,
  ext: string
): Promise<string> {
  const list = path.split('/')
  let name = list.pop()!.split('.')[0]
  const packageName = list[list.length - 1]
  let code = ''
  const variables = {
    packageName,
    name
  }
  if (path.match(/custom-\w+\/global\//)) {
    code = await getDefaultCode(language, ext, ['global', name], variables)
  } else if (path.match(/custom-\w+\/authentication\//)) {
    code = await getDefaultCode(language, ext, ['authentication', name], variables)
  } else if (path.match(/custom-\w+\/customize\//)) {
    code = await getDefaultCode(language, ext, ['custom', 'customize'], variables)
  } else if (path.match(/custom-\w+\/function\//)) {
    code = await getDefaultCode(language, ext, ['custom', 'function'], variables)
  } else if (path.match(/custom-\w+\/proxy\//)) {
    code = await getDefaultCode(language, ext, ['custom', 'proxy'], variables)
  } else if (path.match(/custom-\w+\/storage/)) {
    const profileName = list.pop() as string
    const providerName = list.pop() as string
    code = await getDefaultCode(language, ext, ['upload', name], {
      ...variables,
      providerName,
      profileName
    })
  } else {
    const operationPath = list.slice(-2).join('/')
    code = await getDefaultCode(language, ext, ['operation', name], { ...variables, operationPath })
  }
  return code
}

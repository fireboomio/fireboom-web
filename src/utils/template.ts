import { getGoTemplate, getTsTemplate } from '@/components/Ide/getDefaultCode'

export function replaceFileTemplate(
  templateStr: string,
  variables: { variableName: string; value: string }[]
): string {
  let ret = templateStr
  variables.forEach(item => {
    ret = ret
      // 首字母大写
      .replaceAll(`^$${item.variableName}$`, item.value[0].toUpperCase() + item.value.slice(1))
      // 变量替换
      .replaceAll(`$${item.variableName}$`, item.value)
  })
  return ret
}

export async function resolveDefaultCode(
  path: string,
  hasParam: boolean,
  language: string
): Promise<string> {
  let getDefaultCode
  if (language === 'go') {
    getDefaultCode = getGoTemplate
  } else {
    getDefaultCode = getTsTemplate
  }
  const list = path.split('/')
  let name = list.pop()!.split('.')[0]
  const packageName = list[list.length - 1]
  let code = ''
  if (path.match(/custom-\w+\/global\//)) {
    // 兼容
    if (name === 'beforeOriginRequest') {
      name = 'beforeRequest'
    } else if (name === 'onOriginRequest') {
      name = 'onRequest'
    } else if (name === 'onOriginResponse') {
      name = 'onResponse'
    }
    code = await getDefaultCode(`global.${name}`)
  } else if (path.match(/custom-\w+\/authentication\//)) {
    code = await getDefaultCode(`auth.${name}`)
  } else if (path.match(/custom-\w+\/customize\//)) {
    code = replaceFileTemplate(await getDefaultCode('custom.customize'), [
      { variableName: 'CUSTOMIZE_NAME', value: name }
    ])
  } else if (path.match(/custom-\w+\/function\//)) {
    code = replaceFileTemplate(await getDefaultCode('custom.function'), [
      { variableName: 'FUNCTION_NAME', value: name },
      { variableName: 'PACKAGE_NAME', value: packageName }
    ])
  } else if (path.match(/custom-\w+\/proxy\//)) {
    code = replaceFileTemplate(await getDefaultCode('custom.proxy'), [
      { variableName: 'PROXY_NAME', value: name },
      { variableName: 'PACKAGE_NAME', value: packageName }
    ])
  } else if (path.match(/custom-\w+\/storage/)) {
    const profileName = list.pop() as string
    const storageName = list.pop() as string
    code = replaceFileTemplate(await getDefaultCode(`upload.${name}`), [
      { variableName: 'STORAGE_NAME', value: storageName },
      { variableName: 'PROFILE_NAME', value: profileName }
    ])
  } else {
    const pathList = list.slice(2)
    const tmplPath = `hook.${hasParam ? 'WithInput' : 'WithoutInput'}.${name}`
    code = replaceFileTemplate(await getDefaultCode(tmplPath), [
      {
        variableName: 'HOOK_NAME',
        value: pathList.join('__')
      }
    ])
  }
  return code.replaceAll('$HOOK_PACKAGE$', packageName!)
}

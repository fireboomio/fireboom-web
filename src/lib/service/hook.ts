import requests from '@/lib/fetchers'

// 保存脚本内容
// export const saveScript = (data: any) => {
//   return requests.post('/hook/script', data)
// }

// 更新全局钩子开关
export const updateGlobalOperationHookEnabled = (
  operationName: string,
  hookName: string,
  value: boolean
) => {
  return requests.put('/globalOperation', {
    path: operationName,
    globalHttpTransportHooks: {
      [hookName]: value
    }
  })
}

// 更新开关
export const updateOperationHookEnabled = (
  operationName: string,
  hookName: string,
  value: boolean
) => {
  if (hookName === 'mockResolve') {
    return requests.put('/operation', {
      path: operationName,
      hooksConfiguration: {
        [hookName]: { enabled: value }
      }
    })
  }
  return requests.put('/operation', {
    path: operationName,
    hooksConfiguration: {
      [hookName]: value
    }
  })
}

// 获取hook内容
export const getHook = <T>(path: string) => {
  return requests.get<any, T>('/hook', { params: { path: path } })
}

// 更新hook脚本内容
export const saveHookScript = (path: string, script: string) => {
  return requests.post('/hook/script', {
    path,
    script
  })
}

// 更新hook输入内容
// export const saveHookInput = (path: string, input: Record<string, string>) => {
//   return requests.post('/hook/input', {
//     path,
//     input
//   })
// }

// 更新hook依赖
export const saveHookDepend = (path: string, depend: Record<string, string>[]) => {
  console.log(depend)
  return requests.post('/hook/depend', {
    path,
    depend: { dependencies: depend }
  })
}

// 运行hook
// export const runHook = <R>(
//   path: string,
//   params: {
//     depend: Record<string, string>[]
//     input: Record<string, string>
//     script: string
//     scriptType: string
//   }
// ) => {
//   return requests.post<any, R>('/hook/run', {
//     path,
//     depend: params.depend,
//     input: params.input,
//     script: params.script,
//     scriptType: params.scriptType
//   })
// }
// 获取全部类型声明文件
export const getTypes = <R>() => {
  return requests.get<any, R>('/hook/types')
}

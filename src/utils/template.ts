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

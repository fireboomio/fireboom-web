export function replaceFileTemplate(
  templateStr: string,
  variables: { variableName: string; value: string }[]
): string {
  let ret = templateStr
  variables.forEach(item => {
    ret = ret
      // 变量替换
      .replace(`$${item.variableName}$`, item.value)
      // 首字母大写
      .replace(`^$${item.variableName}$`, item.value[0].toUpperCase() + item.value.slice(1))
  })
  return ret
}

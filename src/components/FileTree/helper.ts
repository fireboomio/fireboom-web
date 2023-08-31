import type { InnerNode } from './types'

function flatten(node: InnerNode[], level: string) {
  const arr: InnerNode[] = []
  for (const [index, item] of node.entries()) {
    if (item.children?.length) {
      arr.push(...flatten(item.children, `${level}-`))
    } else {
      arr.push({
        ...item,
        pos: level ? `0-${level}-${index}` : `0-${index}`
      })
    }
  }
  return arr
}

export function getTreeItemsBetween(start: string, end: string, treeData: InnerNode[]): string[] {
  // pos 是 0-M[-N] 的格式
  if (start && end && treeData.length) {
    // const startArr = start
    //   .split('-')
    //   .map(i => parseInt(i))
    //   .slice(1)
    // const endArr = end
    //   .split('-')
    //   .map(i => parseInt(i))
    //   .slice(1)

    const nodeArr = flatten(treeData, '')

    const startIndex = nodeArr.findIndex(node => node.pos === start)
    const endIndex = nodeArr.findIndex(node => node.pos === end)
    if (startIndex > endIndex) {
      return nodeArr.slice(endIndex, startIndex).map(item => item.key)
    } else {
      return nodeArr.slice(startIndex, endIndex).map(item => item.key)
    }
  }
  return []
}

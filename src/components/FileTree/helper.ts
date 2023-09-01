import type { InnerNode } from './types'

function flatten(node: InnerNode[], level: string) {
  const arr: InnerNode[] = []
  for (const [index, item] of node.entries()) {
    if (item.children?.length) {
      arr.push(...flatten(item.children, `${level}-${index}`))
    } else {
      arr.push({
        ...item,
        pos: `${level}-${index}`
      })
    }
  }
  return arr
}

export function getTreeItemsBetween(start: string, end: string, treeData: InnerNode[]): string[] {
  // pos 是 0-M[-N] 的格式
  if (start && end && treeData.length) {
    const nodeArr = flatten(treeData, '0')

    const startIndex = nodeArr.findIndex(node => node.pos === start)
    const endIndex = nodeArr.findIndex(node => node.pos === end)
    if (startIndex > -1 && endIndex > -1) {
      if (startIndex > endIndex) {
        return nodeArr.slice(endIndex, startIndex + 1).map(item => item.key)
      } else {
        return nodeArr.slice(startIndex, endIndex + 1).map(item => item.key)
      }
    }
  }
  return []
}

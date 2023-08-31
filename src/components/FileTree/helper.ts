import type { InnerNode } from './types'

function travelNode(node: InnerNode[], map: Record<string, InnerNode>) {
  for (const i of node) {
    if (i.children) {
      travelNode(i.children, map)
    } else if (i.pos) {
      map[i.pos] = i
    }
  }
}

export function getTreeItemsBetween(start: string, end: string, treeData: InnerNode[]): string[] {
  // pos 是 0-M[-N] 的格式
  if (start && end && treeData.length) {
    const startArr = start
      .split('-')
      .map(i => parseInt(i))
      .slice(1)
    const endArr = end
      .split('-')
      .map(i => parseInt(i))
      .slice(1)

    const nodeMap: Record<string, InnerNode> = {}
    travelNode(treeData, nodeMap)
  }
  return []
}

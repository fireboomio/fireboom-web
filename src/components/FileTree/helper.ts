import type { InnerNode } from './types'

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
    // for (let i = 0; i < startArr)
  }
  return []
}

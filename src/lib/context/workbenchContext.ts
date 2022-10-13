import { createContext } from 'react'

export type RefreshMap = {
  api: boolean
  dataSource: boolean
  auth: boolean
  storage: boolean
}
export type MenuName = keyof RefreshMap

interface WorkbenchContextType {
  refreshMap: RefreshMap // 各目录刷新标记
  onRefreshMenu: (list: MenuName) => void // 触发制定目录刷新
  editFlag: boolean // 当前页面是否有未保存的内容
  markEdit: (flag: boolean) => void // 编辑标记
  navCheck: () => Promise<boolean> // 跳转前检查是否有编辑内容，如果有则提示
  setFullscreen: (flag: boolean) => void // 设置全屏模式
  isFullscreen: boolean // 当前是否全屏模式
}

/**
 *  @example
 *  触发目录刷新方式
 *  const { onRefreshMenu } = useContext(WorkbenchContext)
 *  onRefreshMenu('api')
 *
 *  @example
 *  标记有更新内容
 *  const { markEdit } = useContext(WorkbenchContext)
 *  markEdit(true)
 *
 */
export const WorkbenchContext = createContext<WorkbenchContextType>({} as WorkbenchContextType)

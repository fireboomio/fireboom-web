import { createContext } from 'react'

export type RefreshMap = {
  api: boolean
  dataSource: boolean
  auth: boolean
  storage: boolean
}
export type MenuName = keyof RefreshMap

export type TitleChangeEvent = {
  event: 'titleChange'
  title: string
}
export type CompileFinishEvent = {
  event: 'compileFinish'
}

export type WorkbenchEvent = TitleChangeEvent | CompileFinishEvent

export type WorkbenchListener = (event: WorkbenchEvent) => void

export interface WorkbenchContextType {
  triggerPageEvent: (event: WorkbenchEvent) => void // 触发事件
  registerPageListener: (fun: WorkbenchListener) => void // 内容页注册监听函数
  refreshMap: RefreshMap // 各目录刷新标记
  onRefreshMenu: (list: MenuName) => void // 触发制定目录刷新
  onRefreshState: () => void // 刷新服务器状态
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

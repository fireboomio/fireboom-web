export type ShowType = 'form' | 'detail' | 'setting' | 'db-select'

export type CommonPanelAction = CommonPanelSingleAction | CommonPanelListAction

interface CommonPanelSingleAction {
  type: 'selected' | 'added' | 'deleted' | 'changed'
  data: CommonPanelResp
}

interface CommonPanelListAction {
  type: 'fetched'
  data: CommonPanelResp[]
}

export interface CommonPanelResp {
  id: number
  name: string
  icon: string
  svg?: string
  tip: string
  openInNewPage?: string // 如果配置了此项则用该地址在新页面中打开
  disableMenu?: boolean // 禁用上下文菜单
  enabled: boolean
  _row: { name: string }
}

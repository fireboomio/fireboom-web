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
  tip: string
  switch: number
  _row: { name:string }
}

import type { CommonPanelResp, CommonPanelAction } from '@/interfaces/commonPanel'

export default function commonPanelReducer(commonPanel: CommonPanelResp[], action: CommonPanelAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return commonPanel
    }
    case 'added': {
      return [...commonPanel, action.data]
    }
    case 'changed':
      return commonPanel.map(b => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return commonPanel.filter(b => b.id !== action.data.id)
    }
    default:
      return commonPanel
  }
}

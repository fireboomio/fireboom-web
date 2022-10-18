import type { ConnectorAction, ConnectorState } from '@/interfaces/connector'

export default function connectorReducer(
  data: ConnectorState | object = {},
  action: ConnectorAction
) {
  switch (action.type) {
    case 'setCurrentConnector': {
      return {
        ...data,
        currentConnector: action.payload
      }
    }
    case 'fetchConnector': {
      return {
        ...data,
        connectors: action.payload
      }
    }

    default:
      return data
  }
}

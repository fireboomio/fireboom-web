import type { Action } from '@/interfaces/common'

export interface Connector {
  id: string
  enabled: boolean
  config: string
  createdAt: string
  target: string
  types: string
  platform: string
  name: string
  logo: string
  logoDark: string
  description: string
  configTemplate: string
}

export interface ConnectorState {
  currentConnector: Connector
  connectors: Connector[]
}

export type SetCurrentConnectorAction = Action<Connector>
export type FetchConnectorAction = Action<Array<Connector>>

export type ConnectorAction = SetCurrentConnectorAction | FetchConnectorAction

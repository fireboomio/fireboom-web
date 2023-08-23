import { VariableKind } from '@/interfaces/common'
import type { ApiDocuments } from '@/services/a2s.namespace'

export const defaultAuth: ApiDocuments.Authentication = {
  name: '',
  createTime: '',
  updateTime: '',
  deleteTime: '',
  enabled: false,
  issuer: {
    kind: VariableKind.Static,
    staticVariableContent: ''
  },
  jwksProviderEnabled: false,
  jwksProvider: {
    jwksJson: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    },
    jwksUrl: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    },
    userInfoCacheTtlSeconds: 0,
    userInfoEndpoint: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    }
  },
  oidcConfigEnabled: false,
  oidcConfig: {
    clientId: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    },
    clientSecret: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    },
    issuer: {
      kind: VariableKind.Static,
      staticVariableContent: ''
    },
    queryParameters: []
  }
}

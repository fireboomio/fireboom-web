/* eslint-disable */
import { requestAdapter } from './a2s.adapter'
import type { ApiDocuments } from './a2s.namespace'
import { extract, replacePath } from './a2s.utils'

export const services = {
  'authentication@/authentication'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Authentication[]>({
      url: replacePath('/authentication', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'authentication@post@/authentication'(args: ApiDocuments.Authentication) {
    return requestAdapter<any>({
      url: replacePath('/authentication', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'authentication@put@/authentication'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Authentication
  ) {
    return requestAdapter<any>({
      url: replacePath('/authentication', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'authentication@/authentication/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/authentication/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'authentication@post@/authentication/batch'(args: ApiDocuments.AuthenticationArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/authentication/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'authentication@put@/authentication/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.AuthenticationArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/authentication/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'authentication@/authentication/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/authentication/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'authentication@/authentication/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/authentication/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'authentication@/authentication/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/authentication/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'authentication@/authentication/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/authentication/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'authentication@/authentication/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/authentication/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'authentication@/authentication/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/authentication/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'authentication@/authentication/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/authentication/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'authentication@/authentication/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Authentication>({
      url: replacePath('/authentication/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'authentication@/authentication/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/authentication/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'authentication@get@/authentication/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Authentication>({
      url: replacePath('/authentication/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'datasource@/datasource'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Datasource[]>({
      url: replacePath('/datasource', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'datasource@post@/datasource'(args: ApiDocuments.Datasource) {
    return requestAdapter<any>({
      url: replacePath('/datasource', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@put@/datasource'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Datasource
  ) {
    return requestAdapter<any>({
      url: replacePath('/datasource', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'datasource@/datasource/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/datasource/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'datasource@post@/datasource/batch'(args: ApiDocuments.DatasourceArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/datasource/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@put@/datasource/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.DatasourceArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/datasource/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'datasource@/datasource/checkConnection'(args: ApiDocuments.Datasource) {
    return requestAdapter<any>({
      url: replacePath('/datasource/checkConnection', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@/datasource/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/datasource/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@/datasource/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/datasource/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'datasource@/datasource/dmmf/{dataName}'(
    args: {
      /**
       * @description model名称
       */
      dataName: string
    } & {
      /**
       * @description 重载dmmf
       */
      reload?: boolean
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/datasource/dmmf/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, ['reload'], ['dataName'])
    })
  },
  'datasource@/datasource/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/datasource/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'datasource@/datasource/graphql/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<string>({
      url: replacePath('/datasource/graphql/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'datasource@/datasource/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/datasource/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'datasource@/datasource/migrate/{dataName}'(
    args: {
      /**
       * @description model名称
       */
      dataName: string
    } & string
  ) {
    return requestAdapter<string>({
      url: replacePath('/datasource/migrate/{dataName}', args),
      method: 'POST',
      ...extract('POST', args, [], ['dataName'])
    })
  },
  'datasource@/datasource/prisma/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<string>({
      url: replacePath('/datasource/prisma/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'datasource@/datasource/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/datasource/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@/datasource/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/datasource/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'datasource@/datasource/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/datasource/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'datasource@/datasource/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Datasource>({
      url: replacePath('/datasource/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'datasource@/datasource/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/datasource/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'datasource@get@/datasource/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Datasource>({
      url: replacePath('/datasource/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'engine@/engine/restart'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/engine/restart', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'engine@/engine/swagger'(args?: any) {
    return requestAdapter<File>({
      url: replacePath('/engine/swagger', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'env@/env'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Env
  ) {
    return requestAdapter<any>({
      url: replacePath('/env', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'env@/env/single'(args?: any) {
    return requestAdapter<ApiDocuments.Env>({
      url: replacePath('/env/single', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'env@/env/withLockUser'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Env>({
      url: replacePath('/env/withLockUser', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalOperation@/globalOperation'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.GlobalOperation
  ) {
    return requestAdapter<any>({
      url: replacePath('/globalOperation', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'globalOperation@/globalOperation/authenticationHookOptions'(args?: any) {
    return requestAdapter<ApiDocuments.models_HookOptions>({
      url: replacePath('/globalOperation/authenticationHookOptions', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalOperation@/globalOperation/httpTransportHookOptions'(args?: any) {
    return requestAdapter<ApiDocuments.models_HookOptions>({
      url: replacePath('/globalOperation/httpTransportHookOptions', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalOperation@/globalOperation/single'(args?: any) {
    return requestAdapter<ApiDocuments.GlobalOperation>({
      url: replacePath('/globalOperation/single', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalOperation@/globalOperation/withLockUser'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_GlobalOperation>({
      url: replacePath('/globalOperation/withLockUser', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalSetting@/globalSetting'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.GlobalSetting
  ) {
    return requestAdapter<any>({
      url: replacePath('/globalSetting', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'globalSetting@/globalSetting/single'(args?: any) {
    return requestAdapter<ApiDocuments.GlobalSetting>({
      url: replacePath('/globalSetting/single', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'globalSetting@/globalSetting/withLockUser'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_GlobalSetting>({
      url: replacePath('/globalSetting/withLockUser', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'home@/home'(args?: any) {
    return requestAdapter<ApiDocuments.handler_homeStatistics>({
      url: replacePath('/home', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'operation@/operation'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Operation[]>({
      url: replacePath('/operation', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'operation@post@/operation'(args: ApiDocuments.Operation) {
    return requestAdapter<any>({
      url: replacePath('/operation', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'operation@put@/operation'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Operation
  ) {
    return requestAdapter<any>({
      url: replacePath('/operation', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'operation@/operation/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/operation/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'operation@post@/operation/batch'(args: ApiDocuments.OperationArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/operation/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'operation@put@/operation/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.OperationArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/operation/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'operation@/operation/bindRoles'(args: ApiDocuments.handler_paramBindRole) {
    return requestAdapter<string[]>({
      url: replacePath('/operation/bindRoles', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'operation@/operation/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/operation/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'operation@/operation/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/operation/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'operation@/operation/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/operation/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'operation@/operation/graphql/{dataName}'(args: {
    /**
     * @description dataName
     */
    dataName: string
  }) {
    return requestAdapter<string>({
      url: replacePath('/operation/graphql/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'operation@post@/operation/graphql/{dataName}'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & string
  ) {
    return requestAdapter<any>({
      url: replacePath('/operation/graphql/{dataName}', args),
      method: 'POST',
      ...extract('POST', args, [], ['dataName'])
    })
  },
  'operation@/operation/hookOptions/{dataName}'(args: {
    /**
     * @description dataName
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.models_HookOptions>({
      url: replacePath('/operation/hookOptions/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'operation@/operation/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/operation/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'operation@/operation/listByRole'(args: ApiDocuments.handler_paramQueryRole) {
    return requestAdapter<ApiDocuments.Operation[]>({
      url: replacePath('/operation/listByRole', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'operation@/operation/listPublic'(args: {
    /**
     * @description dataName
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Operation[]>({
      url: replacePath('/operation/listPublic', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'operation@/operation/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/operation/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'operation@/operation/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/operation/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'operation@/operation/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/operation/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'operation@/operation/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Operation>({
      url: replacePath('/operation/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'operation@/operation/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/operation/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'operation@get@/operation/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Operation>({
      url: replacePath('/operation/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'role@/role'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Role[]>({
      url: replacePath('/role', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'role@post@/role'(args: ApiDocuments.Role) {
    return requestAdapter<any>({
      url: replacePath('/role', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'role@put@/role'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Role
  ) {
    return requestAdapter<any>({
      url: replacePath('/role', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'role@/role/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/role/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'role@post@/role/batch'(args: ApiDocuments.RoleArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/role/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'role@put@/role/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.RoleArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/role/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'role@/role/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/role/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'role@/role/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/role/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'role@/role/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/role/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'role@/role/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/role/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'role@/role/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/role/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'role@/role/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/role/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'role@/role/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/role/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'role@/role/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Role>({
      url: replacePath('/role/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'role@/role/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/role/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'role@get@/role/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Role>({
      url: replacePath('/role/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'sdk@/sdk'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Sdk[]>({
      url: replacePath('/sdk', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'sdk@post@/sdk'(args: ApiDocuments.Sdk) {
    return requestAdapter<any>({
      url: replacePath('/sdk', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'sdk@put@/sdk'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Sdk
  ) {
    return requestAdapter<any>({
      url: replacePath('/sdk', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'sdk@/sdk/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/sdk/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'sdk@post@/sdk/batch'(args: ApiDocuments.SdkArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/sdk/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'sdk@put@/sdk/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.SdkArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/sdk/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'sdk@/sdk/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/sdk/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'sdk@/sdk/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/sdk/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'sdk@/sdk/enabledServer'(args?: any) {
    return requestAdapter<ApiDocuments.models_Sdk>({
      url: replacePath('/sdk/enabledServer', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'sdk@/sdk/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/sdk/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'sdk@/sdk/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/sdk/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'sdk@/sdk/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/sdk/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'sdk@/sdk/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/sdk/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'sdk@/sdk/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/sdk/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'sdk@/sdk/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Sdk>({
      url: replacePath('/sdk/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'sdk@/sdk/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/sdk/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'sdk@get@/sdk/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Sdk>({
      url: replacePath('/sdk/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'storage@/storage'(args: {
    /**
     * @description model名称
     */
    dataNames?: string[]
  }) {
    return requestAdapter<ApiDocuments.Storage[]>({
      url: replacePath('/storage', args),
      method: 'GET',
      ...extract('GET', args, ['dataNames'], [])
    })
  },
  'storage@post@/storage'(args: ApiDocuments.Storage) {
    return requestAdapter<any>({
      url: replacePath('/storage', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@put@/storage'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.Storage
  ) {
    return requestAdapter<any>({
      url: replacePath('/storage', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'storage@/storage/batch'(args: {
    /**
     * @description 数据名称
     */
    dataNames: string[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/storage/batch', args),
      method: 'DELETE',
      ...extract('DELETE', args, ['dataNames'], [])
    })
  },
  'storage@post@/storage/batch'(args: ApiDocuments.StorageArray) {
    return requestAdapter<ApiDocuments.fileloader_DataBatchResult[]>({
      url: replacePath('/storage/batch', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@put@/storage/batch'(
    args: {
      /**
       * @description 操作名称[监听子属性使用]
       */
      watchAction?: string
    } & ApiDocuments.StorageArray
  ) {
    return requestAdapter<any>({
      url: replacePath('/storage/batch', args),
      method: 'PUT',
      ...extract('PUT', args, ['watchAction'], [])
    })
  },
  'storage@/storage/copy'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/storage/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@/storage/deleteParent/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/storage/deleteParent/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'storage@/storage/export'(args: {
    /**
     * @description dataNames
     */
    dataNames?: string[]
  }) {
    return requestAdapter<File>({
      url: replacePath('/storage/export', args),
      method: 'POST',
      ...extract('POST', args, ['dataNames'], [])
    })
  },
  'storage@/storage/hookOptions/{dataName}'(args: {
    /**
     * @description dataName
     */
    dataName: string
  }) {
    return requestAdapter<{}>({
      url: replacePath('/storage/hookOptions/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'storage@/storage/import'(args: {
    /**
     * @description 文件
     */
    file: number[]
  }) {
    return requestAdapter<any>({
      url: replacePath('/storage/import', args),
      method: 'POST',
      ...extract('POST', args, ['file'], [])
    })
  },
  'storage@/storage/rename'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/storage/rename', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@/storage/renameParent'(args: ApiDocuments.fileloader_DataMutation) {
    return requestAdapter<any>({
      url: replacePath('/storage/renameParent', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@/storage/tree'(args?: any) {
    return requestAdapter<ApiDocuments.fileloader_DataTree[]>({
      url: replacePath('/storage/tree', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'storage@/storage/withLockUser/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.fileloader_DataWithLockUser_Storage>({
      url: replacePath('/storage/withLockUser/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'storage@/storage/{dataName}'(args: {
    /**
     * @description 数据名称
     */
    dataName: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/storage/{dataName}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['dataName'])
    })
  },
  'storage@get@/storage/{dataName}'(args: {
    /**
     * @description model名称
     */
    dataName: string
  }) {
    return requestAdapter<ApiDocuments.Storage>({
      url: replacePath('/storage/{dataName}', args),
      method: 'GET',
      ...extract('GET', args, [], ['dataName'])
    })
  },
  'storage@/storageClient/ping'(args: ApiDocuments.models_Storage) {
    return requestAdapter<any>({
      url: replacePath('/storageClient/ping', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'storage@/storageClient/{dataName}/detail'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description filename
       */
      filename: string
    }
  ) {
    return requestAdapter<ApiDocuments.models_StorageFile>({
      url: replacePath('/storageClient/{dataName}/detail', args),
      method: 'GET',
      ...extract('GET', args, ['filename'], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/download'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description filename
       */
      filename: string
    }
  ) {
    return requestAdapter<ApiDocuments.models_StorageFile[]>({
      url: replacePath('/storageClient/{dataName}/download', args),
      method: 'GET',
      ...extract('GET', args, ['filename'], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/list'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description dirname
       */
      dirname: string
    }
  ) {
    return requestAdapter<ApiDocuments.models_StorageFile[]>({
      url: replacePath('/storageClient/{dataName}/list', args),
      method: 'GET',
      ...extract('GET', args, ['dirname'], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/mkdir'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description dirname
       */
      dirname: string
    }
  ) {
    return requestAdapter<any>({
      url: replacePath('/storageClient/{dataName}/mkdir', args),
      method: 'POST',
      ...extract('POST', args, ['dirname'], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/remove'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description filename
       */
      filename: string
    }
  ) {
    return requestAdapter<any>({
      url: replacePath('/storageClient/{dataName}/remove', args),
      method: 'POST',
      ...extract('POST', args, ['filename'], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/rename'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & ApiDocuments.fileloader_DataMutation
  ) {
    return requestAdapter<any>({
      url: replacePath('/storageClient/{dataName}/rename', args),
      method: 'POST',
      ...extract('POST', args, [], ['dataName'])
    })
  },
  'storage@/storageClient/{dataName}/upload'(
    args: {
      /**
       * @description dataName
       */
      dataName: string
    } & {
      /**
       * @description dirname
       */
      dirname: string
    }
  ) {
    return requestAdapter<any>({
      url: replacePath('/storageClient/{dataName}/upload', args),
      method: 'POST',
      ...extract('POST', args, ['dirname'], ['dataName'])
    })
  },
  'system@/system/directories'(args?: any) {
    return requestAdapter<{}>({
      url: replacePath('/system/directories', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'system@/system/proxy'(args: {
    /**
     * @description 请求url
     */
    url: string
  }) {
    return requestAdapter<{}>({
      url: replacePath('/system/proxy', args),
      method: 'GET',
      ...extract('GET', args, ['url'], [])
    })
  },
  'vscode@/vscode/copy'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/vscode/copy', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'vscode@/vscode/createDirectory'(args: ApiDocuments.postVscodeCreatedirectory) {
    return requestAdapter<any>({
      url: replacePath('/vscode/createDirectory', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'vscode@/vscode/delete'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/vscode/delete', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], [])
    })
  },
  'vscode@/vscode/readDirectory'(args?: any) {
    return requestAdapter<ApiDocuments.vscode_FileStat[]>({
      url: replacePath('/vscode/readDirectory', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'vscode@/vscode/readFile'(args: ApiDocuments.postVscodeCreatedirectory) {
    return requestAdapter<string>({
      url: replacePath('/vscode/readFile', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'vscode@/vscode/rename'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/vscode/rename', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'vscode@/vscode/stat'(args: ApiDocuments.postVscodeCreatedirectory) {
    return requestAdapter<ApiDocuments.vscode_FileStat>({
      url: replacePath('/vscode/stat', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'vscode@/vscode/writeFile'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/vscode/writeFile', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  }
}

export type ServiceKeys = keyof typeof services

export type ServiceArg<T extends ServiceKeys> = Parameters<(typeof services)[T]>[0]

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

export type ServiceReturn<T extends ServiceKeys> = Awaited<ReturnType<(typeof services)[T]>>['data']

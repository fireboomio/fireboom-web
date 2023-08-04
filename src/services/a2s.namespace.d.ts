/* eslint-disable */
interface BasicDto {
  [key: string]: any
}
export declare namespace ApiDocuments {
  export interface ApiAuthenticationHooks extends BasicDto {
    mutatingPostAuthentication: boolean
    postAuthentication: boolean
    postLogout: boolean
    revalidateAuthentication: boolean
    tsPathMap?: {}
  }
  export interface Appearance extends BasicDto {
    language: string
  }
  export interface Authentication extends BasicDto {
    createTime: string
    deleteTime: string
    enabled: boolean
    jwksProvider: ApiDocuments.JwksAuthProvider
    name: string
    oidcConfig: ApiDocuments.OpenIDConnectAuthProviderConfig
    updateTime: string
  }
  export interface BuildInfo extends BasicDto {
    BuiltBy: string
    Commit: string
    Date: string
    Version: string
  }
  export interface ClaimConfig extends BasicDto {
    claimType: string | number
    custom: ApiDocuments.CustomClaim
    variablePathComponents: string[]
  }
  export interface ConfigurationVariable extends BasicDto {
    environmentVariableDefaultValue?: string
    environmentVariableName?: string
    kind: string | number
    placeholderVariableName?: string
    staticVariableContent?: string
  }
  export interface CorsConfiguration extends BasicDto {
    allowCredentials: boolean
    allowedHeaders: string[]
    allowedMethods: string[]
    allowedOrigins: ApiDocuments.ConfigurationVariable[]
    exposedHeaders: string[]
    maxAge: number
  }
  export interface CustomClaim extends BasicDto {
    jsonPathComponents: string[]
    name: string
    required: boolean
    type: string | number
  }
  export interface CustomDatabase extends BasicDto {
    databaseAlone: ApiDocuments.CustomDatabaseAlone
    databaseUrl: ApiDocuments.ConfigurationVariable
    kind: number
  }
  export interface CustomDatabaseAlone extends BasicDto {
    database: string
    host: string
    password: string
    port: number
    username: string
  }
  export interface CustomGraphql extends BasicDto {
    customized: boolean
    headers: {}
    schemaString: string
    url: string
  }
  export interface CustomRest extends BasicDto {
    baseUrl: string
    headers: {}
    oasFilepath: string
  }
  export interface Datasource extends BasicDto {
    createTime: string
    customDatabase: ApiDocuments.CustomDatabase
    customGraphql: ApiDocuments.CustomGraphql
    customRest: ApiDocuments.CustomRest
    deleteTime: string
    enabled: boolean
    kind: string | number
    name: string
    updateTime: string
  }
  export interface Env extends BasicDto {}
  export interface GlobalHooks extends BasicDto {
    WsTransport: ApiDocuments.GlobalWsTransportHook
    httpTransport: {}
  }
  export interface GlobalHttpTransportHook extends BasicDto {
    enableForAllOperations: boolean
    enableForOperations: string[]
  }
  export interface GlobalOperation extends BasicDto {
    apiAuthenticationHooks: ApiDocuments.ApiAuthenticationHooks
    authenticationConfig: ApiDocuments.OperationAuthenticationConfig
    cacheConfig: ApiDocuments.OperationCacheConfig
    globalHooks: ApiDocuments.GlobalHooks
    liveQueryConfig: ApiDocuments.OperationLiveQueryConfig
  }
  export interface GlobalSetting extends BasicDto {
    allowedHostNames: ApiDocuments.ConfigurationVariable[]
    appearance: ApiDocuments.Appearance
    authenticationKey: string
    authorizedRedirectUris: ApiDocuments.ConfigurationVariable[]
    buildInfo: ApiDocuments.BuildInfo
    consoleLogger: ApiDocuments.lumberjackLogger
    corsConfiguration: ApiDocuments.CorsConfiguration
    enableCSRFProtect: boolean
    enableGraphqlEndpoint: boolean
    forceHttpsRedirects: boolean
    globalRateLimit?: {
      enabled: boolean
      perDuration: number
      requests: number
    }
    nodeOptions: ApiDocuments.NodeOptions
    serverOptions: ApiDocuments.ServerOptions
  }
  export interface GlobalWsTransportHook extends BasicDto {
    enableForDataSources: string[]
  }
  export interface HTTPHeader extends BasicDto {
    values: ApiDocuments.ConfigurationVariable[]
  }
  export interface JwksAuthProvider extends BasicDto {
    jwksJson: ApiDocuments.ConfigurationVariable
    jwksUrl: ApiDocuments.ConfigurationVariable
    userInfoCacheTtlSeconds: number
    userInfoEndpoint: ApiDocuments.ConfigurationVariable
  }
  export interface ListenerOptions extends BasicDto {
    host: ApiDocuments.ConfigurationVariable
    port: ApiDocuments.ConfigurationVariable
  }
  export interface MockResolveHookConfiguration extends BasicDto {
    enabled: boolean
    subscriptionPollingIntervalMillis: number
  }
  export interface NodeLogging extends BasicDto {
    level: ApiDocuments.ConfigurationVariable
  }
  export interface NodeOptions extends BasicDto {
    defaultRequestTimeoutSeconds: number
    listen: ApiDocuments.ListenerOptions
    logger: ApiDocuments.NodeLogging
    nodeUrl: ApiDocuments.ConfigurationVariable
    publicNodeUrl: ApiDocuments.ConfigurationVariable
  }
  export interface OpenIDConnectAuthProviderConfig extends BasicDto {
    clientId: ApiDocuments.ConfigurationVariable
    clientSecret: ApiDocuments.ConfigurationVariable
    issuer: ApiDocuments.ConfigurationVariable
    queryParameters: ApiDocuments.OpenIDConnectQueryParameter[]
  }
  export interface OpenIDConnectQueryParameter extends BasicDto {
    name: ApiDocuments.ConfigurationVariable
    value: ApiDocuments.ConfigurationVariable
  }
  export interface Operation extends BasicDto {
    authenticationConfig: ApiDocuments.OperationAuthenticationConfig
    authorizationConfig: ApiDocuments.OperationAuthorizationConfig
    cacheConfig: ApiDocuments.OperationCacheConfig
    createTime: string
    deleteTime: string
    enabled: boolean
    hooksConfiguration: ApiDocuments.OperationHooksConfiguration
    internal: boolean
    liveQueryConfig: ApiDocuments.OperationLiveQueryConfig
    operationType: string | number
    path: string
    remark: string
    title: string
    updateTime: string
  }
  export interface OperationAuthenticationConfig extends BasicDto {
    authRequired: boolean
  }
  export interface OperationAuthorizationConfig extends BasicDto {
    claims: ApiDocuments.ClaimConfig[]
    roleConfig: ApiDocuments.OperationRoleConfig
  }
  export interface OperationCacheConfig extends BasicDto {
    enabled: boolean
    maxAge: number
    public: boolean
    staleWhileRevalidate: number
  }
  export interface OperationHooksConfiguration extends BasicDto {
    customResolve: boolean
    httpTransportBeforeRequest: boolean
    httpTransportOnRequest: boolean
    httpTransportOnResponse: boolean
    mockResolve: ApiDocuments.MockResolveHookConfiguration
    mutatingPostResolve: boolean
    mutatingPreResolve: boolean
    onConnectionInit: boolean
    postResolve: boolean
    preResolve: boolean
    tsPathMap?: {}
  }
  export interface OperationLiveQueryConfig extends BasicDto {
    enabled: boolean
    pollingIntervalSeconds: number
  }
  export interface OperationRoleConfig extends BasicDto {
    denyMatchAll: string[]
    denyMatchAny: string[]
    requireMatchAll: string[]
    requireMatchAny: string[]
  }
  export interface Role extends BasicDto {
    code: string
    createTime: string
    deleteTime: string
    remark: string
    updateTime: string
  }
  export interface S3UploadProfile extends BasicDto {
    allowedFileExtensions: string[]
    allowedMimeTypes: string[]
    hooks: ApiDocuments.S3UploadProfileHooksConfiguration
    maxAllowedFiles: number
    maxAllowedUploadSizeBytes: number
    metadataJSONSchema: string
    requireAuthentication: boolean
  }
  export interface S3UploadProfileHooksConfiguration extends BasicDto {
    postUpload: boolean
    preUpload: boolean
  }
  export interface Sdk extends BasicDto {
    author: string
    createTime: string
    deleteTime: string
    description: string
    enabled: boolean
    extension: string
    gitUrl: string
    icon: string
    language: string
    name: string
    outputPath: string
    title: string
    type: string
    updateTime: string
    version: string
  }
  export interface ServerLogging extends BasicDto {
    level: ApiDocuments.ConfigurationVariable
  }
  export interface ServerOptions extends BasicDto {
    listen: ApiDocuments.ListenerOptions
    logger: ApiDocuments.ServerLogging
    serverUrl: ApiDocuments.ConfigurationVariable
  }
  export interface Storage extends BasicDto {
    accessKeyID: ApiDocuments.ConfigurationVariable
    bucketLocation: ApiDocuments.ConfigurationVariable
    bucketName: ApiDocuments.ConfigurationVariable
    createTime: string
    deleteTime: string
    enabled: boolean
    endpoint: ApiDocuments.ConfigurationVariable
    name: string
    secretAccessKey: ApiDocuments.ConfigurationVariable
    updateTime: string
    uploadProfiles: {}
    useSSL: boolean
  }
  export interface consts_MiddlewareHook extends BasicDto {}
  export interface fileloader_DataBatchResult extends BasicDto {
    dataName?: string
    succeed?: boolean
  }
  export interface fileloader_DataMutation extends BasicDto {
    dst?: string
    overload?: boolean
    src?: string
  }
  export interface fileloader_DataTree extends BasicDto {
    dataName?: any
    extension?: string
    extra?: any
    isDir?: boolean
    items?: ApiDocuments.fileloader_DataTree[]
    name?: string
  }
  export interface fileloader_DataWithLockUser_Authentication extends BasicDto {
    data?: ApiDocuments.Authentication
    user?: string
  }
  export interface fileloader_DataWithLockUser_Datasource extends BasicDto {
    data?: ApiDocuments.Datasource
    user?: string
  }
  export interface fileloader_DataWithLockUser_Env extends BasicDto {
    data?: ApiDocuments.Env
    user?: string
  }
  export interface fileloader_DataWithLockUser_GlobalOperation extends BasicDto {
    data?: ApiDocuments.GlobalOperation
    user?: string
  }
  export interface fileloader_DataWithLockUser_GlobalSetting extends BasicDto {
    data?: ApiDocuments.GlobalSetting
    user?: string
  }
  export interface fileloader_DataWithLockUser_Operation extends BasicDto {
    data?: ApiDocuments.Operation
    user?: string
  }
  export interface fileloader_DataWithLockUser_Role extends BasicDto {
    data?: ApiDocuments.Role
    user?: string
  }
  export interface fileloader_DataWithLockUser_Sdk extends BasicDto {
    data?: ApiDocuments.Sdk
    user?: string
  }
  export interface fileloader_DataWithLockUser_Storage extends BasicDto {
    data?: ApiDocuments.Storage
    user?: string
  }
  export interface fileloader_DataWithLockUser_data extends BasicDto {
    data?: any
    user?: string
  }
  export interface handler_authenticationStatistics extends BasicDto {
    authenticationTotal?: number
    userTodayAdd?: number
    userTotal?: number
  }
  export interface handler_datasourceStatistics extends BasicDto {
    customizeTotal?: number
    databaseTotal?: number
    graphqlTotal?: number
    restTotal?: number
  }
  export interface handler_homeStatistics extends BasicDto {
    authentication?: ApiDocuments.handler_authenticationStatistics
    dataSource?: ApiDocuments.handler_datasourceStatistics
    operation?: ApiDocuments.handler_operationStatistics
    storage?: ApiDocuments.handler_storageStatistics
  }
  export interface handler_hooksData extends BasicDto {
    globalHooks?: ApiDocuments.models_OperationHookEnabled[]
    operationHooks?: ApiDocuments.models_OperationHookEnabled[]
  }
  export interface handler_operationStatistics extends BasicDto {
    liveQueryTotal?: number
    mutationTotal?: number
    queryTotal?: number
    subscriptionTotal?: number
  }
  export interface handler_paramBindRole extends BasicDto {
    operationPaths?: string[]
    rbacType?: string
    roleCodes?: string[]
  }
  export interface handler_paramQueryRole extends BasicDto {
    rbacType?: string
    roleCode?: string
  }
  export interface handler_storageStatistics extends BasicDto {
    memoryTotal?: number
    memoryUsed?: number
    storageTotal?: number
  }
  export interface i18n_CustomError extends BasicDto {
    /**
     * @description 错误根因
     */
    cause?: string
    /**
     * @description 错误码
     */
    code?: ApiDocuments.i18n_Errcode
    /**
     * @description 错误消息
     */
    message?: string
    /**
     * @description 业务模块
     */
    mode?: string
  }
  export interface i18n_Errcode extends BasicDto {}
  export interface lumberjackLogger extends BasicDto {
    compress: boolean
    filename: string
    localtime: boolean
    maxage: number
    maxbackups: number
    maxsize: number
  }
  export interface models_OperationHookEnabled extends BasicDto {
    enabled?: boolean
    name?: ApiDocuments.consts_MiddlewareHook
  }
  export interface models_Sdk extends BasicDto {
    author?: string
    createTime?: string
    deleteTime?: string
    description?: string
    enabled?: boolean
    extension?: string
    gitUrl?: string
    icon?: string
    language?: string
    name?: string
    outputPath?: string
    title?: string
    type?: ApiDocuments.models_sdkType
    updateTime?: string
    version?: string
  }
  export interface models_Storage extends BasicDto {}
  export interface models_StorageFile extends BasicDto {
    /**
     * @description A standard MIME type describing the format of the object data.
     */
    contentType?: string
    extension?: string
    /**
     * @description Date and time the object was last modified.
     */
    lastModified?: string
    /**
     * @description Name of the object
     */
    name?: string
    signedUrl?: string
    /**
     * @description Size in bytes of the object.
     */
    size?: number
  }
  export interface models_sdkType extends BasicDto {}
  export interface vscode_FileStat extends BasicDto {
    ctime?: number
    mtime?: number
    name?: string
    size?: number
    type?: ApiDocuments.vscode_FileType
  }
  export interface vscode_FileType extends BasicDto {}
}

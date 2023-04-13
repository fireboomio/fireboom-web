export type GlobalSetting = {
  forceHttpsRedirects: boolean
  authorizedRedirectUris: string[]
  configureWunderGraphApplication: {
    security: {
      allowedHosts: string[]
      allowedHostsEnabled: boolean
      enableCSRF: boolean
      enableGraphQLEndpoint: boolean
    }
    cors: {
      allowCredentials: boolean
      allowedHeaders: string[]
      allowedHeadersEnabled: boolean
      allowedMethods: string[]
      allowedOrigins: string[]
      allowedOriginsEnabled: boolean
      exposedHeaders: string[]
      exposedHeadersEnabled: boolean
      maxAge: number
    }
  }
}

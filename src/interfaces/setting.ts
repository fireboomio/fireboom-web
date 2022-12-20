export interface SettingType {
  name: string
  type: string
  // type: 'colorTheme' | 'system' | 'secure' | 'cors' | 'API Token' | 'path' | 'version'
  icon?: React.ReactNode
}

export interface VersionConfig {
  versionNum: string
  prismaVersion: string
  prismaEngineVersion: string
  copyright: string
}

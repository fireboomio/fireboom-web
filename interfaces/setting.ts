export interface SettingType {
  name: string
  type: 'colorTheme' | 'system' | 'secure' | 'cors' | 'API Token' | 'path' | 'version'
  icon?: React.ReactNode
}

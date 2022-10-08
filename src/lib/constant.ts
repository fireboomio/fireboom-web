export const SMS = 'SMS'
export const SOCIAL = 'Social'
export const EMAIL = 'Email'

export const ConnectorTypeEnum: { [keys: string]: string } = {
  [SMS]: '短信连接器',
  [SOCIAL]: '社交连接器',
  [EMAIL]: '邮件连接器',
}

export const ConnectorTitleEnum: { [keys: string]: string } = {
  [SMS]: '设置短信连接器',
  [SOCIAL]: '添加社交连接器',
  [EMAIL]: '设置邮件连接器',
}

export const SMS = 'Sms'
export const SOCIAL = 'Social'
export const EMAIL = 'Email'

export const ConnectorTypeEnum: Record<string, string> = {
  [SMS]: '短信连接器',
  [SOCIAL]: '社交连接器',
  [EMAIL]: '邮件连接器'
}

export const ConnectorTitleEnum: Record<string, string> = {
  [SMS]: '设置短信连接器',
  [SOCIAL]: '添加社交连接器',
  [EMAIL]: '设置邮件连接器'
}

export const HttpRequestHeaders = [
  'Accept',
  'Accept-Charset',
  'Accept-Language',
  'Access_-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Authorization',
  'Cache-Control',
  'Content-MD5',
  'Content-Length',
  'Content-Transfer-Encoding',
  'Content-Type',
  'Cookie',
  'Cookie 2',
  'Date',
  'Expect',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Keep-Alive',
  'Max-Forwards',
  'Origin',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'TE',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'User-Agent',
  'Via',
  'Warning',
  'X-Requested-With',
  'X-Do-Not-Track',
  'DNT',
  'x-api-key',
  'Connection'
]

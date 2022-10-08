export interface LogMessage {
  time: string
  level: 'info' | 'debug' | 'error'
  logType: number
  msg: string
}

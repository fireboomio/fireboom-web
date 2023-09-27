import { DataSourceKind } from '@/interfaces/datasource'

type DBConnectionConfig = {
  schema: string
  username: string
  password?: string
  host: string
  port?: number
  dbName: string
  args?: string
}

export function parseDBUrl(url: string): DBConnectionConfig | undefined {
  // sql server 格式略有不同
  // sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD;encrypt=true
  if (url.startsWith('sqlserver://')) {
    const splited = url.split(';')
    const [host, port] = splited[0].replace(/^sqlserver:\/\//, '').split(':')
    const kvMap = splited.slice(1).reduce<Record<string, any>>((obj, cur) => {
      const [key, value] = cur.split('=')
      obj[key] = value
      return obj
    }, {})
    const { user, password, database, ...rest } = kvMap
    return {
      schema: 'sqlserver',
      host,
      port: +port,
      dbName: database,
      username: user,
      password: password,
      args: Object.keys(rest)
        .map(item => `${item}=${rest[item]}`)
        .join(';')
    }
  }
  const ret = url.match(/^(\w+):\/\/([\w\d-_]+)(:(.+))?@([\w\d.]+)(:(.+))?\/([\w\d-_]+)(\?(.+))?/)
  if (!ret) {
    return undefined
  }
  return {
    schema: ret[1],
    username: decodeURIComponent(ret[2]),
    password: decodeURIComponent(ret[4]),
    host: ret[5],
    port: +ret[7],
    dbName: decodeURIComponent(ret[8]),
    args: decodeURIComponent(ret[10])
  }
}

export function getDBUrl(kind: DataSourceKind, config: DBConnectionConfig): string {
  if (kind === DataSourceKind.SQLServer) {
    // sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD;encrypt=true
    return `sqlserver://${config.host}:${config.port ?? 1443};database=${config.dbName};user=${
      config.username ?? 'sa'
    };password=${config.password};${config.args ?? ''}`
  } else {
    return `${config.schema}://${encodeURIComponent(config.username)}${
      config.password ? `:${encodeURIComponent(config.password)}` : ''
    }@${config.host}:${config.port}/${encodeURIComponent(config.dbName)}${
      config.args ? `?${config.args}` : ''
    }`
  }
}

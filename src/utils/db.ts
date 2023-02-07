type DBConnectionConfig = {
  schema: string
  username: string
  password?: string
  host: string
  port?: string
  dbName: string
  args?: string
}

export function parseDBUrl(url: string): DBConnectionConfig | undefined {
  const ret = url.match(/^(\w+):\/\/([\w\d-_]+)(:(.+))?@([\w\d.]+)(:(.+))?\/([\w\d-_]+)(\?(.+))?/)
  if (!ret) {
    return undefined
  }
  return {
    schema: ret[1],
    username: ret[2],
    password: ret[4],
    host: ret[5],
    port: ret[7],
    dbName: ret[8],
    args: ret[10]
  }
}

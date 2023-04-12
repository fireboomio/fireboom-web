const vscode = require('vscode')

const rootPath = vscode.workspace.workspaceFolders

function trimPath(str) {
  return str.replace(/^\//, '')
}

class VirtualFileSystemProvider {
  _emitter = new vscode.EventEmitter()
  _bufferedEvents = []
  _fireSoonHandle
  onDidChangeFile = this._emitter.event

  constructor() {}

  async readFile(uri) {
    return fetch(`/api/v1/vscode/readFile?uri=${trimPath(uri.path)}`).then(async resp => {
      return new Uint8Array(await resp.arrayBuffer())
    })
  }

  async writeFile(uri, content, options) {
    // 将 ArrayBuffer 转换为 Blob 对象
    const dataBlob = new Blob([content], { type: 'application/octet-stream' })

    // 使用 FormData 对象来传递二进制数据
    const formData = new FormData()
    formData.append('content', dataBlob, 'example.bin')
    formData.append('uri', trimPath(uri.path))
    formData.append('create', options.create)
    formData.append('overwrite', options.overwrite)
    return fetch(`/api/v1/vscode/writeFile`, {
      method: 'post',
      body: formData
    }).then(resp => {
      if (options.create) {
        this._fireSoon({ type: vscode.FileChangeType.Created, uri })
      } else {
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri })
      }
    })
  }

  async delete(uri, options) {
    return fetch(`/api/v1/vscode/delete`, {
      method: 'delete',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        uri: trimPath(uri.path),
        recursive: options.recursive
      })
    }).then(resp => {
      let dirname = uri.with({ path: this._dirname(uri.path) })
      this._fireSoon(
        { type: vscode.FileChangeType.Changed, uri: dirname },
        { uri, type: vscode.FileChangeType.Deleted }
      )
    })
  }

  async rename(oldUri, newUri, options) {
    return fetch(`/api/v1/vscode/rename`, {
      method: 'put',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        oldUri: trimPath(oldUri.path),
        newUri: trimPath(newUri.path),
        overwrite: options.overwrite
      })
    }).then(resp => {
      this._fireSoon(
        { type: vscode.FileChangeType.Deleted, uri: oldUri },
        { type: vscode.FileChangeType.Created, uri: newUri }
      )
    })
  }
  async copy(source, destination, options) {
    return fetch(`/api/v1/vscode/copy`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        source: trimPath(source.path),
        destination: trimPath(destination.path),
        overwrite: options.overwrite
      })
    }).then(resp => {
      this._fireSoon({ type: vscode.FileChangeType.Created, destination })
    })
  }

  async stat(uri) {
    return fetch(`/api/v1/vscode/state?uri=${trimPath(uri.path)}`)
      .then(resp => resp.json())
      .then(resp => {
        return resp
      })
      .catch(resp => {
        throw vscode.FileSystemError.FileNotFound(uri)
      })
  }

  async readDirectory(uri) {
    return fetch(`/api/v1/vscode/readDirectory?uri=${trimPath(uri.path)}`).then(resp => resp.json())
  }

  async createDirectory(uri) {
    // 这里实现创建目录的逻辑
    return fetch(`/api/v1/vscode/createDirectory`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        uri: trimPath(uri.path)
      })
    }).then(resp => {
      let dirname = uri.with({ path: this._dirname(uri.path) })
      this._fireSoon(
        { type: vscode.FileChangeType.Changed, uri: dirname },
        { type: vscode.FileChangeType.Created, uri }
      )
    })
  }

  watch(uri, options) {
    // 这里实现监听文件变化的逻辑
    return new vscode.Disposable(() => {})
  }
  _fireSoon(...events) {
    this._bufferedEvents.push(...events)

    if (this._fireSoonHandle) {
      clearTimeout(this._fireSoonHandle)
    }

    this._fireSoonHandle = setTimeout(() => {
      this._emitter.fire(this._bufferedEvents)
      this._bufferedEvents.length = 0
    }, 5)
  }
  _dirname(path) {
    path = this._rtrim(path, '/')
    if (!path) {
      return '/'
    }

    return path.substr(0, path.lastIndexOf('/'))
  }
  _rtrim(haystack, needle) {
    if (!haystack || !needle) {
      return haystack
    }

    const needleLen = needle.length,
      haystackLen = haystack.length

    if (needleLen === 0 || haystackLen === 0) {
      return haystack
    }

    let offset = haystackLen,
      idx = -1

    while (true) {
      idx = haystack.lastIndexOf(needle, offset - 1)
      if (idx === -1 || idx + needleLen !== offset) {
        break
      }
      if (idx === 0) {
        return ''
      }
      offset = idx
    }
    return haystack.substring(0, offset)
  }
}
function activate(context) {
  const virtualFileSystemProvider = new VirtualFileSystemProvider()
  const scheme = 'fbfs'
  const disposable = vscode.workspace.registerFileSystemProvider(
    scheme,
    virtualFileSystemProvider,
    { isCaseSensitive: true }
  )
  context.subscriptions.push(disposable)
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}

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
    return fetch(`/api/v1/vscode/readFile?uri=${trimPath(uri.path)}`)
      .then(resp => resp.json())
      .then(resp => {
        return new TextEncoder().encode(resp)
      })
  }

  async writeFile(uri, content, options) {
    return fetch(`/api/v1/vscode/writeFile`, {
      method: 'post',
      body: JSON.stringify({
        uri: trimPath(uri.path),
        content: content
      })
    })
      .then(resp => resp.json())
  }

  async delete(uri, options) {
    return fetch(`/api/v1/vscode/delete`, {
      method: 'delete',
      body: JSON.stringify({
        uri: trimPath(uri.path),
        recursive: options.recursive
      })
    })
      .then(resp => resp.json())
  }

  async rename(oldUri, newUri, options) {
    return fetch(`/api/v1/vscode/rename`, {
      method: 'put',
      body: JSON.stringify({
        oldUri: trimPath(oldUri.path),
        newUri: trimPath(newUri.path),
        overwrite: options.overwrite
      })
    })
      .then(resp => resp.json())
  }

  async stat(uri) {
    return fetch(`/api/v1/vscode/state?uri=${trimPath(uri.path)}`)
      .then(resp => resp.json()).then(resp => {
        console.log('stat', resp)
        return resp
      }).catch(resp => {
        throw vscode.FileSystemError.FileNotFound(uri);
      })
  }

  async readDirectory(uri) {
    return fetch(`/api/v1/vscode/readDirectory?uri=${trimPath(uri.path)}`)
      .then(resp => resp.json())
  }

  async createDirectory(uri) {
    console.log('createDirectory', uri)
    // 这里实现创建目录的逻辑
    return fetch(`/api/v1/vscode/createDirectory`, {
      method: 'post',
      body: JSON.stringify({
        uri: trimPath(uri.path)
      })
    })
      .then(resp => resp.json())
  }

  watch(uri, options) {
    console.log('watch', uri, options)
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
}

function activate(context) {
  console.log('-=-------')
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

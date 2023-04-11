const vscode = require('vscode')

const rootPath = vscode.workspace.workspaceFolders

class VirtualFileSystemProvider {
  _emitter = new vscode.EventEmitter()
  _bufferedEvents = []
  _fireSoonHandle
  onDidChangeFile = this._emitter.event

  constructor() {}

  async readFile(uri) {
    return fetch(`/api/v1/vscode/readFile?uri=${uri.path.replace(/^\//, '')}`)
      .then(resp => resp.json())
      .then(resp => {
        const str = atob(resp.result)
        return new TextEncoder().encode(str)
      })
  }

  async writeFile(uri, content, options) {
    console.log('writeFile', uri, content, options)
    fetch(`/api/v1/vscode/writeFile`, {
      method: 'post',
      body: JSON.stringify({
        uri: uri.path,
        content: content
      })
    })
      .then(resp => resp.json())
      .then(console.log)
  }

  async delete(uri, options) {
    console.log('delete', uri)
    fetch(`/api/v1/vscode/delete`, {
      method: 'delete',
      body: JSON.stringify({
        uri: uri.path,
        recursive: options.recursive
      })
    })
      .then(resp => resp.json())
      .then(console.log)
  }

  async rename(oldUri, newUri, options) {
    console.log('rename', oldUri, newUri, options)
    fetch(`/api/v1/vscode/rename`, {
      method: 'put',
      body: JSON.stringify({
        oldUri: oldUri.path,
        newUri: newUri.path,
        overwrite: options.overwrite
      })
    })
      .then(resp => resp.json())
      .then(console.log)
  }

  async stat(uri) {
    console.log('stat', uri)
    fetch(`/api/v1/vscode/state?uri=${uri.path}`)
      .then(resp => resp.json())
      .then(console.log)
    return {
      type: uri.path.split('/').pop().includes('.')
        ? vscode.FileType.File
        : vscode.FileType.Directory,
      ctime: 0,
      mtime: 0,
      size: 100
    }
  }

  async readDirectory(uri) {
    const data = fetch(`/api/v1/vscode/readDirectory?uri=${uri.path.replace(/^\//, '')}`)
      .then(resp => resp.json())
      .then(res => {
        return res.result.map(file => ([file.Name, file.Type]))
      })
      return data
  }

  async createDirectory(uri) {
    console.log('createDirectory', uri)
    // 这里实现创建目录的逻辑
    fetch(`/api/v1/vscode/createDirectory`, {
      method: 'post',
      body: JSON.stringify({
        uri: uri.path
      })
    })
      .then(resp => resp.json())
      .then(console.log)
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

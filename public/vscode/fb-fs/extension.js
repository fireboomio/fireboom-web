const vscode = require('vscode')

const rootPath = vscode.workspace.rootPath

class VirtualFileSystemProvider {
  _emitter = new vscode.EventEmitter()
  _bufferedEvents = []
  _fireSoonHandle
  onDidChangeFile = this._emitter.event

  constructor() {}

  async readFile(uri) {
    console.log('readFile', uri)
    return Uint8Array.from([104, 101, 108, 108, 111])
  }

  async writeFile(uri, content, options) {
    console.log('writeFile', uri, content, options)
    // 这里实现写入文件的逻辑
  }

  async delete(uri) {
    console.log('delete', uri)
    // 这里实现删除文件的逻辑
  }

  async rename(oldUri, newUri, options) {
    console.log('rename', oldUri, newUri, options)
    // 这里实现重命名文件的逻辑
  }

  async stat(uri) {
    console.log('stat', uri)
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
    console.log('readDirectory', uri)
    if (uri.path === rootPath) {
      return [
        ['foo', vscode.FileType.Directory],
        ['bar', vscode.FileType.Directory],
        ['baz.txt', vscode.FileType.File]
      ]
    }
    // 这里实现读取目录的逻辑
  }

  async createDirectory(uri) {
    console.log('createDirectory', uri)
    // 这里实现创建目录的逻辑
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

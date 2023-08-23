// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const rootPath = vscode.workspace.rootPath

async function openFile(filePath) {
  console.debug(`open file: ${filePath}`)
  const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(`fbfs:${filePath}`))
  vscode.window.showTextDocument(document)
}

async function readMsg() {
  const db = await openDatabase()
  const messages = await getMessages(db)
  messages.forEach(({ content }) => {
    switch (content.cmd) {
      case 'openFile':
        openFile(content.data.path)
        break
    }
  })
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // const outChannel = new BroadcastChannel('fb-vscode-out')
  const inChannel = new BroadcastChannel('fb-vscode-in')

  inChannel.onmessage = e => {
    readMsg()
  }
  readMsg()

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('fb-controller.helloWorld', function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from fb-controller!')
  })

  context.subscriptions.push(disposable)
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fb-controller')

    request.onerror = event => {
      reject('Failed to open IndexedDB')
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = event => {
      const db = event.target.result
      db.createObjectStore('msg', { keyPath: 'id', autoIncrement: true })
    }
  })
}

// 向数据库添加消息
async function addMessage(db, message) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['msg'], 'readwrite')
    const objectStore = transaction.objectStore('msg')
    const request = objectStore.add({ content: message })

    request.onerror = event => {
      reject('Failed to add message')
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }
  })
}

// 从数据库获取所有消息
async function getMessages(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['msg'], 'readwrite')
    const objectStore = transaction.objectStore('msg')
    const request = objectStore.getAll()

    request.onerror = event => {
      reject('Failed to get messages')
    }

    request.onsuccess = event => {
      objectStore.clear()
      resolve(event.target.result)
    }
  })
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const outChannel = new BroadcastChannel('fb-vscode-out')
  const inChannel = new BroadcastChannel('fb-vscode-in')

  // outChannel.postMessage('要发送消息啦啦啦啦啦啦啦')
  // inChannel.onmessage = e => {
  //   console.log('收到消息啦啦啦啦啦啦啦', e)
  // }
  ;(async () => {
    const db = await openDatabase()
    // await addMessage(db, 'test')

    const messages = await getMessages(db)
    console.log('接收到的消息:', messages)
  })()

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
    const request = indexedDB.open('fb-controller', 1)

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
    const transaction = db.transaction(['msg'], 'readonly')
    const objectStore = transaction.objectStore('msg')
    const request = objectStore.getAll()

    request.onerror = event => {
      reject('Failed to get messages')
    }

    request.onsuccess = event => {
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

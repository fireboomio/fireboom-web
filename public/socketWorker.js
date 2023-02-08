/**
 * Array to store all the connected ports in.
 */
const sendQueue = []
const connectedPorts = []
// Create socket instance.
let authKey = ''
let socket = null
const test = Math.random()
const wsUrl = new URL(location)
if (location.protocol === 'https:') {
  wsUrl.protocol = 'wss:'
} else {
  wsUrl.protocol = 'ws:'
}
wsUrl.pathname = '/ws'
// if(wsUrl.port === '3000') {
//   wsUrl.port = '9123'
// }
function openSocket() {
  let heartbeatTimer
  let pingCounter = 0
  if (socket) {
    try {
      socket.close()
    } catch (e) {
      console.error(e)
    }
  }
  const _socket = new WebSocket(wsUrl.href+`?auth-key=${authKey}`)
  _socket.addEventListener('open', () => {
    sendQueue.forEach(item => {
      _socket.send(item)
    })
    sendQueue.length = 0
    socket = _socket
    pingCounter++
    socket.send('ping')
    initQuery(socket)
    heartbeatTimer = setInterval(() => {
      if (pingCounter >= 3) {
        _socket.close()
        return
      }
      pingCounter++
      socket.send('ping')
    }, 1000 * 30)
  })
  _socket.addEventListener('close', () => {
    clearInterval(heartbeatTimer)
    setTimeout(openSocket, 5000)
  })

// Send data from socket to all open tabs.
  _socket.addEventListener('message', ({ data }) => {

    if (data === 'pong') {
      pingCounter = 0
      return
    }
    const payload = JSON.parse(data)
    connectedPorts.forEach(port => port.postMessage(payload))
  })
}

function sendSocket() {
  if (socket) {
    sendQueue.forEach(item => {
      socket.send(item)
    })
    sendQueue.length = 0
  }
}

// socket建立后查询初始状态
function initQuery(socket){
  // socket.send('{"channel":"engine", "event": "getStatus"}')
  // socket.send('{"channel":"log", "event": "getLogs"}')
  // socket.send('{"channel":"question", "event": "getQuestions"}')
}

// openSocket()


/**
 * When a new thread is connected to the shared worker,
 * start listening for messages from the new thread.
 */
self.addEventListener('connect', ({ ports }) => {
  const port = ports[0]

  // Add this new port to the list of connected ports.
  connectedPorts.push(port)

  /**
   * Receive data from main thread and determine which
   * actions it should take based on the received data.
   */
  port.addEventListener('message', ({ data }) => {

    connectedPorts.forEach(port => port.postMessage(data))
    const { action, value } = data

    // Send message to socket.
    if (action === 'send') {
      sendQueue.push(JSON.stringify(value))
      sendSocket()

      // Remove port from connected ports list.
    } else if (action === 'unload') {
      const index = connectedPorts.indexOf(port)
      connectedPorts.splice(index, 1)
    } else if (action === 'initWebSocket') {
      console.log('=====')
      authKey = value
      openSocket()
    }
  })

  // Start the port broadcasting.
  port.start()
})
/**
 * Array to store all the connected ports in.
 */
const sendQueue = []
const connectedPorts = []
// Create socket instance.
let socket = null
const test = Math.random()
const wsUrl = new URL(location)
wsUrl.protocol = 'ws:'
wsUrl.pathname = '/ws'
if(wsUrl.port === '3000') {
  wsUrl.port = '9123'
}
function openSocket() {
  let heartbeatTimer
  let pingCounter = 0
  const _socket = new WebSocket(wsUrl.href)
  _socket.addEventListener('open', () => {
    _socket.send('connected test')
    sendQueue.forEach(item => {
      _socket.send(item)
    })
    sendQueue.length = 0
    socket = _socket
    heartbeatTimer = setInterval(() => {
      if (pingCounter >= 3) {
        _socket.close()
        return
      }
      pingCounter++
      socket.send('ping')
    }, 1000 * 60 * 5)
  })
  _socket.addEventListener('close', () => {
    clearInterval(heartbeatTimer)
    openSocket()
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

function sendSocket(data) {
  if (socket) {
    sendQueue.forEach(item => {
      socket.send(item)
    })
    sendQueue.length = 0
  }
}

openSocket()


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
    }
  })

  // Start the port broadcasting.
  port.start()
})
const serverModule = new URL('/socketWorker.js', window.location.href).href
// const serverModule = new URL('/src/lib/socket/worker.ts', window.location.href).href
const webSocketWorker = new SharedWorker(serverModule, {
  type: 'module',
  credentials: 'same-origin',
  name: 'socketWorker3'
})
export default {}

/**
 * Sends a message to the worker and passes that to the Web Socket.
 * @param {any} message
 */
const sendMessageToSocket = message => {
  webSocketWorker.port.postMessage({
    action: 'send',
    value: message
  })
}

// Event to listen for incoming data from the worker and update the DOM.
webSocketWorker.port.addEventListener('message', ({ data }) => {
  console.log('data', data)
})

// Initialize the port connection.
webSocketWorker.port.start()
webSocketWorker.port.postMessage({ data: { aa: 111 } })
window.webSocketWorker = webSocketWorker

// Remove the current worker port from the connected ports list.
// This way your connectedPorts list stays true to the actual connected ports,
// as they array won't get automatically updated when a port is disconnected.
window.addEventListener('beforeunload', () => {
  webSocketWorker.port.postMessage({
    action: 'unload',
    value: null
  })

  webSocketWorker.port.close()
})

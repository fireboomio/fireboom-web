import events from '@/lib/event/events'

const serverModule = new URL('/socketWorker.js', window.location.href).href
console.log('===createWebSocketWorker===')
// const serverModule = new URL('/src/lib/socket/worker.ts', window.location.href).href
const webSocketWorker = new SharedWorker(serverModule, {
  type: 'module',
  credentials: 'same-origin',
  name: '_socketWorker'
})

/**
 * Sends a message to the worker and passes that to the Web Socket.
 * @param {any} message
 */
export const sendMessageToSocket = (message: any) => {
  webSocketWorker.port.postMessage({
    action: 'send',
    value: message
  })
}
export const initWebSocket = (key: string) => {
  webSocketWorker.port.postMessage({
    action: 'initWebSocket',
    value: key
  })
}

// Event to listen for incoming data from the worker and update the DOM.
webSocketWorker.port.addEventListener('message', e => {
  const { data } = e
  if (data.type === 'ws') {
    events.emit({ event: 'wsEvent', data })
  } else if (data.type === 'broadcast') {
    events.emit({ event: 'broadcastEvent', data })
  }
  // switch (data.channel) {
  //   case 'engine:state':
  //     break
  // }
})

// Initialize the port connection.
webSocketWorker.port.start()

export function postSharedMessage(message: any) {
  webSocketWorker.port.postMessage(message)
}

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

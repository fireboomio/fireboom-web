/**
 * Array to store all the connected ports in.
 */
const connectedPorts = [];

// Create socket instance.
// const socket = new WebSocket("wss://fx-ws.gateio.ws/v4/ws/btc");

// Send initial package on open.
// socket.addEventListener('open', () => {
//   const data = JSON.stringify({
//     "time": 123456,
//     "channel": "futures.tickers",
//     "event": "subscribe",
//     "payload": ["BTC_USD", "ETH_USD"]
//   });
//
//   socket.send(data);
// });

// Send data from socket to all open tabs.
// socket.addEventListener('message', ({ data }) => {
//   const payload = JSON.parse(data);
//   connectedPorts.forEach(port => port.postMessage(payload));
// });

/**
 * When a new thread is connected to the shared worker,
 * start listening for messages from the new thread.
 */
self.addEventListener('connect', ({ ports }) => {
  const port = ports[0];

  // Add this new port to the list of connected ports.
  connectedPorts.push(port);

  /**
   * Receive data from main thread and determine which
   * actions it should take based on the received data.
   */
  port.addEventListener('message', ({ data }) => {

    connectedPorts.forEach(port => port.postMessage(data));
    const { action, value } = data;

    // Send message to socket.
    if (action === 'send') {
      socket.send(JSON.stringify(value));

      // Remove port from connected ports list.
    } else if (action === 'unload') {
      const index = connectedPorts.indexOf(port);
      connectedPorts.splice(index, 1);
    }
  });

  // Start the port broadcasting.
  port.start();
});
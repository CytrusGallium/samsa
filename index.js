const WebSocket = require('ws');
const dotenv = require('dotenv');

console.log('======================================================================');
console.log('======================== Samsa SMS Gateway ===========================');
console.log('======================================================================');

// Host WebSocket Server
const webSocketServer = new WebSocket.Server({ port: 9999 });


let sockets = [];

webSocketServer.on('connection', (socket) => {
    console.log("Client connected.");
    sockets.push(socket);
    socket.send("Hello, Client !");
    // When you receive a message, send that message to every socket.
    socket.on('message', (msg) => {
        // sockets.forEach(s => s.send(msg));
        console.log("WebSocket Message : " + msg);
    });
    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', () => {
        sockets = sockets.filter(s => s !== socket);
    });
});
// Websocket End =====================================================================

const url = 'wss://apple-fan-ink.glitch.me/';
let wsClient = new WebSocket(url, {
    headers: {
        "User-Agent": `WebSocket Client`
    }
});

wsClient.on('open', () => {
    console.log(`Connected to ${url}`);
    wsClient.send('Hello Server ! This is a Test.');
});

// wsClient.on('message', (data) => {
//     console.log(`Message from server: ${data}`);
// });

// wsClient.on('error', (err) => {
//     console.log(`WebSocket error: ${err}`);
// });
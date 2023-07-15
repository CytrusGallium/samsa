const WebSocket = require('ws');
const dotenv = require('dotenv');

console.log('======================================================================');
console.log('======================== Samsa SMS Gateway ===========================');
console.log('======================================================================');

// Host WebSocket Server
const webSocketServer = new WebSocket.Server({ port: 9999 });

let sockets = [];
let providers = [];
let consumers = [];

// Websocket Setup Start =====================================================================
webSocketServer.on('connection', (socket) => {

    // Welcome newly connected client
    console.log("Client connected.");
    sockets.push(socket);
    socket.send('{code:"WELCOME"}');

    // When you receive a message, process it.
    socket.on('message', (msg) => {
        console.log("Message from Client : " + msg);

        const json = JSON.parse(msg);

        if (json && json.code) {

            if (json.code === "ME_CONSUMER") {
                Process_ME_CONSUMER(json, socket);
            }
            else if (json.code === "ME_PROVIDER") {
                Process_ME_PROVIDER(json, socket);
            }
            else if (json.code === "SEND") {
                Process_SEND(json, socket);
            }
        }
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', () => {
        sockets = sockets.filter(s => s !== socket);
    });
});
// Websocket Setup End ====================================================================

const Process_ME_CONSUMER = (ParamJson, ParamSocket) => {
    console.log("Registering consumer : " + ParamSocket._socket.remoteAddress);
    consumers.push(ParamSocket);
}

const Process_ME_PROVIDER = (ParamJson, ParamSocket) => {
    console.log("Registering provider : " + ParamSocket._socket.remoteAddress);
    providers.push(ParamSocket);
}

const Process_SEND = (ParamJson, ParamSocket) => {

    if (providers && providers.length > 0) {

        // ...
        console.log("Sending message from : " + ParamSocket._socket.remoteAddress);

        // ...
        if (ParamJson && ParamJson.phone && ParamJson.message) {
            console.log("Sending Message : " + ParamJson.message);
            console.log("Sending To : " + ParamJson.phone);
        }
    }
    else {
        console.log("No providers to send message through :(");
    }

}
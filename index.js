const WebSocket = require('ws');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

console.log('======================================================================');
console.log('========================== Samsa SMS API =============================');
console.log('======================================================================');

// Init express app
const app = express();

// Cors middleware
app.use(cors({
    origin: '*'
}));

// ==================================================================================
// Web Socket
// ==================================================================================
const webSocketServer = new WebSocket.Server({ port: 9999 });
let workers = [];
webSocketServer.on('connection', (socket) => {
    workers.push(socket);
    // socket.send("Hello, Client !");
    // When you receive a message, send that message to every socket.
    socket.on('message', (msg) => {
        // sockets.forEach(s => s.send(msg));
        console.log("WebSocket Message : " + msg);
    });
    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', () => {
        workers = workers.filter(s => s !== socket);
    });
});
// Websocket End =====================================================================

// Base Route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Nukode's Samsa SMS Sending API. In order to send an sms please use the /send route, while providing the phone and message parameters.");
});

// Send Route
app.get("/send", (req, res) => {

    if (req.query.phone && req.query.message) {
        if (workers && workers.length > 0) {
            workers[0].send({ phone: req.query.phone, message: req.query.message });
        }
        else {
            res.status(200).send("NO_WORKER"); // TODO : API error for not enough ressources
        }

    } else {
        res.status(200).send("INVALID_RECEPIENT"); // TODO : API error for not enough ressources
    }

});

app.listen(9000, () => {
    console.log("Samsa SMS API started on port 9999");
    console.log('======================================================================');
});
const express = require('express');
const app = express();
const server = require('http').Server(app)
server.listen(process.env.PORT || 80);
app.use('', express.static(__dirname));
const io = require('socket.io')(server);
const fs = require('fs');

const game = require('./scripts/game.js');

//variables for game
let width = 480;
let height = 270;

let p1 = {
    x: width / 30,
    y: height / 2,
    w: width / 80,
    h: height / 5,
    ID: 0,
    score: 0
};
let p2 = {
    x: width - width / 30,
    y: height / 2,
    w: width / 80,
    h: height / 5,
    ID: 0,
    score: 0
};
let ball = {
    x: width / 2,
    y: height / 2,
    velX: Math.round(Math.random()) * 4 - 2,
    velY: Math.round(Math.random()) * 4 - 2,
    r: 7.5
};

setInterval(function () {
    let winner = game.step(p1, p2, ball, width, height);
    if (!!winner) {
        io.sockets.emit('winner', winner);
        var waitTill = new Date(new Date().getTime() + 2000);
        while (waitTill > new Date()) { }
    }
    io.sockets.emit('ball', ball);
    io.sockets.emit('p1', p1);
    io.sockets.emit('p2', p2);
}, 10);

//connections' IDs
let connections = [];
let connectionIDs = [];

function newID() {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

io.on('connection', function (socket) {
    let ID = newID();
    console.log(ID);
    connections.push(socket);
    connectionIDs.push(ID);
    socket.emit('ID', ID);

    if (connections.length == 1) {
        socket.emit('player', 1);
    } else if (connections.length == 2) {
        socket.emit('player', 2);
    } else {
        socket.emit('queue', connections.length);
    }

    //on this connection sending an input
    socket.on('up', function (ID) {
        if (ID == connectionIDs[0]) {
            //player 1
            p1.y -= 2;
        } else if (ID == connectionIDs[1]) {
            //player 2
            p2.y -= 2;
        }
    });
    socket.on('down', function (ID) {
        if (ID == connectionIDs[0]) {
            //player 1
            p1.y += 2;
        } else if (ID == connectionIDs[1]) {
            //player 2
            p2.y += 2;
        }
    });

    //when this connection disconnects
    socket.on('disconnect', function () {
        let disconnected = 0;
        for (let i = 0; i < connectionIDs.length; i++) {
            if (ID == connectionIDs[i]) {
                disconnected = i;
                connections.splice(disconnected, 1);
                connectionIDs.splice(disconnected, 1);
                break;
            }
        }
        for (let i = 0; i < connectionIDs.length; i++) {
            if (i < 2) {
                connections[i].emit('player', i + 1);
            }
            socket.emit('queue', i + 1);
        }
    });
});
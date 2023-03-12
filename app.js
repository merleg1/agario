const port = process.env.PORT || 3000;
const url = 'https://agario-4g6i.onrender.com/';
const Vector = require('./vector.js')
const Blob = require('./blob.js')
const Player = require('./player.js')

const { Console } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/phone', function (req, res) {
    res.sendFile(__dirname + '/public/index-p.html');
});

let idPairs = [];
let players = [];
let food = [];
let eatenFoodIndices = [];
let numberOfEatenBlobs = 0;
let actualWidth = 10000;
let actualHeight = 10000;
let numberOfFood = 1000;
let maxFoodSize = 32;
let minFoodSize = 12;
let blobStartSize = 64;

for (var i = 0; i < numberOfFood; i++) {
    let x = getRandomInt(-actualWidth / 2, actualWidth / 2);
    let y = getRandomInt(-actualHeight / 2, actualHeight / 2);
    let r = getRandomInt(minFoodSize, maxFoodSize);
    food.push(new Blob(x, y, r));
}

setInterval(spawnFood, 15000)

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);

    socket.on('init', () => {
        socket.emit('initReturn', `${url}/phone?id=${socket.id}`);
    });

    socket.on('registerPhoneToPC', (data) => {
        console.log(data + " is paired with " + socket.id)
        idPairs.push({pcId: data, phoneId: socket.id});
    });

    socket.on('start', (data) => {
        let player = new Player(data.n != '' ? data.n : 'blob', getRandomInt(-actualWidth / 2, actualWidth / 2), getRandomInt(-actualHeight / 2, actualHeight / 2), blobStartSize, socket.id, data.w, data.h);
        players.push(player);

        socket.emit('playerData', player);

        socket.emit('foodData', food);

        socket.emit('startReturn', {
            h: actualHeight,
            w: actualWidth,
            s: blobStartSize
        });

        let phoneId = getPhoneId(socket.id);
        console.log("send startPhone to: " + phoneId)

        io.to(phoneId).emit('startPhone');

    });

    socket.on('orientation', (data) => {

        let pcId = getPcId(socket.id);
        let player = players[findPlayerIndex(pcId)];
        let vel = new Vector(data.x , data.y);
        vel.setMag(2.2 * Math.pow(player.r, -0.439) * 40);
        player.move(vel, (actualWidth / 2) - player.r, (actualHeight / 2) - player.r);

        for (var i = 0; i < food.length; i++) {
            if (player.eats(food[i])) {
                eatenFoodIndices.push(i);
                numberOfEatenBlobs++;
                food.splice(i, 1);
            }
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i].id != player.id && player.eats(players[i])) {
                console.log("player " + players[i].id + " has been eaten");
                players[i].pos.x = getRandomInt(-actualWidth / 2, actualWidth / 2);
                players[i].pos.y = getRandomInt(-actualHeight / 2, actualHeight / 2);
                players[i].r = blobStartSize;
                io.to(players[i].id).emit('player', players[i]);
            }
        }

        io.emit('eatenFood', eatenFoodIndices);
        eatenFoodIndices = [];

    });

    socket.on('getPositions', () => {
        let player = players[findPlayerIndex(socket.id)];
        socket.emit('playerData', player);
        socket.emit('players', players);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, "has disconnected");

        players.splice(findPlayerIndex(socket.id), 1);
    });

});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findPlayerIndex(id) {
    let index = 0;
    for (player of players) {

        if (player.id == id) {
            return index;
        }

        index++;

    }
}

function getPhoneId(pcId) {
    for (idPair of idPairs) {
        if (idPair.pcId == pcId) {
            return idPair.phoneId;
        }
    }
}

function getPcId(phoneId) {
    for (idPair of idPairs) {
        if (idPair.phoneId == phoneId) {
            return idPair.pcId;
        }
    }
}

function spawnFood() {
    let newFood = [];
    for (var i = 0; i < numberOfEatenBlobs; i++) {
        let x = getRandomInt(-actualWidth / 2, actualWidth / 2);
        let y = getRandomInt(-actualHeight / 2, actualHeight / 2);
        let r = getRandomInt(minFoodSize, maxFoodSize);
        let newBlob = new Blob(x, y, r);
        newFood.push(newBlob);
        food.push(newBlob);
    }
    numberOfEatenBlobs = 0;
    io.emit('newFood', newFood);
}


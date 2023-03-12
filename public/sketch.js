let player;
let food = [];
let players = [];
let zoom = 1;

let actualWidth;
let actualHeight;
let blobStartSize;

let socket = io();
let start = false;

function setup() {
  createCanvas(displayWidth, displayHeight);
  frameRate(60);

  socket.emit('init');

  socket.on('playerData', (data) => {
    player = data;
  });

  socket.on('foodData', (data) => {
    food = data;
  });

  socket.on('players', (data) => {
    players = data;
  });

  socket.on('eatenFood', (data) => {
    for (i of data) {
      food.splice(i, 1);
    }
  });

  socket.on('newFood', (data) => {
    for (f of data) {
      food.push(f);
    }
  });

  socket.on('initReturn', (data) => {
    new QRCode(document.getElementById("qrcode"), {
      text: data,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  });

  socket.on('noPair', () => {
    document.getElementById("phoneError").style.display = "block";
  });

  socket.on('startReturn', (data) => {
    actualHeight = data.h;
    actualWidth = data.w;
    blobStartSize = data.s;
    document.getElementById("overlay").style.display = "none";
    start = true;
  });
}


function draw() {
  background(15);

  if (start) {

    socket.emit('getPositions');
    translate(width / 2, height / 2);
    let newzoom = blobStartSize / player.r;
    //making the transition animations smoother lerp funtion
    zoom = lerp(zoom, newzoom, 0.01);
    scale(zoom);
    translate(-player.pos.x, -player.pos.y);

    for (var i = 0; i < food.length; i++) {
      if (isInWindow(food[i].pos.x, food[i].pos.y, player.pos.x, player.pos.y, width * (player.r / blobStartSize), height * (player.r / blobStartSize))) {
        fill(food[i].color);
        ellipse(food[i].pos.x, food[i].pos.y, food[i].r * 2, food[i].r * 2);
      }
    }

    for (var i = 0; i < players.length; i++) {
      if (isInWindow(players[i].pos.x, players[i].pos.y, player.pos.x, player.pos.y, width * (player.r / blobStartSize), height * (player.r / blobStartSize))) {
        fill(players[i].color);
        ellipse(players[i].pos.x, players[i].pos.y, players[i].r * 2, players[i].r * 2);
        fill(255);
        textSize(players[i].r / 4);
        text(players[i].name, players[i].pos.x - textWidth(players[i].name) / 2, players[i].pos.y + players[i].r / 12);
      }
    }

  }

}

function isInWindow(x, y, px, py, cw, ch) {
  return (x >= px - cw / 2 && x <= px + cw / 2 && y >= py - ch / 2 && y <= py + ch / 2);
}

function startGame() {
  let nickname = document.getElementById("nickname").value;

  socket.emit('start', {
    w: width,
    h: height,
    n: nickname
  });
}
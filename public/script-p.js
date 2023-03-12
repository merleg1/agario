// let fps = 60;
// let now;
// let then = Date.now();
// let interval = 1000 / fps;
// let delta;

// let socket = io();
// let pcId = null;

// let ox;
// let oy;

// function draw() {

//     requestAnimationFrame(draw);

//     now = Date.now();
//     delta = now - then;

//     if (delta > interval) {
//         then = now - (delta % interval);

//         output.textContent = `beta : ${ox}\n`;
//         output.textContent += `gamma: ${oy}\n`;
//         // socket.emit('orientation', {
//         //     x: ox,
//         //     y: oy,
//         // });
//     }
// }

// let searchParams = new URLSearchParams(window.location.search)
// if (!searchParams.has('id')) {
//     throw new Error('id necessary');
// }
// pcId = searchParams.get('id');

// draw();

// var output = document.querySelector(".output");
// function handleOrientation(event) {
//     ox = event.beta; // In degree in the range [-180,180)
//     oy = event.gamma; // In degree in the range [-90,90)
// }

// window.addEventListener("deviceorientation", handleOrientation);

const ball = document.querySelector(".ball");
const garden = document.querySelector(".garden");
const output = document.querySelector(".output");

const maxX = garden.clientWidth - ball.clientWidth;
const maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {
  let x = event.beta; // In degree in the range [-180,180)
  let y = event.gamma; // In degree in the range [-90,90)

  output.textContent = `beta : ${x}\n`;
  output.textContent += `gamma: ${y}\n`;

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top = `${(maxY * y) / 180 - 10}px`;
  ball.style.left = `${(maxX * x) / 180 - 10}px`;
}

window.addEventListener("deviceorientation", handleOrientation);



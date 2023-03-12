let fps = 60;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

let socket = io();
let pcId = null;

let ox;
let oy;
let start = false;

function draw() {

  requestAnimationFrame(draw);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    if (start) {
      socket.emit('orientation', {
        x: ox,
        y: oy,
      });
    }
  }
}

function handleOrientation(event) {
  ox = event.beta; // In degree in the range [-180,180)
  oy = -event.gamma; // In degree in the range [-90,90)

  if (ox > 90) {
    ox = 90;
  }
  if (x < -90) {
    ox = -90;
  }
}

let searchParams = new URLSearchParams(window.location.search)
if (!searchParams.has('id')) {
  throw new Error('id necessary');
}
pcId = searchParams.get('id');

socket.emit('registerPhoneToPC', pcId);

socket.on('startPhone', () => {
  start = true;
});

socket.on('stopPhone', () => {
  start = false;
});

window.addEventListener("deviceorientation", handleOrientation);

draw();
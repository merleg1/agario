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
let handleOrientationCalled = false;

let btn = document.getElementById("request");

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

  if(!handleOrientationCalled) {
    handleOrientationCalled = true;
    btn.style.display = "none";
  }

  ox = event.beta; // In degree in the range [-180,180)
  oy = -event.gamma; // In degree in the range [-90,90)

  if (ox > 90) {
    ox = 90;
  }
  if (ox < -90) {
    ox = -90;
  }
}

function permission() {
  if (typeof (DeviceOrientationEvent) !== "undefined" && typeof (DeviceOrientationEvent.requestPermission) === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error)
  } else {
    alert("DeviceOrientationEvent is not defined");
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
btn.addEventListener("click", permission);

draw();
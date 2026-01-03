const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
const rotation = document.getElementById("rotation");
const output = document.getElementById("output");

let dragging = false;
let centerX = joystick.offsetWidth / 2;
let centerY = joystick.offsetHeight / 2;
let maxRadius = joystick.offsetWidth / 2;

let x = 0, y = 0, z = 0;

stick.addEventListener("mousedown", () => dragging = true);
document.addEventListener("mouseup", () => {
  dragging = false;
  resetStick();
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const rect = joystick.getBoundingClientRect();
  let dx = e.clientX - rect.left - centerX;
  let dy = e.clientY - rect.top - centerY;

  const distance = Math.min(Math.sqrt(dx*dx + dy*dy), maxRadius);

  const angle = Math.atan2(dy, dx);

  dx = Math.cos(angle) * distance;
  dy = Math.sin(angle) * distance;

  stick.style.left = `${centerX + dx - 30}px`;
  stick.style.top  = `${centerY + dy - 30}px`;

  x = (dy / maxRadius).toFixed(2) * -1; // forward/back
  y = (dx / maxRadius).toFixed(2);      // left/right

  updateOutput();
});

rotation.addEventListener("input", () => {
  z = (rotation.value / 100).toFixed(2);
  updateOutput();
});

function resetStick() {
  stick.style.left = "70px";
  stick.style.top  = "70px";
  x = 0;
  y = 0;
  updateOutput();
}

function updateOutput() {
  output.innerText = `X: ${x}, Y: ${y}, Z: ${z}`;

  // SEND TO ROBOT HERE
  // sendCommand({ x, y, z });
}

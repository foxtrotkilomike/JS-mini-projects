const wrapper = document.querySelector('.wrapper');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let WIDTH, HEIGHT;

if (wrapper.offsetWidth < 1000) {
  WIDTH = wrapper.offsetWidth / 1.2;
} else {
  WIDTH = wrapper.offsetWidth / 2;
}

if (wrapper.offsetHeight < 1100) {
  HEIGHT = wrapper.offsetHeight / 1.4;
} else {
  HEIGHT = wrapper.offsetHeight / 1.6;
}

canvas.width = WIDTH;
canvas.height = HEIGHT;

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);

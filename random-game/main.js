const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const rules = document.querySelector('.rules');
const rulesBtn = document.querySelector('.rules-button');
const startBtn = document.querySelector('.start-button');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let WIDTH, HEIGHT;
let isPlay = false;

window.onload = () => {
  rules.style.opacity = '1';
};

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

const backgroundImg = new Image();
backgroundImg.src = './assets/screen.png';

const foregroundImg = new Image();
foregroundImg.src = './assets/lava1.png';
foregroundImg.height = HEIGHT * 0.1;

const spriteImg = new Image();
spriteImg.src = './assets/Captain.png';


let sprite = {
  x: WIDTH * 0.2,
  y: HEIGHT / 2,

  boostUp() {
    if (this.y - HEIGHT / 6 < HEIGHT / 6) {
      this.y = 0;
    } else {
      this.y -= HEIGHT / 6;
    }
  }
}

let fg =  {
  x: 0,
  y: HEIGHT - foregroundImg.height
}

let bg = {
  x: 0,
  y: 0
}


function gameOver() {
  isPlay = false;
  setTimeout(() => {
    body.classList.remove('game-started-body');
  canvas.classList.remove('game-started-canvas');
  }, 1000);

}

function render() {

  ctx.drawImage(backgroundImg, bg.x, bg.y);
  ctx.drawImage(spriteImg, sprite.x, sprite.y);
  ctx.drawImage(foregroundImg, fg.x, fg.y);
  

  window.requestAnimationFrame(update);
}

function update() {

  if (isPlay) {
    fg.x -= 1;
    if (fg.x < -(foregroundImg.width - WIDTH)) {
      fg.x = 0;
    }

    sprite.y++;

    if (sprite.y >= HEIGHT - spriteImg.height - foregroundImg.height) {
      gameOver();
    }
  }

    render();
}

update();


rulesBtn.addEventListener('click', () => {
  rules.style.opacity = '0';
  setTimeout(() => {
    rules.style.visibility = 'hidden';
  }, 500);
})

startBtn.addEventListener('click', () => {
  startBtn.style.visibility = 'hidden';
  body.classList.add('game-started-body');
  canvas.classList.add('game-started-canvas');
  isPlay = true;
  
  update();
})

canvas.addEventListener('click', () => {
  if (isPlay) sprite.boostUp();
})

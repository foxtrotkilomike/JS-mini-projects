const storage = window.localStorage;
let scoreData = [];
const tbody = document.querySelector('.tbody');
const lastGamesCount = 10;

function fillScoreTable(scoreData) {
  tbody.innerHTML = '';
  let tableContent = scoreData.map((score, index) => {
    let td = [];
    const tr = document.createElement('tr');
    td[0] = document.createElement('td');
    td[1] = document.createElement('td');
    td[0].textContent = index + 1;
    td[1].textContent = score;
    tr.append(...td);
    return tr;
  });

  tbody.append(...tableContent);
}

if (storage.getItem('score')) {
  scoreData = storage.getItem('score').split(',');
  scoreData = scoreData.map(score => parseInt(score));
  fillScoreTable(scoreData);
}
  

const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const rules = document.querySelector('.rules');
const rulesBtn = document.querySelector('.rules-button');
const playBtn = document.querySelector('.play-button');
const scoreBox = document.querySelector('.score');
const scoreAnimated = document.querySelector('.score-animated')
const yourScore = document.querySelector('.score-box-last');
const yourScoreCount = document.querySelector('.your-score');
const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const obsImgHeight = 800;
const gapHeight = 250;

let WIDTH, HEIGHT;
let isPlay = false;
let upCount = 0, score = 0, obsCount = 0, techsCount = 0;
let obsGenerateFeq = 600, techsGenerateFeq = 2400;
const techsOffset = obsGenerateFeq / 2;
let obstacles = [], techInstance = {};
let obsRandomY, techsRandomY;
let randomImgIndex;

window.onload = () => {
  rules.style.opacity = '1';
};

if (wrapper.offsetWidth < 1100) {
  WIDTH = wrapper.offsetWidth / 1.2;
} else {
  WIDTH = 1000;
}

if (wrapper.offsetHeight < 1100) {
  HEIGHT = wrapper.offsetHeight / 1.3;
} else {
  HEIGHT = 760;
}

canvas.width = WIDTH;
canvas.height = HEIGHT;

const obsOffsetMin = -790;
const obsOffsetMax = -(HEIGHT / 6 + gapHeight + obsImgHeight - HEIGHT);

const backgroundImg = new Image();
backgroundImg.src = './assets/screen.png';

const foregroundImg = new Image();
foregroundImg.src = './assets/lava1.png';
foregroundImg.height = HEIGHT * 0.1;

const spriteImg = new Image();
spriteImg.src = './assets/Captain.png';

const obstaclesImg = [
  './assets/text-0.png',
  './assets/text-1.png',
  './assets/text-2.png',
  './assets/text-3.png',
  './assets/text-4.png',
  './assets/text-5.png',
  './assets/text-6.png',
  './assets/text-7.png',
  './assets/text-8.png',
  './assets/text-9.png',
  './assets/text-10.png'
];

const thechsImg = [
  './assets/techs/angular.png',
  './assets/techs/codepen.png',
  './assets/techs/css.png',
  './assets/techs/git.png',
  './assets/techs/graphql.png',
  './assets/techs/html.png',
  './assets/techs/js.png',
  './assets/techs/mysql.png',
  './assets/techs/nginx.png',
  './assets/techs/nodejs.png',
  './assets/techs/npm.png',
  './assets/techs/py.png',
  './assets/techs/react.png',
  './assets/techs/redux.png',
  './assets/techs/sass.png',
  './assets/techs/ts.png',
  './assets/techs/vscode.png',
  './assets/techs/vue.png',
  './assets/techs/webpack.png'
];


let sprite = {
  x: WIDTH * 0.2,
  y: HEIGHT / 3,

  boostUp() {
    // smooth movements
    moveUp = setInterval(() => {
      this.y -= HEIGHT / 40;
      if (this.y < 0) this.y = 0;
      upCount++;
      upCount >= 5 ? clearInterval(moveUp) : null;
    }, 8)

    upCount = 0;
  }
}

function Obstacle(x, y, imgSrc) {
  this.x = x;
  this.y = y;
  this.wasFlown = false;
  this.img = new Image();
  this.img.src = imgSrc;
}

function Thechnology(x, y, imgSrc) {
  this.x = x;
  this.y = y;
  this.wasHit = false;
  this.img = new Image(100, 100);
  this.img.src = imgSrc;
}

let fg = {
  x: 0,
  y: HEIGHT - foregroundImg.height
}

let bg = {
  x: 0,
  y: 0
}

function manageScore() {
  if (scoreData.length === lastGamesCount) scoreData.pop();
  scoreData.push(score);
  scoreData.sort((a, b) => b - a);
  storage.setItem('score', scoreData);
  fillScoreTable(scoreData);
}

function gameOver() {
  isPlay = false;
  // otherwise animation will become faster each try
  window.cancelAnimationFrame(stop);
  setTimeout(() => {
    body.classList.remove('game-started-body');
    canvas.classList.remove('game-started-canvas');
    playBtn.style.visibility = 'visible';
    yourScoreCount.textContent = score;
    yourScore.style.visibility = 'visible';
  }, 1000);

  manageScore();
}

function isCollision() {
  if (obstacles[0].wasFlown)
    return false

  if (sprite.y >= HEIGHT - spriteImg.height - foregroundImg.height)
    return true

  if (sprite.x + spriteImg.width > obstacles[0].x &&
      (sprite.y < obstacles[0].y + obsImgHeight || 
       sprite.y + spriteImg.height > obstacles[1].y)) 
    return true

  return false
}

function scoreUpdateObs() {
  if (!obstacles[0].wasFlown && obstacles[0].x < sprite.x) {
    obstacles[0].wasFlown = true;
    obstacles[1].wasFlown = true;
    score += 10;
    scoreBox.textContent = score;
    scoreAnimated.textContent = score;
  }
}

function scoreUpdateTech() {
  if (sprite.x + spriteImg.width > techInstance.x &&
      sprite.y > techInstance.y && sprite.y < techInstance.y + techInstance.img.height &&
      !techInstance.wasHit) {
    techInstance.wasHit = true;
    score += 50;
    scoreBox.textContent = score;
    scoreAnimated.textContent = score;
    scoreAnimated.classList.add('animation');
  }
}

function render() {

  ctx.drawImage(backgroundImg, bg.x, bg.y);
  ctx.drawImage(spriteImg, sprite.x, sprite.y);
  obstacles.forEach(obstacle =>
    ctx.drawImage(obstacle.img, obstacle.x, obstacle.y));

  if (Object.entries(techInstance).length !== 0)
    ctx.drawImage(techInstance.img, techInstance.x, techInstance.y, techInstance.img.width, techInstance.img.height);
    
  ctx.drawImage(foregroundImg, fg.x, fg.y);

  stop = window.requestAnimationFrame(update);
}

function update() {

  if (isPlay) {
    // foreground move
    fg.x -= 1;
    if (fg.x < -(foregroundImg.width - WIDTH)) {
      fg.x = 0;
    }

    // sprite is falling down
    sprite.y += 0.7;

    if (obstacles.length) {
      if (isCollision()) {
        gameOver();
      }

      obstacles.forEach(obstacle => obstacle.x--);
      if (obstacles[0].x < -100) obstacles.splice(0, 1);

      scoreUpdateObs();
    }

    if (Object.entries(techInstance).length !== 0) {
      techInstance.x--;
      if (techInstance.x + techInstance.img.width < 0) {
        techInstance = {};
        scoreAnimated.classList.remove('animation');
      } else scoreUpdateTech();
    }

    obsCount--;
    if (obsCount < 0) {
      obsCount = obsGenerateFeq;

      obsRandomY = Math.floor(Math.random() * (obsOffsetMin - obsOffsetMax) + obsOffsetMax);
      if (obsRandomY > -650) {
        // images with text have indexes from 1 to 10
        randomImgIndex = Math.floor(Math.random() * (obstaclesImg.length - 2) + 1);
      } else {
        // no text image index
        randomImgIndex = 0;
      }
      obstacles.push(new Obstacle(WIDTH, obsRandomY, obstaclesImg[randomImgIndex]))
      obstacles.push(new Obstacle(WIDTH, obsRandomY + obsImgHeight + gapHeight, obstaclesImg[0]))
    }

    techsCount--;
    if (techsCount < 0) {
      techsCount = techsGenerateFeq;

      techsRandomY = Math.floor(Math.random() * (HEIGHT - 150));
      randomImgIndex = Math.floor(Math.random() * (thechsImg.length - 1));
      techInstance = new Thechnology(WIDTH + techsOffset, techsRandomY, thechsImg[randomImgIndex]);
    }
  }

  render();
}

update();

function startCountDown() {
  let counterSeconds = 3;
  const counter = document.createElement('div');
  counter.classList.add('count-down');
  canvasContainer.append(counter);
  counter.textContent = `${counterSeconds}`
  countDownID = setInterval(() => {
    counterSeconds--;
    counterSeconds < 0 ? clearInterval(countDownID) : null;
    counter.textContent = `${counterSeconds}`
  }, 1000)

  setTimeout(() => counter.remove(), 1000 * counterSeconds);
}

function startGame() {
  sprite.x = WIDTH * 0.2;
  sprite.y = HEIGHT / 3;
  obstacles = [];
  techInstance = {};
  fg.x = 0;
  fg.y = HEIGHT - foregroundImg.height;
  score = 0;
  scoreBox.textContent = '0';
  scoreAnimated.textContent = '0';

  startCountDown();

  setTimeout(() => {
    body.classList.add('game-started-body');
    canvas.classList.add('game-started-canvas');
    isPlay = true;
    
    update();
  }, 3000);
}

rulesBtn.addEventListener('click', () => {
  rules.style.opacity = '0';
  setTimeout(() => {
    rules.style.visibility = 'hidden';  
  }, 500);

  startGame();
})

playBtn.addEventListener('click', () => {
  playBtn.style.visibility = 'hidden';
  yourScore.style.visibility = 'hidden';
  startGame();
})

document.addEventListener('keydown', (event) => {
  if (isPlay && event.code === 'ArrowUp') sprite.boostUp();
})

canvas.addEventListener('touchstart', () => {
  if (isPlay) sprite.boostUp();
});

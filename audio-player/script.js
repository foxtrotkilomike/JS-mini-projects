const playButton = document.querySelector(".button-play");
const playImage = document.querySelector(".play-img");
const songAudio = document.querySelector("audio");
const progressBar = document.querySelector(".progress");
const durationCurrent = document.querySelector(".duration-current");
const durationFull = document.querySelector(".duration-full");

let audioIndex = 0;
let isPlay = false;
let time, timeSec, timeMin, songAudio, songTitle, songArtist, songCover;

const audioList = [
  {
    trackName: "beyonce.mp3",
    artist: "Beyonce",
    title: "Don't Hurt Yourself",
    cover: "lemonade.png"
  },
  {
    trackName: "dontstartnow.mp3",
    artist: "Dua Lipa",
    title: "Don't Start Now",
    cover: "dontstartnow.png"
  }
];

loadAudio = (audioIndex) => {
  progressBar.value = 0;
  songAudio.src = `./assets/audio/${audioList[audioIndex].trackName}`;
  songArtist = audioList[audioIndex].artist;
  songTitle = audioList[audioIndex].title;
  songCover = audioList[audioIndex].cover;
}

loadAudio(0);

updateRange = () => {
  progressBar.value = (songAudio.currentTime / songAudio.duration) * 100;
  time = Math.floor(songAudio.currentTime);
  timeSec = time % 60;
  timeMin = Math.floor(time / 60);

  if (timeSec < 10) {
    durationCurrent.textContent = `${timeMin}:0${timeSec}`;
  } else {
    durationCurrent.textContent = `${timeMin}:${timeSec}`;
  }
};

setInterval(updateRange, 500);

playAudio = () => {
  if (!isPlay) {
    isPlay = true;
    playImage.src = "./assets/svg/pause.png";
    songAudio.play();
  } else {
    isPlay = false;
    playImage.src = "./assets/svg/play.png";
    songAudio.pause();
  }
};

playButton.addEventListener("click", playAudio);

setProgressBar = () => {
  songAudio.currentTime = (progressBar.value / 100) * songAudio.duration;
};

progressBar.addEventListener("click", setProgressBar);

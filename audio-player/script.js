const songAudio = document.querySelector("audio");
const backgroundContainer = document.querySelector(".background");
const songCover = document.querySelector(".player-cover");
const songArtist = document.querySelector(".track-artist");
const songTitle = document.querySelector(".track-title");

const playBtn = document.querySelector(".button-play");
const forwardBtn = document.querySelector(".button-forward");
const backwardBtn = document.querySelector(".button-back");
const buttonVolume = document.querySelector(".button-volume");

const playImage = document.querySelector(".play-img");
const volumeImage = document.querySelector(".volume-img");
const progressBar = document.querySelector(".progress");
const volumeBar = document.querySelector(".volume");
const durationCurrent = document.querySelector(".duration-current");
const durationFull = document.querySelector(".duration-full");

let audioIndex = 0;
let isPlay = false;
let volumeUp = true;
let lastVolumeValue = 0.3;
let time, timeSec, timeMin;

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

timeFormat = (time) => {
  timeSec = time % 60;
  timeMin = Math.floor(time / 60);

  if (timeSec < 10) {
    return `${timeMin}:0${timeSec}`;
  } 
  
  return `${timeMin}:${timeSec}`;
}

loadAudio = (audioIndex) => {
  progressBar.value = 0;
  songAudio.src = `./assets/audio/${audioList[audioIndex].trackName}`;
  songAudio.load();
  if (!volumeUp) {
    songAudio.volume = 0;
    volumeBar.value = 0;
  } else {
    songAudio.volume = lastVolumeValue;
    volumeBar.value = songAudio.volume;
  }
  
  songArtist.textContent = audioList[audioIndex].artist;
  songTitle.textContent = audioList[audioIndex].title;
  songCover.style.backgroundImage = `url(./assets/img/${audioList[audioIndex].cover})`;

  backgroundContainer.style.backgroundImage = `url(./assets/img/${audioList[audioIndex].cover})`;
}

loadAudio(audioIndex);
songAudio.addEventListener("loadeddata", () => {
  durationFull.textContent = timeFormat(Math.round(songAudio.duration));
});

updateRange = () => {
  progressBar.value = (songAudio.currentTime / songAudio.duration) * 100;
  time = Math.floor(songAudio.currentTime);
  durationCurrent.textContent = timeFormat(time);
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

playBtn.addEventListener("click", playAudio);

setProgressBar = () => {
  songAudio.currentTime = (progressBar.value / 100) * songAudio.duration;
};

setVolumeBar = () => {
  songAudio.volume = volumeBar.value;
  lastVolumeValue = volumeBar.value;
  volumeUp = true;
  if (volumeBar.value > 0.5) {
    volumeImage.src = './assets/svg/volume-big.png';
  } else if (volumeBar.value > 0) {
    volumeImage.src = './assets/svg/volume-small.png';
  } else {
    volumeUp = false;
    volumeImage.src = './assets/svg/volume-mute.png';
  }
}

progressBar.addEventListener("click", setProgressBar);
volumeBar.addEventListener("click", setVolumeBar);

playNext = () => {
  audioIndex++;
  if (audioIndex >= audioList.length)
    audioIndex = 0;
  loadAudio(audioIndex);

  if (isPlay) {
    isPlay = false;
    playAudio();
  }
}

playPrev = () => {
  audioIndex--;
  if (audioIndex < 0)
    audioIndex = audioList.length - 1;
  loadAudio(audioIndex);
  
  if (isPlay) {
    isPlay = false;
    playAudio();
  }
}

forwardBtn.addEventListener("click", playNext);
backwardBtn.addEventListener("click", playPrev);
songAudio.addEventListener("ended", playNext);

muteAudio = () => {
  if (volumeUp) {
    volumeUp = false;
    lastVolumeValue = songAudio.volume;
    songAudio.volume = 0;
    volumeBar.value = 0;
    volumeImage.src = './assets/svg/volume-mute.png';
  } else {
    volumeUp = true;
    songAudio.volume = lastVolumeValue;
    volumeBar.value = lastVolumeValue;
    volumeImage.src = './assets/svg/volume-small.png';
  }
}

buttonVolume.addEventListener("click", muteAudio)

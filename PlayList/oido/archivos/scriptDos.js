const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const coverImage = document.getElementById('cover-image');
const playlistEl = document.getElementById('playlist');

const tracks = [
  {
    title: "Cuán lejos voy - Sara Paula Gómez Arias",
    file: "Cuán lejos voy - Sara Paula Gómez Arias.mp3",
    image: "Cuán lejos voy - Sara Paula Gómez Arias..png"
  },
  {
    title: "Define Dancing - Thomas Newman",
    file: "Define Dancing - Thomas Newman.mp3",
    image: "Define Dancing - Thomas Newman.png"
  },
  {
    title: "Hombres de Acción Serán Hoy - Cristian Castro",
    file: "Hombres de Acción Serán Hoy - Cristian Castro.mp3",
    image: "Hombres de Acción Serán Hoy - Cristian Castro.png"
  },
  {
    title: "Libre Soy - Carmen Sarahi",
    file: "Libre Soy - Carmen Sarahi.mp3",
    image: "Libre Soy - Carmen Sarahi.png"
  },
  {
    title: "Pay Attention / In a World of My Own - Kathryn Beaumont",
    file: "Pay Attention _ In a World of My Own - Kathryn Beaumont.mp3",
    image: "Pay Attention _ In a World of My Own - Kathryn Beaumont.png"
  },
  {
    title: "The Crystal Chamber - James Newton Howard",
    file: "The Crystal Chamber - From _Atlantis_ The Lost Empire__Score - James Newton Howard.mp3",
    image: "The Crystal Chamber - From _Atlantis_ The Lost Empire__Score - James Newton Howar.png"
  },
  {
    title: "Veo en ti la luz - Chayanne",
    file: "Veo en ti la luz - Chayanne.mp3",
    image: "Veo en ti la luz - Chayanne.png"
  },
  {
    title: "Volaré - Jim Sutherland",
    file: "Volaré - Jim Sutherland.mp3",
    image: "Volaré - Jim Sutherland.png"
  }
];

let currentTrack = 0;

function loadTrack(index) {
  currentTrack = index;
  const track = tracks[index];
  audio.src = `Music/${track.file}`;
  trackTitle.textContent = track.title;
  coverImage.src = `Music/${track.image}`;
  highlightActive(index);
  localStorage.setItem('lastTrack', currentTrack);
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '⏸';
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playBtn.textContent = '⏸';
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playBtn.textContent = '⏸';
}

audio.addEventListener('timeupdate', () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
  durationSpan.textContent = formatTime(audio.duration);

  localStorage.setItem('lastTime', audio.currentTime);
});

progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
  nextTrack();
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

tracks.forEach((track, index) => {
  const li = document.createElement('li');
  li.textContent = track.title;
  li.onclick = () => {
    currentTrack = index;
    loadTrack(currentTrack);
    audio.play();
    playBtn.textContent = '⏸';
  };
  playlistEl.appendChild(li);
});

function highlightActive(index) {
  const items = playlistEl.querySelectorAll('li');
  items.forEach((el, i) => {
    el.classList.toggle('active', i === index);
    if (i === index) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

const savedTrack = parseInt(localStorage.getItem('lastTrack'));
const savedTime = parseFloat(localStorage.getItem('lastTime'));

if (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < tracks.length) {
  currentTrack = savedTrack;
}

let restoringFromStorage = true;

loadTrack(currentTrack);

audio.addEventListener('loadedmetadata', () => {
  if (
    restoringFromStorage &&
    !isNaN(savedTime) &&
    savedTime > 0 &&
    savedTime < audio.duration
  ) {
    audio.currentTime = savedTime;
  }
  restoringFromStorage = false;
});

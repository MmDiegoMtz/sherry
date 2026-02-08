// Elementos del DOM
const audio = document.getElementById("audio");
const songList = document.getElementById("songList");
const lyricsContainer = document.getElementById("lyrics");
const lyricsScroll = document.getElementById("lyricsScroll");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const songCount = document.getElementById("songCount");

// Controles del reproductor
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playIcon = playPauseBtn.querySelector(".play-icon");
const pauseIcon = playPauseBtn.querySelector(".pause-icon");

// Barra de progreso
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const progressHandle = document.getElementById("progressHandle");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Control de volumen
const volumeSlider = document.getElementById("volumeSlider");

// Array de canciones
const songs = [
  {
    title: "Happy Together",
    artist: "The Turtles",
    file: "music/happy-together.mp3",
    lrc: "lyrics/happy-together.lrc"
  },
  {
    title: "Amor Completo",
    artist: "Mon Laferte",
    file: "music/amor-completo.mp3",
    lrc: "lyrics/amor-completo.lrc"
  },
  {
    title: "Tú",
    artist: "Maye",
    file: "music/tu.mp3",
    lrc: "lyrics/tu.lrc"
  },
  {
    title: "Valentine",
    artist: "Laufey",
    file: "music/valentine.mp3",
    lrc: "lyrics/valentine.lrc"
  },
  {
    title: "Piel Canela",
    artist: "Cuco",
    file: "music/piel-canela.mp3",
    lrc: "lyrics/piel-canela.lrc"
  }
];

let currentLyrics = [];
let currentIndex = -1;
let isDragging = false;

// ========== INICIALIZACIÓN ==========
songCount.textContent = songs.length;

// Crear lista de canciones (diseño compacto)
songs.forEach((song, index) => {
  const item = document.createElement("div");
  item.className = "song-item";
  
  const title = document.createElement("h3");
  title.textContent = song.title;
  
  const artist = document.createElement("p");
  artist.textContent = song.artist;
  
  item.appendChild(title);
  item.appendChild(artist);
  
  item.addEventListener("click", () => loadSong(index));
  songList.appendChild(item);
});

// ========== FUNCIONES DE REPRODUCCIÓN ==========
function loadSong(index) {
  currentIndex = index;
  const song = songs[index];

  audio.src = song.file;
  currentTitle.textContent = song.title;
  currentArtist.textContent = song.artist;

  // Actualizar item activo
  document.querySelectorAll(".song-item").forEach(item => item.classList.remove("active"));
  songList.children[index].classList.add("active");

  // Cargar letras
  fetch(song.lrc)
    .then(res => res.text())
    .then(data => {
      parseLRC(data);
    })
    .catch(err => {
      console.error("Error cargando letras:", err);
      lyricsContainer.innerHTML = '<div class="lyric-block"><p class="original">Letras no disponibles</p></div>';
    });

  audio.play();
}

// ========== PARSER DE LETRAS LRC ==========
function parseLRC(data) {
  lyricsContainer.innerHTML = "";
  currentLyrics = [];

  const lines = data.split("\n");
  const tempMap = {};

  lines.forEach(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      const text = match[3].trim();

      if (!tempMap[time]) {
        tempMap[time] = { time, original: "", translation: "" };
      }

      if (text.startsWith("[es]")) {
        tempMap[time].translation = text.replace("[es]", "").trim();
      } else {
        tempMap[time].original = text;
      }
    }
  });

  currentLyrics = Object.values(tempMap)
    .filter(line => line.original || line.translation)
    .sort((a, b) => a.time - b.time);

  // Renderizar letras
  currentLyrics.forEach((line, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("lyric-block");
    wrapper.dataset.index = index;

    if (line.original) {
      const original = document.createElement("p");
      original.classList.add("original");
      original.textContent = line.original;
      wrapper.appendChild(original);
    }

    if (line.translation) {
      const translation = document.createElement("p");
      translation.classList.add("translation");
      translation.textContent = line.translation;
      wrapper.appendChild(translation);
    }

    lyricsContainer.appendChild(wrapper);
  });
}

// ========== SINCRONIZACIÓN DE LETRAS ==========
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;

  // Actualizar letras activas
  for (let i = 0; i < currentLyrics.length; i++) {
    if (
      currentTime >= currentLyrics[i].time &&
      (i === currentLyrics.length - 1 || currentTime < currentLyrics[i + 1].time)
    ) {
      const allBlocks = lyricsContainer.querySelectorAll(".lyric-block");
      allBlocks.forEach(block => block.classList.remove("active"));

      if (allBlocks[i]) {
        allBlocks[i].classList.add("active");
        
        // Scroll suave centrado
        const blockTop = allBlocks[i].offsetTop;
        const containerHeight = lyricsScroll.clientHeight;
        const blockHeight = allBlocks[i].offsetHeight;
        const scrollPosition = blockTop - (containerHeight / 2) + (blockHeight / 2);
        
        lyricsScroll.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      }
      break;
    }
  }

  // Actualizar barra de progreso
  updateProgress();
});

// ========== CONTROLES DEL REPRODUCTOR ==========
playPauseBtn.addEventListener("click", () => {
  if (currentIndex === -1) {
    loadSong(0);
    return;
  }
  
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
});

audio.addEventListener("pause", () => {
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    loadSong(currentIndex - 1);
  } else {
    loadSong(songs.length - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < songs.length - 1) {
    loadSong(currentIndex + 1);
  } else {
    loadSong(0);
  }
});

// Auto-reproducir siguiente canción
audio.addEventListener("ended", () => {
  if (currentIndex < songs.length - 1) {
    loadSong(currentIndex + 1);
  } else {
    loadSong(0);
  }
});

// ========== BARRA DE PROGRESO ==========
function updateProgress() {
  if (!isDragging && audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    progressHandle.style.left = percent + "%";
  }
  
  // Actualizar tiempos
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) {
    durationEl.textContent = formatTime(audio.duration);
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Interacción con barra de progreso
progressBar.addEventListener("mousedown", startDrag);
progressBar.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;
  updateProgressFromEvent(e);
  
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
}

function onDrag(e) {
  if (isDragging) {
    updateProgressFromEvent(e);
  }
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
}

function updateProgressFromEvent(e) {
  const rect = progressBar.getBoundingClientRect();
  const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const offsetX = clientX - rect.left;
  const percent = Math.max(0, Math.min(1, offsetX / rect.width));
  
  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
    progressFill.style.width = (percent * 100) + "%";
    progressHandle.style.left = (percent * 100) + "%";
  }
}

// ========== CONTROL DE VOLUMEN ==========
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

// Establecer volumen inicial
audio.volume = volumeSlider.value / 100;

// ========== ATAJOS DE TECLADO ==========
document.addEventListener("keydown", (e) => {
  switch(e.code) {
    case "Space":
      e.preventDefault();
      playPauseBtn.click();
      break;
    case "ArrowLeft":
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
      break;
    case "ArrowRight":
      e.preventDefault();
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      break;
    case "ArrowUp":
      e.preventDefault();
      audio.volume = Math.min(1, audio.volume + 0.1);
      volumeSlider.value = audio.volume * 100;
      break;
    case "ArrowDown":
      e.preventDefault();
      audio.volume = Math.max(0, audio.volume - 0.1);
      volumeSlider.value = audio.volume * 100;
      break;
  }
});

// ========== METADATA DEL AUDIO ==========
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
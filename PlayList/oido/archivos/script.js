const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const trackTitle = document.getElementById('track-title');
const playlistEl = document.getElementById('playlist');

const tracks = [
    "SpotiDownloader.com - Iris - The Goo Goo Dolls.mp3",
    "SpotiDownloader.com - Es Por Ti - Juanes.mp3",
    "SpotiDownloader.com - Por Debajo De La Mesa - Luis Miguel.mp3",
    "SpotiDownloader.com - Is This Love - Whitesnake.mp3",
    "SpotiDownloader.com - Solamente tú - Pablo Alborán.mp3"
];

let currentTrack = 0;

// Variables para animación del corazón
const heartCanvas = document.getElementById("heartCanvas");
const heartCtx = heartCanvas.getContext("2d");
const heartW = heartCanvas.width;
const heartH = heartCanvas.height;
let heartK = 0;
let heartAnimationFrame;

// Variables para animación de cartas de amor
const loveCanvas = document.getElementById("loveLettersCanvas");
const loveCtx = loveCanvas.getContext("2d");
const loveW = loveCanvas.width;
const loveH = loveCanvas.height;
let loveLetters = [];
let loveAnimationFrame;

// Variables para animación de estrellas
let starCtx, starW, starH;
let starT = 0;
let starPaused = false;
let starPauseCounter = 0;
const starPauseDuration = 60;
let starAnimationId = null;

// Variables para animación de flores
let flowerCtx, flowerW, flowerH;
let flowers = [];
let flowerAnimationId = null;

// Variables para animación de constelación
let constellationCtx, constellationW, constellationH;
let constellationStars = [], heartStars = [];
let constellationAnimationId = null;

// Función para cargar pista
function loadTrack(index) {
    currentTrack = index;
    const filename = tracks[index];
    audio.src = `audios/${filename}`;
    trackTitle.textContent = filename.replace('SpotiDownloader.com - ', '').replace('.mp3', '');
    highlightActive(index);

    // Animaciones condicionales según la pista
    if (index === 0) {
        startHeartAnimation();
        stopLoveAnimation();
        stopFlowers();
        stopConstellation();
        stopStars();
        heartK = 0;
    } else if (index === 1) {
        stopHeartAnimation();
        stopStars();
        stopFlowers();
        stopConstellation();
        startLoveAnimation();
    } else if (index === 2) {
        stopLoveAnimation();
        stopHeartAnimation();
        stopFlowers();
        stopConstellation();
        startStars();
    } else if (index === 3) {
        stopHeartAnimation();
        stopLoveAnimation();
        stopStars();
        stopConstellation();
        startFlowers();
    } else if (index === 4) { // Última canción
        stopHeartAnimation();
        stopLoveAnimation();
        stopStars();
        stopFlowers();
        startConstellation();
    } else {
        stopHeartAnimation();
        stopLoveAnimation();
        stopStars();
        stopFlowers();
        stopConstellation();
    }

    localStorage.setItem('lastTrack', currentTrack);
}

// Función para reproducir/pausar
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
}

// Función para siguiente pista
function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.textContent = '⏸';
}

// Función para pista anterior
function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.textContent = '⏸';
}

// Event listener para actualizar barra de progreso
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent || 0;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);

    // Guardar progreso y pista actual
    localStorage.setItem('lastTime', audio.currentTime);
    localStorage.setItem('lastTrack', currentTrack);
});

// Event listener para cambiar tiempo con la barra
progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Event listener para cuando termina la canción
audio.addEventListener('ended', () => {
    nextTrack();
});

// Función para formatear tiempo en MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Generar UI de playlist
tracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.replace('SpotiDownloader.com - ', '').replace('.mp3', '');
    li.onclick = () => {
        currentTrack = index;
        loadTrack(currentTrack);
        audio.play();
        playBtn.textContent = '⏸';
    };
    playlistEl.appendChild(li);
});

// Función para resaltar pista activa y auto-scroll
function highlightActive(index) {
    const items = playlistEl.querySelectorAll('li');
    items.forEach((el, i) => {
        el.classList.toggle('active', i === index);
        if (i === index) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Restaurar estado guardado (solo al cargar la página)
const savedTrack = parseInt(localStorage.getItem('lastTrack'));
const savedTime = parseFloat(localStorage.getItem('lastTime'));

if (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < tracks.length) {
    currentTrack = savedTrack;
}

let restoringFromStorage = true;

loadTrack(currentTrack);

audio.addEventListener('loadedmetadata', () => {
    if (restoringFromStorage && !isNaN(savedTime) && savedTime > 0 && savedTime < audio.duration) {
        audio.currentTime = savedTime;
    }
    restoringFromStorage = false; // Solo en el primer load
});

// ================================
// ANIMACIONES
// ================================

// Animación del corazón
function drawHeartFrame() {
    heartCtx.clearRect(0, 0, heartW, heartH);

    heartCtx.beginPath();
    heartCtx.strokeStyle = `hsl(${(heartK * 3.6) % 360}, 100%, 70%)`;
    heartCtx.lineWidth = 2;

    const scale = 80;
    const centerX = heartW / 2;
    const centerY = heartH / 2 + 27;
    const xMax = Math.sqrt(3);
    const resolution = 0.005;

    let started = false;
    for (let x = -xMax; x <= xMax; x += resolution) {
        const y = heartFunction(x, heartK);
        if (y === null || isNaN(y)) continue;

        const canvasX = centerX + x * scale;
        const canvasY = centerY - y * scale;

        if (!started) {
            heartCtx.moveTo(canvasX, canvasY);
            started = true;
        } else {
            heartCtx.lineTo(canvasX, canvasY);
        }
    }

    heartCtx.stroke();
    heartK += 0.02;
    heartAnimationFrame = requestAnimationFrame(drawHeartFrame);
}

function heartFunction(x, k) {
    if (x * x > 3) return null;
    const term1 = Math.pow(Math.abs(x), 2 / 3);
    const term2 = 0.9 * Math.sin(k * x) * Math.sqrt(3 - x * x);
    return term1 + term2;
}

function startHeartAnimation() {
    heartCanvas.style.display = 'block';
    drawHeartFrame();
}

function stopHeartAnimation() {
    heartCanvas.style.display = 'none';
    cancelAnimationFrame(heartAnimationFrame);
}

// Animación de cartas de amor
function createLetter() {
    return {
        x: Math.random() * loveW,
        y: Math.random() * loveH,
        size: 25 + Math.random() * 20,
        speed: 0.4 + Math.random() * 1,
        offset: Math.random() * 1000,
    };
}

function drawEnvelope(x, y, size) {
    loveCtx.fillStyle = '#ffcad4';
    loveCtx.beginPath();
    loveCtx.rect(x, y, size, size * 0.6);
    loveCtx.fill();

    loveCtx.fillStyle = '#ff9aa2';
    loveCtx.beginPath();
    loveCtx.moveTo(x, y);
    loveCtx.lineTo(x + size / 2, y + size * 0.3);
    loveCtx.lineTo(x + size, y);
    loveCtx.closePath();
    loveCtx.fill();
}

function drawLoveLettersFrame() {
    loveCtx.fillStyle = 'rgba(0,0,0,0.2)';
    loveCtx.fillRect(0, 0, loveW, loveH);

    for (let letter of loveLetters) {
        const wave = Math.sin((Date.now() / 300) + letter.offset) * 6;
        drawEnvelope(letter.x + wave, letter.y, letter.size);
        letter.x += letter.speed;
        letter.y += Math.sin((Date.now() / 1000) + letter.offset) * 0.4;

        if (letter.x > loveW + 60) {
            Object.assign(letter, createLetter());
            letter.x = -60;
        }
    }

    loveAnimationFrame = requestAnimationFrame(drawLoveLettersFrame);
}

function startLoveAnimation() {
    loveLetters = [];
    for (let i = 0; i < 15; i++) {
        loveLetters.push(createLetter());
    }
    loveCanvas.style.display = 'block';
    drawLoveLettersFrame();
}

function stopLoveAnimation() {
    loveCanvas.style.display = 'none';
    cancelAnimationFrame(loveAnimationFrame);
}

// Animación de estrellas
function drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawStarFrame() {
    if (!starPaused) {
        starCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
        starCtx.fillRect(0, 0, starW, starH);

        const centerX = starW / 2;
        const centerY = starH / 2;
        const spiralRadius = 200 - starT * 0.5;
        const angle = starT * 0.02;

        const x1 = centerX + spiralRadius * Math.cos(angle);
        const y1 = centerY + spiralRadius * Math.sin(angle);

        const x2 = centerX + spiralRadius * Math.cos(angle + Math.PI);
        const y2 = centerY + spiralRadius * Math.sin(angle + Math.PI);

        drawStarShape(starCtx, x1, y1, 5, 8, 4, 'pink');
        drawStarShape(starCtx, x2, y2, 5, 8, 4, 'lightblue');

        if (spiralRadius <= 5) {
            drawStarShape(starCtx, centerX, centerY, 5, 20, 10, 'white');
            starPaused = true;
        } else {
            starT += 0.5;
        }
    } else {
        starPauseCounter++;
        if (starPauseCounter > starPauseDuration) {
            starT = 0;
            starPaused = false;
            starPauseCounter = 0;
            starCtx.clearRect(0, 0, starW, starH);
        }
    }

    starAnimationId = requestAnimationFrame(drawStarFrame);
}

function startStars() {
    stopHeartAnimation();
    stopLoveAnimation();
    stopStars();

    const canvas = document.getElementById('starCanvas');
    canvas.style.display = 'block';
    starCtx = canvas.getContext('2d');
    starW = canvas.width;
    starH = canvas.height;
    drawStarFrame();
}

function stopStars() {
    const canvas = document.getElementById('starCanvas');
    canvas.style.display = 'none';
    if (starAnimationId) {
        cancelAnimationFrame(starAnimationId);
        starAnimationId = null;
    }
}

// Animación de flores
class Flower {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = flowerW / 2;
        this.y = flowerH / 2;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.5 + Math.random();
        this.size = 0;
        this.maxSize = 20 + Math.random() * 30;
        this.opacity = 1;
        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`;
    }

    update() {
        this.size += 0.5;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.005;
        if (this.size > this.maxSize || this.opacity <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Pétalos
        for (let i = 0; i < 6; i++) {
            ctx.rotate((Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size, this.size / 2, 0, this.size);
            ctx.quadraticCurveTo(-this.size, this.size / 2, 0, 0);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Centro
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffcc";
        ctx.fill();

        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

function drawFlowerFrame() {
    flowerCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
    flowerCtx.fillRect(0, 0, flowerW, flowerH);

    for (let flower of flowers) {
        flower.update();
        flower.draw(flowerCtx);
    }

    flowerAnimationId = requestAnimationFrame(drawFlowerFrame);
}

function startFlowers() {
    stopHeartAnimation();
    stopLoveAnimation();
    stopStars();
    stopFlowers();

    const canvas = document.getElementById("flowerCanvas");
    canvas.style.display = "block";
    flowerCtx = canvas.getContext("2d");
    flowerW = canvas.width;
    flowerH = canvas.height;

    flowers = [];
    for (let i = 0; i < 30; i++) {
        flowers.push(new Flower());
    }

    drawFlowerFrame();
}

function stopFlowers() {
    const canvas = document.getElementById("flowerCanvas");
    canvas.style.display = "none";
    if (flowerAnimationId) {
        cancelAnimationFrame(flowerAnimationId);
        flowerAnimationId = null;
    }
}

// Animación de constelación en forma de corazón
function initConstellationCanvas() {
    const canvas = document.getElementById("constellationCanvas");
    canvas.style.display = "block";
    constellationCtx = canvas.getContext("2d");
    constellationW = canvas.width;
    constellationH = canvas.height;

    generateConstellationStars();
    generateHeartStars();
    drawConstellationFrame();
}

function generateConstellationStars() {
    constellationStars = [];
    for (let i = 0; i < 100; i++) {
        constellationStars.push({
            x: Math.random() * constellationW,
            y: Math.random() * constellationH,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            speed: Math.random() * 0.02 + 0.01,
        });
    }
}

function generateHeartStars() {
    heartStars = [];
    const centerX = constellationW / 2;
    const centerY = constellationH / 2 - 25; // Ligeramente más abajo
    const scale = 8; // Más pequeño

    for (let t = 0; t < Math.PI * 2; t += 0.15) {
        const x = scale * 16 * Math.pow(Math.sin(t), 3);
        const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heartStars.push({
            x: centerX + x,
            y: centerY + y,
            opacity: 0
        });
    }
}

function drawConstellationFrame() {
    constellationCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
    constellationCtx.fillRect(0, 0, constellationW, constellationH);

    // Dibujar estrellas de fondo
    for (let star of constellationStars) {
        star.opacity += star.speed;
        if (star.opacity >= 1 || star.opacity <= 0) {
            star.speed *= -1;
        }
        constellationCtx.beginPath();
        constellationCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        constellationCtx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        constellationCtx.fill();
    }

    // Dibujar constelación en forma de corazón
    for (let i = 0; i < heartStars.length; i++) {
        const star = heartStars[i];
        if (star.opacity < 1) star.opacity += 0.01;

        constellationCtx.beginPath();
        constellationCtx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        constellationCtx.fillStyle = `rgba(255,182,193,${star.opacity})`;
        constellationCtx.fill();

        // Conectar estrellas con líneas
        if (i > 0) {
            const prev = heartStars[i - 1];
            constellationCtx.beginPath();
            constellationCtx.moveTo(prev.x, prev.y);
            constellationCtx.lineTo(star.x, star.y);
            constellationCtx.strokeStyle = `rgba(255,105,180,${Math.min(prev.opacity, star.opacity)})`;
            constellationCtx.lineWidth = 1;
            constellationCtx.stroke();
        }
    }

    constellationAnimationId = requestAnimationFrame(drawConstellationFrame);
}

function startConstellation() {
    stopHeartAnimation();
    stopLoveAnimation();
    stopStars();
    stopFlowers();
    stopConstellation();
    initConstellationCanvas();
}

function stopConstellation() {
    const canvas = document.getElementById("constellationCanvas");
    canvas.style.display = "none";
    if (constellationAnimationId) {
        cancelAnimationFrame(constellationAnimationId);
        constellationAnimationId = null;
    }
}

// ================================
// ANIMACIÓN DE ONDAS EN EL MENÚ
// ================================

const audio1 = document.querySelector('audio');
const waveItems = document.querySelectorAll('.wave-menu li');

function toggleWaveAnimation(isPlaying) {
    waveItems.forEach(li => {
        li.style.animationPlayState = isPlaying ? 'running' : 'paused';
    });
}

// Event listeners para controlar animación de ondas
audio1.addEventListener('play', () => toggleWaveAnimation(true));
audio1.addEventListener('pause', () => toggleWaveAnimation(false));
audio1.addEventListener('ended', () => toggleWaveAnimation(false));

// Inicialización cuando se carga la página
window.addEventListener('DOMContentLoaded', () => {
    // Por si acaso el audio está pausado al inicio, pausamos la animación
    toggleWaveAnimation(false);
});
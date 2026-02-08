// Array con todas las fotos
const photos = [
    'foto-1.jpg', 'foto-2.jpg', 'foto-3.jpg', 'foto-4.jpg', 'foto-5.jpg',
    'foto-6.jpg', 'foto-7.jpg', 'foto-8.jpg', 'foto-9.jpg', 'foto-10.jpg',
    'foto-11.jpg', 'foto-12.jpg', 'foto-13.jpg', 'foto-14.jpg', 'foto-15.jpg',
    'foto-16.jpg', 'foto-17.jpg', 'foto-18.jpg', 'foto-19.jpg', 'foto-20.jpg',
    'foto-21.jpg', 'foto-22.jpg', 'foto-23.jpg', 'foto-24.jpg', 'foto-25.jpg',
    'foto-26.jpg', 'foto-27.jpg', 'foto-28.jpg', 'foto-29.jpg', 'foto-30.jpg',
    'foto-31.jpg', 'foto-32.jpg', 'foto-33.jpg', 'foto-34.jpg', 'foto-35.jpg',
    'foto-36.jpg', 'foto-37.jpg', 'foto-38.jpg', 'foto-39.jpg', 'foto-40.jpg',
    'foto-41.jpg', 'foto-42.jpg', 'foto-43.jpg', 'foto-44.jpg'
];

// Función para mezclar el array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Mezclar las fotos al cargar
const shuffledPhotos = shuffleArray(photos);

// Variables globales
let currentIndex = 0;
let autoPlayInterval;
const autoPlayDelay = 5000; // 5 segundos

// Elementos del DOM
const carousel = document.querySelector('.carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPhotoSpan = document.getElementById('currentPhoto');
const totalPhotosSpan = document.getElementById('totalPhotos');
const indicatorsContainer = document.getElementById('indicators');

// Inicializar el carrusel
function initCarousel() {
    // Limpiar el carrusel
    carousel.innerHTML = '';
    
    // Crear todas las imágenes
    shuffledPhotos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = `fotos/${photo}`;
        img.alt = `Momento especial ${index + 1}`;
        img.classList.add('carousel-image');
        if (index === 0) {
            img.classList.add('active');
        }
        carousel.appendChild(img);
    });
    
    // Crear indicadores
    createIndicators();
    
    // Actualizar contador
    updateCounter();
    
    // Iniciar reproducción automática
    startAutoPlay();
}

// Crear indicadores (solo los primeros 10 para no saturar)
function createIndicators() {
    indicatorsContainer.innerHTML = '';
    const maxIndicators = Math.min(10, shuffledPhotos.length);
    
    for (let i = 0; i < maxIndicators; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Actualizar contador
function updateCounter() {
    currentPhotoSpan.textContent = currentIndex + 1;
    totalPhotosSpan.textContent = shuffledPhotos.length;
}

// Actualizar indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentIndex && currentIndex < 10) {
            indicator.classList.add('active');
        }
    });
}

// Mostrar foto específica
function showPhoto(index) {
    const images = document.querySelectorAll('.carousel-image');
    
    // Remover clase active de todas las imágenes
    images.forEach(img => {
        img.classList.remove('active');
        img.classList.add('fade-out');
    });
    
    // Agregar clase active a la imagen actual
    setTimeout(() => {
        images[index].classList.remove('fade-out');
        images[index].classList.add('active');
    }, 50);
    
    // Actualizar contador e indicadores
    updateCounter();
    updateIndicators();
}

// Ir a la siguiente foto
function nextPhoto() {
    currentIndex = (currentIndex + 1) % shuffledPhotos.length;
    showPhoto(currentIndex);
    resetAutoPlay();
}

// Ir a la foto anterior
function prevPhoto() {
    currentIndex = (currentIndex - 1 + shuffledPhotos.length) % shuffledPhotos.length;
    showPhoto(currentIndex);
    resetAutoPlay();
}

// Ir a una foto específica
function goToSlide(index) {
    currentIndex = index;
    showPhoto(currentIndex);
    resetAutoPlay();
}

// Iniciar reproducción automática
function startAutoPlay() {
    autoPlayInterval = setInterval(nextPhoto, autoPlayDelay);
}

// Detener reproducción automática
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Reiniciar reproducción automática
function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Event listeners para los botones
prevBtn.addEventListener('click', prevPhoto);
nextBtn.addEventListener('click', nextPhoto);

// Pausar autoplay cuando el mouse está sobre el carrusel
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// Control con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevPhoto();
    } else if (e.key === 'ArrowRight') {
        nextPhoto();
    }
});

// Touch events para móviles (swipe)
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - siguiente foto
            nextPhoto();
        } else {
            // Swipe right - foto anterior
            prevPhoto();
        }
    }
}

// Precargar imágenes para transiciones más suaves
function preloadImages() {
    shuffledPhotos.forEach(photo => {
        const img = new Image();
        img.src = `fotos/${photo}`;
    });
}

// Inicializar todo cuando cargue la página
window.addEventListener('load', () => {
    initCarousel();
    preloadImages();
});

// Pausar cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});
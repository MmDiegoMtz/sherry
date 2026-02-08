// ===========================
// CRONÓMETROS
// ===========================

function calcularTiempoTranscurrido(fechaInicio) {
    const ahora = new Date();

    let años = ahora.getFullYear() - fechaInicio.getFullYear();
    let meses = ahora.getMonth() - fechaInicio.getMonth();
    let dias = ahora.getDate() - fechaInicio.getDate();
    let horas = ahora.getHours() - fechaInicio.getHours();
    let minutos = ahora.getMinutes() - fechaInicio.getMinutes();
    let segundos = ahora.getSeconds() - fechaInicio.getSeconds();

    // Ajustes para valores negativos
    if (segundos < 0) {
        segundos += 60;
        minutos--;
    }

    if (minutos < 0) {
        minutos += 60;
        horas--;
    }

    if (horas < 0) {
        horas += 24;
        dias--;
    }

    if (dias < 0) {
        const ultimoMes = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        dias += ultimoMes.getDate();
        meses--;
    }

    if (meses < 0) {
        meses += 12;
        años--;
    }

    // Formato bonito con emojis
    return `
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 10px;">
                <span style="font-size: 1.1rem;"><strong>${años}</strong> años</span>
                <span style="font-size: 1.1rem;"><strong>${meses}</strong> meses</span>
                <span style="font-size: 1.1rem;"><strong>${dias}</strong> días</span>
            </div>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 10px; opacity: 0.8;">
                <span>${horas}h</span>
                <span>${minutos}m</span>
                <span>${segundos}s</span>
            </div>
        </div>
    `;
}

// Fechas de inicio (Nota: en JavaScript, los meses van de 0-11, así que noviembre = 10)
const fecha1 = new Date(2023, 10, 10, 16, 30, 0); // 10 noviembre 2023, 4:30 PM
const fecha2 = new Date(2024, 11, 27, 16, 45, 0); // 27 diciembre 2024, 4:45 PM

function actualizarCronometros() {
    const cronometro1Element = document.getElementById("cronometro1");
    const cronometro2Element = document.getElementById("cronometro2");
    
    if (cronometro1Element) {
        cronometro1Element.innerHTML = calcularTiempoTranscurrido(fecha1);
    }
    
    if (cronometro2Element) {
        cronometro2Element.innerHTML = calcularTiempoTranscurrido(fecha2);
    }
}

// Actualizar cada segundo
setInterval(actualizarCronometros, 1000);
actualizarCronometros();

// ===========================
// ANIMACIONES DE SCROLL
// ===========================

// Intersection Observer para animar elementos al hacer scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Agregar un pequeño retraso entre elementos consecutivos
            const index = Array.from(document.querySelectorAll('.timeline-event')).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
    });
}, observerOptions);

// Observar todos los eventos de la línea de tiempo
document.addEventListener('DOMContentLoaded', () => {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach(event => {
        observer.observe(event);
    });
});

// ===========================
// INTERACTIVIDAD DE EVENTOS
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    timelineEvents.forEach((event, index) => {
        // Efecto de clic en las imágenes para ampliarlas
        const imageCircle = event.querySelector('.image-circle');
        
        if (imageCircle) {
            imageCircle.addEventListener('click', function() {
                createImageModal(this.querySelector('img').src);
            });
        }

        // Efecto de hover en todo el evento
        event.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        event.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Agregar números de evento
        const yearBadge = event.querySelector('.year-badge');
        if (yearBadge && index < timelineEvents.length - 1) {
            const eventNumber = document.createElement('span');
            eventNumber.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background: linear-gradient(135deg, #ec4899, #f472b6);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(236, 72, 153, 0.4);
            `;
            eventNumber.textContent = index + 1;
            yearBadge.style.position = 'relative';
            yearBadge.appendChild(eventNumber);
        }
    });

    // Agregar efectos de partículas al hacer scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Crear partículas ocasionales
        if (Math.abs(scrollDelta) > 50 && Math.random() > 0.7) {
            createParticle();
        }
        
        lastScrollY = currentScrollY;
    });
});

// ===========================
// MODAL PARA IMÁGENES
// ===========================

function createImageModal(imageSrc) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
        animation: fadeIn 0.3s ease-out;
    `;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(139, 92, 246, 0.5);
        animation: zoomIn 0.3s ease-out;
    `;

    modal.appendChild(img);
    document.body.appendChild(modal);

    // Cerrar al hacer clic
    modal.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    });

    // Agregar estilos de animación si no existen
    if (!document.getElementById('modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes zoomIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===========================
// PARTÍCULAS DECORATIVAS
// ===========================

function createParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const startX = Math.random() * window.innerWidth;
    const emoji = ['💜', '❤️', '✨', '💕'][Math.floor(Math.random() * 4)];
    
    particle.textContent = emoji;
    particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: -20px;
        font-size: ${size}px;
        pointer-events: none;
        z-index: 9998;
        animation: fall ${2 + Math.random() * 2}s linear forwards;
        opacity: 0.6;
    `;

    document.body.appendChild(particle);

    // Agregar animación de caída si no existe
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(${window.innerHeight + 50}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Eliminar después de la animación
    setTimeout(() => particle.remove(), 4000);
}

// ===========================
// EFECTOS ESPECIALES AL CARGAR
// ===========================

window.addEventListener('load', () => {
    // Crear algunas partículas iniciales
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createParticle(), i * 300);
    }

    // Efecto de confeti al llegar al final
    const footer = document.querySelector('footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createConfetti();
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (footer) {
        footerObserver.observe(footer);
    }
});

function createConfetti() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createParticle(), i * 100);
    }
}

// ===========================
// EFECTO DE PARALLAX SUAVE
// ===========================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const decorativeElements = document.querySelectorAll('.decorative-element');
    
    decorativeElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
});

// ===========================
// EASTER EGG: DOBLE CLIC EN TÍTULO
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.querySelector('.main-title');
    
    if (mainTitle) {
        mainTitle.addEventListener('dblclick', () => {
            // Crear explosión de corazones
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.textContent = '💜';
                    heart.style.cssText = `
                        position: fixed;
                        left: 50%;
                        top: 50%;
                        font-size: ${Math.random() * 30 + 20}px;
                        pointer-events: none;
                        z-index: 9999;
                        animation: explode ${1 + Math.random()}s ease-out forwards;
                    `;
                    document.body.appendChild(heart);
                    setTimeout(() => heart.remove(), 2000);
                }, i * 50);
            }

            // Agregar animación de explosión
            if (!document.getElementById('explode-animation')) {
                const style = document.createElement('style');
                style.id = 'explode-animation';
                style.textContent = `
                    @keyframes explode {
                        to {
                            transform: translate(
                                ${(Math.random() - 0.5) * 400}px,
                                ${(Math.random() - 0.5) * 400}px
                            ) rotate(${Math.random() * 360}deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
});

// ===========================
// SMOOTH SCROLL
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// CONSOLA DE MENSAJE ESPECIAL
// ===========================

console.log('%c💜 Nuestra Historia de Amor 💜', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cEsta línea de tiempo fue creada con amor ❤️', 'font-size: 14px; color: #ec4899;');
console.log('%c¡Feliz San Valentín! ✨', 'font-size: 16px; color: #a78bfa;');

let countdownInterval;
let targetDate;
let snowflakes = [];
let lastUpdateTime = 0;
const updateInterval = 16;
const openButton = document.createElement('button'); // Crear el botón dinámicamente o asegurarse de que existe

// --- FUNCIONES DE NIEVE (SIN CAMBIOS FUNCIONALES MAYORES) ---

function createSnow() {
    const container = document.getElementById('snow-container');
    const isMobile = window.innerWidth <= 768;
    const snowflakeCount = isMobile ? 60 : 150;
    const snowflakeCharacters = ['❄', '❅', '❆', '*'];
    
    container.innerHTML = '';
    snowflakes = [];
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        const character = snowflakeCharacters[Math.floor(Math.random() * snowflakeCharacters.length)];
        snowflake.innerHTML = character;
        
        const size = isMobile ? 
            (Math.random() * 1.0 + 0.5) : 
            (Math.random() * 1.5 + 0.5);
        snowflake.style.fontSize = `${size}em`;
        
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.top = `${Math.random() * -20}%`;
        
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        
        container.appendChild(snowflake);
        
        snowflakes.push({
            element: snowflake,
            speed: isMobile ? 
                (Math.random() * 3 + 1.5) : 
                (Math.random() * 2 + 1),
            horizontalMovement: (Math.random() - 0.5) * (isMobile ? 0.8 : 1),
            sway: Math.random() * 2 + 1,
            swaySpeed: Math.random() * 0.02 + 0.01,
            posX: parseFloat(snowflake.style.left),
            posY: parseFloat(snowflake.style.top),
            swayOffset: Math.random() * Math.PI * 2,
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    animateSnow();
}

function animateSnow(currentTime = 0) {
    const deltaTime = currentTime - lastUpdateTime;
    
    if (deltaTime > updateInterval) {
        updateSnowflakes(deltaTime);
        lastUpdateTime = currentTime;
    }
    
    requestAnimationFrame(animateSnow);
}

function updateSnowflakes(deltaTime) {
    const timeFactor = deltaTime / 16;
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        
        if (snowflake.width !== currentWidth || snowflake.height !== currentHeight) {
            snowflake.width = currentWidth;
            snowflake.height = currentHeight;
        }
        
        snowflake.posY += snowflake.speed * timeFactor;
        snowflake.posX += snowflake.horizontalMovement * timeFactor;
        
        snowflake.swayOffset += snowflake.swaySpeed;
        snowflake.posX += Math.sin(snowflake.swayOffset) * snowflake.sway * 0.1 * timeFactor;
        
        if (snowflake.posY > currentHeight + 20) {
            snowflake.posY = -20;
            snowflake.posX = Math.random() * 100;
        }
        
        if (snowflake.posX < -5) snowflake.posX = 105;
        if (snowflake.posX > 105) snowflake.posX = -5;
        
        snowflake.element.style.transform = `translate3d(0, ${snowflake.posY}px, 0)`;
        snowflake.element.style.left = `${snowflake.posX}%`;
    }
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        lastUpdateTime = performance.now();
    }
});

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createSnow();
    }, 250);
});

// --- FUNCIONES DE CUENTA REGRESIVA SIMPLIFICADAS ---

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const openButton = document.getElementById('openButton');
    const giftHeader = document.querySelector('#giftSection h2');

    if (distance <= 0) {
        clearInterval(countdownInterval);
        if (openButton) {
            openButton.disabled = false;
            openButton.textContent = '¡Abrir Regalo!';
        }
        if (giftHeader) {
            giftHeader.textContent = '¡Ya está disponible! 🎉';
        }
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Asegurar que los elementos existen antes de actualizar
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

    if (openButton) {
        openButton.disabled = true; // Asegurarse de que esté deshabilitado mientras cuenta
        openButton.textContent = 'Esperando...';
    }
}

function setTargetDate() {
    // Establece la fecha objetivo. Usando la fecha original de ejemplo.
    // Diciembre 9, 2025 10:15:00 PM (hora local de la máquina del usuario)
    targetDate = new Date('December 13, 2025 22:30:00').getTime(); 
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// --- MANEJO DEL BOTÓN DE ABRIR (SIMPLIFICADO) ---

// El botón ahora solo inhabilita su estado y cambia el texto.
document.addEventListener('DOMContentLoaded', function() {
    createSnow();
    setTargetDate(); // Iniciar la cuenta regresiva inmediatamente
    
    const openButton = document.getElementById('openButton');
    const giftSection = document.getElementById('giftSection');
    const audio = document.getElementById('christmasMusic');

    if (openButton) {
        openButton.addEventListener('click', () => {
            openButton.disabled = true;
            openButton.textContent = "¡Regalo Abierto!";
            
            // Opcional: Cambiar el GIF, el mensaje, o redirigir
            const giftImage = document.querySelector('#giftSection .gift-image');
            if (giftImage) {
                 giftImage.src = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NjQzN2I2NTBhNmQ1MGY1NDM0OWZjM2I2NzgwZDY2M2RkZjc2MjBhZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BPJ6nK35n48Hl62g68/giphy.gif"; 
                 giftImage.alt = "GIF de un regalo abierto";
            }
            
            const countdownEl = document.querySelector('.countdown');
            if (countdownEl) {
                countdownEl.style.display = 'none'; // Ocultar el contador
            }

            const giftHeader = document.querySelector('#giftSection h2');
            if (giftHeader) {
                giftHeader.innerHTML = '¡Sorpresa revelada! 🥳';
            }

            // Aquí podrías agregar la lógica para mostrar el regalo real (un enlace, un mensaje final, etc.)
        });
    }

    function startMusic() {
        if (!audio) return;

        // 1. Intento inicial de reproducción (debe ser siempre silenciado para mayor compatibilidad)
        audio.muted = true;

        audio.play().then(() => {
            // Éxito: El navegador permitió la reproducción silenciada.
            // Ahora intentamos desmutear (puede fallar, pero la música ya está corriendo).
            audio.muted = false;
        }).catch(error => {
            // Falla: El navegador bloqueó el play() inicial (incluso silenciado).
            // Esto sucede en políticas muy estrictas donde se requiere el primer clic.
            console.warn('Autoplay bloqueado. Esperando interacción del usuario.', error);

            // 2. Esperar cualquier interacción (clic, toque) en el documento para reintentar
            document.body.addEventListener('click', function unmuteAndPlay() {
                
                // Primero, nos aseguramos de que el audio no esté pausado (aunque el autoplay falló)
                // y que esté en el punto de inicio.
                audio.muted = false;
                audio.currentTime = 0; // Opcional: Reiniciar el audio si se necesita
                
                audio.play().then(() => {
                    // Éxito: La música comienza después de la interacción del usuario.
                    console.log('Música iniciada/desmuteada por interacción del usuario.');
                }).catch(playError => {
                    console.error('Error al intentar reproducir después del clic:', playError);
                });

                // Remover este listener después de la primera interacción
                document.body.removeEventListener('click', unmuteAndPlay);
            }, { once: true }); 
        });
    }

    // Iniciar la música al cargar la página
    startMusic();
});


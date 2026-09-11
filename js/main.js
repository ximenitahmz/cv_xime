document.addEventListener('DOMContentLoaded', () => {
    const btnActivar = document.getElementById('btn-activar');
    const magnifier = document.getElementById('magic-magnifier');
    const closeMagnifier = document.getElementById('close-magnifier');
    const fondoImagen = document.getElementById('fondo-imagen-about');
    const lupaContenidoImg = magnifier ? magnifier.querySelector('.lupa-contenido-imagen') : null;
    const themeToggleBtn = document.getElementById('theme-toggle');

    // --- MODO CLARO / OSCURO (Protegido con if) ---
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            // Cambia el icono según el modo actual
            if (document.body.classList.contains('light-mode')) {
                themeToggleBtn.textContent = '☀️'; // Muestra sol si está en claro
            } else {
                themeToggleBtn.textContent = '🌙'; // Muestra luna si está en oscuro
            }
        });
    }

    // --- LÓGICA DE LA LUPA FOTOGRÁFICA ---
    if (btnActivar && magnifier && closeMagnifier && fondoImagen && lupaContenidoImg) {
        // Al activar la lupa, copiamos la imagen dentro del visor y mostramos el fondo
        btnActivar.addEventListener('click', () => {
            lupaContenidoImg.innerHTML = fondoImagen.innerHTML;
            fondoImagen.classList.remove('hidden');
            magnifier.classList.remove('hidden');
            btnActivar.style.display = 'none';
        });

        // Lógica de arrastre fluido de la lupa
        let isDragging = false;
        let startX, startY;
        let posX = 0, posY = 0;

        magnifier.addEventListener('mousedown', startDrag);
        magnifier.addEventListener('touchstart', startDrag);

        function startDrag(e) {
            if (e.target === closeMagnifier) return;
            
            isDragging = true;
            let clientX = e.clientX || e.touches[0].clientX;
            let clientY = e.clientY || e.touches[0].clientY;

            startX = clientX - posX;
            startY = clientY - posY;

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function onDrag(e) {
            if (!isDragging) return;
            let clientX = e.clientX || e.touches[0].clientX;
            let clientY = e.clientY || e.touches[0].clientY;

            posX = clientX - startX;
            posY = clientY - startY;

            // Mueve la lupa fluidamente en la pantalla
            magnifier.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px))`;
            
            // Factor de zoom interno al moverla
            const zoomFactor = 7; 
            lupaContenidoImg.style.transform = `translate(calc(-50% + ${-posX * zoomFactor}px), calc(-50% + ${-posY * zoomFactor}px))`;
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }

        // Cerrar la lupa correctamente y resetear posiciones
        closeMagnifier.addEventListener('click', () => {
            magnifier.classList.add('hidden');
            fondoImagen.classList.add('hidden');
            btnActivar.style.display = 'block';
            posX = 0;
            posY = 0;
            magnifier.style.transform = 'translate(-50%, -50%)';
            lupaContenidoImg.style.transform = 'translate(-50%, -50%)';
            lupaContenidoImg.innerHTML = '';
        });
    }
});

// --- FUNCIONES GLOBALES (Pestañas y Carruseles) ---
function switchTab(tabName, event) {
    // Ocultar todas las pestañas
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active-pane'));

    // Quitar la clase active de los botones
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostrar la pestaña seleccionada
    const targetPane = document.getElementById('tab-' + tabName);
    if (targetPane) {
        targetPane.classList.add('active-pane');
    }

    // Activar el botón correspondiente
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function scrollCarousel(carouselId, direction) {
    const container = document.getElementById(carouselId);
    if (container) {
        const scrollAmount = 430; // Ancho de la tarjeta + su gap
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    } else {
        console.error("No se encontró el carrusel con ID: " + carouselId);
    }
}
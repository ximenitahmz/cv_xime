document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       MODO CLARO / OSCURO
    ===================================================== */

    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {

            document.body.classList.toggle('light-mode');

            themeToggleBtn.textContent =
                document.body.classList.contains('light-mode')
                    ? '☀️'
                    : '🌙';
        });
    }


    /* =====================================================
       PESTAÑAS
    ===================================================== */

    const btnProyectos = document.querySelector('.tab-btn');
    const paneProyectos = document.getElementById('tab-proyectos');
    const paneCertificados = document.getElementById('tab-certificados');

    if (paneProyectos && paneCertificados) {

        paneCertificados.classList.remove('active-pane');
        paneProyectos.classList.add('active-pane');

    }

    if (btnProyectos) {

        document.querySelectorAll('.tab-btn')
            .forEach(btn => btn.classList.remove('active'));

        btnProyectos.classList.add('active');

    }


    /* =====================================================
       LUPA FOTOGRÁFICA
    ===================================================== */

    const btnActivar = document.getElementById('btn-activar');
    const magnifier = document.getElementById('magic-magnifier');
    const closeMagnifier = document.getElementById('close-magnifier');

    const fondoImagen =
        document.getElementById('fondo-imagen-about');

    const lupaContenidoImg =
        magnifier
            ? magnifier.querySelector('.lupa-contenido-imagen')
            : null;


    /*
       Comprobamos que todos los elementos existan
    */

    if (
        btnActivar &&
        magnifier &&
        closeMagnifier &&
        fondoImagen &&
        lupaContenidoImg
    ) {


        /* =================================================
           BOTÓN ACTIVAR LUPA
        ================================================= */

        btnActivar.addEventListener('click', () => {

            /*
               Copiamos la imagen secreta dentro de la lupa
            */

            lupaContenidoImg.innerHTML =
                fondoImagen.innerHTML;


            /*
               Mostramos la lupa
            */

            magnifier.classList.remove('hidden');


            /*
               Ocultamos la imagen secreta original
            */

            fondoImagen.classList.add('hidden');


            /*
               Ocultamos el botón
            */

            btnActivar.style.display = 'flex' ;


            /*
               Reiniciamos la posición
            */

            posX = 0;
            posY = 0;

            magnifier.style.transform =
                'translate(-50%, -50%)';

            lupaContenidoImg.style.transform =
                'translate(-50%, -50%)';

        });


        /* =================================================
           ARRASTRAR LA LUPA
        ================================================= */

        let isDragging = false;

        let startX = 0;
        let startY = 0;

        let posX = 0;
        let posY = 0;


        magnifier.addEventListener(
            'mousedown',
            startDrag
        );

        magnifier.addEventListener(
            'touchstart',
            startDrag,
            { passive: false }
        );


        function startDrag(e) {

            /*
               Si se presiona el botón X no arrastramos
            */

            if (e.target === closeMagnifier) {
                return;
            }

            e.preventDefault();

            isDragging = true;


            const clientX =
                e.clientX !== undefined
                    ? e.clientX
                    : e.touches[0].clientX;

            const clientY =
                e.clientY !== undefined
                    ? e.clientY
                    : e.touches[0].clientY;


            startX = clientX - posX;
            startY = clientY - posY;


            document.addEventListener(
                'mousemove',
                onDrag
            );

            document.addEventListener(
                'touchmove',
                onDrag,
                { passive: false }
            );

            document.addEventListener(
                'mouseup',
                stopDrag
            );

            document.addEventListener(
                'touchend',
                stopDrag
            );
        }


        function onDrag(e) {

            if (!isDragging) {
                return;
            }

            e.preventDefault();


            const clientX =
                e.clientX !== undefined
                    ? e.clientX
                    : e.touches[0].clientX;

            const clientY =
                e.clientY !== undefined
                    ? e.clientY
                    : e.touches[0].clientY;


            posX = clientX - startX;
            posY = clientY - startY;


            /*
               Movemos la lupa
            */

            magnifier.style.transform =
                `translate(
                    calc(-50% + ${posX}px),
                    calc(-50% + ${posY}px)
                )`;


            /*
               Movemos la imagen dentro de la lupa
               para crear el efecto de zoom
            */

            const zoomFactor = 4;


            lupaContenidoImg.style.transform =
                `translate(
                    calc(-50% + ${-posX * zoomFactor}px),
                    calc(-50% + ${-posY * zoomFactor}px)
                )`;
        }


        function stopDrag() {

            isDragging = false;


            document.removeEventListener(
                'mousemove',
                onDrag
            );

            document.removeEventListener(
                'touchmove',
                onDrag
            );

            document.removeEventListener(
                'mouseup',
                stopDrag
            );

            document.removeEventListener(
                'touchend',
                stopDrag
            );
        }


        /* =================================================
           CERRAR LUPA
        ================================================= */

        closeMagnifier.addEventListener(
            'click',
            () => {

                magnifier.classList.add('hidden');

                fondoImagen.classList.add('hidden');


                /*
                   Volvemos a mostrar el botón
                */

                btnActivar.style.display = 'flex';


                /*
                   Reiniciamos posición
                */

                posX = 0;
                posY = 0;


                magnifier.style.transform =
                    'translate(-50%, -50%)';


                lupaContenidoImg.style.transform =
                    'translate(-50%, -50%)';


                /*
                   Limpiamos la imagen de la lupa
                */

                lupaContenidoImg.innerHTML = '';

            }
        );

    } else {

        console.warn(
            'No se encontraron todos los elementos necesarios para la lupa.'
        );

    }

});


/* =========================================================
   CAMBIO DE PESTAÑAS
========================================================= */

function switchTab(tabName, event) {

    document
        .querySelectorAll('.tab-pane')
        .forEach(pane => {
            pane.classList.remove('active-pane');
        });


    document
        .querySelectorAll('.tab-btn')
        .forEach(btn => {
            btn.classList.remove('active');
        });


    const targetPane =
        document.getElementById(
            'tab-' + tabName
        );


    if (targetPane) {
        targetPane.classList.add('active-pane');
    }


    /*
       Como tus botones usan onclick="switchTab(...)"
       buscamos el botón correspondiente.
    */

    const buttons =
        document.querySelectorAll('.tab-btn');


    buttons.forEach(button => {

        const texto =
            button.textContent.trim().toLowerCase();


        if (
            (tabName === 'proyectos' &&
             texto.includes('programas')) ||

            (tabName === 'certificados' &&
             texto.includes('certificados'))
        ) {

            button.classList.add('active');

        }

    });

}


/* =========================================================
   CARRUSEL
========================================================= */

const carouselIndexes = {};


function scrollCarousel(carouselId, direction) {

    const container =
        document.getElementById(carouselId);


    if (!container) {
        return;
    }


    const cards =
        container.querySelectorAll('.cert-card');


    if (!cards.length) {
        return;
    }


    if (
        carouselIndexes[carouselId] === undefined
    ) {

        carouselIndexes[carouselId] = 0;

    }


    let currentIndex =
        carouselIndexes[carouselId] + direction;


    if (currentIndex < 0) {

        currentIndex =
            cards.length - 1;

    }


    if (currentIndex >= cards.length) {

        currentIndex = 0;

    }


    carouselIndexes[carouselId] =
        currentIndex;


    cards.forEach(card => {

        card.classList.remove(
            'active-card'
        );

    });


    cards[currentIndex]
        .classList.add('active-card');


    cards[currentIndex]
        .scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });

}


/* =========================================================
   MODAL DE CERTIFICADOS
========================================================= */

function abrirModal(srcImagen) {

    const modal =
        document.getElementById(
            'modalCertificado'
        );


    const imgModal =
        document.getElementById(
            'imgModal'
        );


    if (modal && imgModal) {

        imgModal.src = srcImagen;

        modal.style.display = 'flex';

    }

}


function cerrarModal() {

    const modal =
        document.getElementById(
            'modalCertificado'
        );


    if (modal) {

        modal.style.display = 'none';

    }

}
document.addEventListener('DOMContentLoaded', () => {
    cargarEventosPorCategoria();

    window.addEventListener('hashchange', () => {
        cargarEventosPorCategoria();
    });
});

async function cargarEventosPorCategoria() {
    try {
        const response = await fetch('api/eventos');
        if (!response.ok) throw new Error('Error al obtener los eventos del servidor.');

        const eventos = await response.json();

        // Ordenar por fecha ascendente (el evento más próximo primero)
        eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        let hash = window.location.hash;
        if (!hash || hash === '#esta-semana') {
            hash = '#musica-en-vivo';
        }

        actualizarMenuActivo(hash);
        renderizarCategoria(hash, eventos);

    } catch (error) {
        console.error('Error:', error);
        document.querySelector('main').innerHTML = `
            <div style="color: #ff4444; text-align: center; padding: 60px 20px;">
                <h2>Error al cargar la categoría</h2>
                <p>${error.message}</p>
            </div>`;
    }
}

function actualizarMenuActivo(hashActivo) {
    const enlaces = document.querySelectorAll('.menu-principal a');
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute('href');
        if (href && href.endsWith(hashActivo)) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
}

function renderizarCategoria(hash, eventos) {
    const mainTextContainer = document.getElementById('mainEventsTextContainer');
    const mainList = document.getElementById('mainEventsBodyList');
    const weekContainer = document.getElementById('EventsWeekContainer');

    // Ocultamos la sección antigua si existiera en el HTML para evitar duplicidades
    if (weekContainer) weekContainer.style.display = 'none';

    mainList.innerHTML = '';

    const configCategorias = {
        '#musica-en-vivo': {
            dbValue: 'Musica en vivo',
            badge: 'LIVE MUSIC',
            titulo: 'Música en vivo',
            subtitulo: 'Conciertos íntimos, indie, jazz, neo-soul y sesiones nocturnas en las mejores salas de Madrid.'
        },
        '#dj-sets': {
            dbValue: 'DJ sets',
            badge: 'DJ SETS & CLUBS',
            titulo: 'DJ sets y clubs',
            subtitulo: 'Electrónica, synthwave, house y pistas de baile underground hasta altas horas.'
        },
        '#pop-ups': {
            dbValue: 'Pop-ups',
            badge: 'POP-UPS & MARKETS',
            titulo: 'Pop-ups',
            subtitulo: 'Mercadillos efímeros, diseño independiente, vinilos y cultura urbana local.'
        },
        '#arte': {
            dbValue: 'Arte',
            badge: 'ART & PERFORMANCE',
            titulo: 'Arte y performance',
            subtitulo: 'Exposiciones inmersivas, instalaciones visuales y propuestas escénicas alternativas.'
        }
    };

    const catInfo = configCategorias[hash] || configCategorias['#musica-en-vivo'];
    const eventosCat = eventos.filter(e => e.categoria === catInfo.dbValue);

    const totalEventos = eventosCat.length;
    const salasUnicas = new Set(eventosCat.map(e => e.ubicacion.split(',')[0].trim())).size;

    // 1. Cabecera editorial superior con contadores
    mainTextContainer.innerHTML = `
        <div class="mnn-hero-header">
            <div class="mnn-hero-left">
                <div class="mnn-kicker-row">
                    <span class="mnn-badge-neon">${catInfo.badge}</span>
                    <span class="mnn-kicker-meta">MADRID · CARTELERA ACTIVA</span>
                </div>
                <h1 class="MainEventstitle mnn-page-title">${catInfo.titulo}</h1>
                <p class="mnn-page-subtitle">${catInfo.subtitulo}</p>
            </div>
            <div class="mnn-stats-grid">
                <div class="mnn-stat-box">
                    <span class="mnn-stat-label">EVENTOS</span>
                    <span class="mnn-stat-value">${totalEventos}</span>
                </div>
                <div class="mnn-stat-box">
                    <span class="mnn-stat-label">ESPACIOS</span>
                    <span class="mnn-stat-value">${salasUnicas}</span>
                </div>
            </div>
        </div>
        <div class="mnn-section-header">
            <div>
                <span class="mnn-section-kicker">${catInfo.badge} LISTINGS</span>
                <h2>Todos los eventos de ${catInfo.titulo}</h2>
            </div>
            <span class="mnn-section-count">${totalEventos} ${totalEventos === 1 ? 'evento' : 'eventos'}</span>
        </div>
    `;

    if (eventosCat.length === 0) {
        mainList.innerHTML = '<li class="mnn-empty-state">No hay eventos próximos programados en esta categoría.</li>';
        return;
    }

    // 2. Listado unificado en cuadrícula con el formato exacto aprobado
    mainList.className = 'mnn-uniform-grid';

    eventosCat.forEach((evento, index) => {
        const esElMasProximo = (index === 0);
        mainList.appendChild(crearTarjetaFormatoUnico(evento, esElMasProximo));
    });
}

function crearTarjetaFormatoUnico(evento, esElMasProximo) {
    const li = document.createElement('li');
    li.className = 'mnn-featured-card';
    li.addEventListener('click', () => {
        window.location.href = `detail.html?id=${evento.id}`;
    });

    const precioTexto = Number(evento.precio) === 0 ? 'Gratis' : `Desde ${Number(evento.precio).toFixed(0)} €`;
    const badgeTexto = esElMasProximo ? `${evento.categoria.toUpperCase()} · PRÓXIMO` : evento.categoria.toUpperCase();
    const imagenUrl = evento.foto1 || 'images/logo-MNN.jpg';

    li.innerHTML = `
        <div class="mnn-featured-img-wrap">
            <img src="${imagenUrl}" alt="${evento.titulo}" loading="lazy">
        </div>
        <div class="mnn-featured-body">
            <div class="mnn-card-top-row">
                <span class="mnn-badge-neon">${badgeTexto}</span>
                <span class="mnn-price-tag">${precioTexto}</span>
            </div>
            <h3 class="mnn-card-title">${evento.titulo}</h3>
            <p class="mnn-card-desc">${evento.descripcion}</p>
            <div class="mnn-card-meta-grid">
                <div>
                    <span class="mnn-meta-label">CUÁNDO</span>
                    <span class="mnn-meta-val">${formatearFechaEditorial(evento.fecha)}</span>
                </div>
                <div>
                    <span class="mnn-meta-label">DÓNDE</span>
                    <span class="mnn-meta-val">${evento.ubicacion}</span>
                </div>
            </div>
        </div>
    `;
    return li;
}

function formatearFechaEditorial(fechaStr) {
    if (!fechaStr) return 'Fecha por confirmar';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;

    const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return `${dias[fecha.getDay()]} ${partes[2]} ${meses[fecha.getMonth()]} · ${partes[0]}`;
}
document.addEventListener('DOMContentLoaded', () => {
    inyectarEstilosCatalogo();
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

    // Ocultamos la sección inferior independiente para unificar todo en un único listado limpio en grid
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
        <div class="mnn-section-header" style="margin-top: 30px;">
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

    // 2. Listado unificado en cuadrícula (2 por fila en PC, 1 por fila en móvil) con el formato exacto de la foto
    mainList.className = 'mnn-uniform-grid';

    eventosCat.forEach((evento, index) => {
        // Al primer evento de la lista le indicamos que es el próximo para darle relieve en el distintivo neón
        const esElMasProximo = (index === 0);
        mainList.appendChild(crearTarjetaFormatoUnico(evento, esElMasProximo));
    });
}

/**
 * Crea la tarjeta idéntica al diseño aprobado de la imagen.
 */
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

function inyectarEstilosCatalogo() {
    if (document.getElementById('mnn-catalog-styles')) return;
    const style = document.createElement('style');
    style.id = 'mnn-catalog-styles';
    style.textContent = `
        #mainEventsContainer {
            max-width: 1240px;
            margin: 0 auto;
            padding: 20px 24px;
        }
        .mnn-hero-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 24px;
            padding: 24px 0 32px;
            border-bottom: 1px solid #222;
        }
        .mnn-kicker-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .mnn-badge-neon {
            background-color: #ccff00;
            color: #0a0a0a;
            font-weight: 800;
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            padding: 3px 8px;
            border-radius: 3px;
            text-transform: uppercase;
            display: inline-block;
        }
        .mnn-kicker-meta {
            color: #888;
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .mnn-page-title {
            font-size: clamp(2.2rem, 4vw, 3.4rem);
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 10px 0;
            line-height: 1.05;
        }
        .mnn-page-subtitle {
            color: #9e9e9e;
            max-width: 560px;
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 0;
        }
        .mnn-stats-grid {
            display: flex;
            gap: 12px;
        }
        .mnn-stat-box {
            background: #141414;
            border: 1px solid #262626;
            border-radius: 8px;
            padding: 14px 22px;
            min-width: 110px;
        }
        .mnn-stat-label {
            display: block;
            font-size: 0.65rem;
            color: #777;
            letter-spacing: 0.08em;
            margin-bottom: 6px;
        }
        .mnn-stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
        }

        /* CUADRICULA UNIFORME: 2 columnas en ordenador, 1 en móvil */
        .mnn-uniform-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            list-style: none;
            padding: 0;
            margin: 0 0 40px 0;
        }
        @media (max-width: 768px) {
            .mnn-uniform-grid {
                grid-template-columns: 1fr;
            }
        }

        .mnn-featured-card {
            background: #141414;
            border: 1px solid #242424;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s ease, border-color 0.2s ease;
            display: flex;
            flex-direction: column;
        }
        .mnn-featured-card:hover {
            border-color: #ccff00;
            transform: translateY(-2px);
        }
        .mnn-featured-img-wrap {
            width: 100%;
            height: 290px;
            overflow: hidden;
            background: #1c1c1c;
        }
        .mnn-featured-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.35s ease;
        }
        .mnn-featured-card:hover .mnn-featured-img-wrap img {
            transform: scale(1.04);
        }
        .mnn-featured-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .mnn-card-top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .mnn-price-tag {
            color: #888;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .mnn-card-title {
            font-size: 1.45rem;
            font-weight: 700;
            color: #fff;
            margin: 0 0 8px 0;
        }
        .mnn-card-desc {
            color: #9e9e9e;
            font-size: 0.88rem;
            line-height: 1.45;
            margin: 0 0 18px 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .mnn-card-meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #222;
        }
        .mnn-meta-label {
            display: block;
            font-size: 0.65rem;
            color: #666;
            letter-spacing: 0.08em;
            margin-bottom: 3px;
        }
        .mnn-meta-val {
            font-size: 0.82rem;
            color: #d4d4d4;
        }

        /* Cabecera de sección */
        .mnn-section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 20px;
        }
        .mnn-section-kicker {
            display: block;
            font-size: 0.7rem;
            color: #777;
            letter-spacing: 0.08em;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .mnn-section-header h2 {
            font-size: 1.75rem;
            font-weight: 800;
            color: #fff;
            margin: 0;
        }
        .mnn-section-count {
            color: #777;
            font-size: 0.82rem;
        }
        .mnn-empty-state {
            background: #141414;
            border: 1px dashed #333;
            color: #888;
            padding: 40px;
            text-align: center;
            border-radius: 10px;
            list-style: none;
            grid-column: 1 / -1;
        }
    `;
    document.head.appendChild(style);
}
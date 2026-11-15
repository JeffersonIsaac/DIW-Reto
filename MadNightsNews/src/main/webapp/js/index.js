document.addEventListener('DOMContentLoaded', () => {
    cargarEventosIndex();
});

async function cargarEventosIndex() {
    try {
        const response = await fetch('api/eventos');
        if (!response.ok) throw new Error('Error al obtener los eventos del servidor.');

        const eventos = await response.json();

        // Ordenar por fecha ascendente (los eventos más próximos primero)
        eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        renderizarIndex(eventos);

    } catch (error) {
        console.error('Error:', error);
        const contenedor = document.getElementById('eventListContainer');
        if (contenedor) {
            contenedor.innerHTML = `<li class="mnn-empty-state" style="color: #ff4444;">Error al cargar la cartelera: ${error.message}</li>`;
        }
    }
}

function renderizarIndex(eventos) {
    // 1. Calcular y mostrar la fecha actual o el rango de la semana en #fechaSemanaActual
    const spanFecha = document.getElementById('fechaSemanaActual');
    if (spanFecha) {
        const hoy = new Date();
        const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
        spanFecha.textContent = `Actualizado a ${hoy.toLocaleDateString('es-ES', opciones)}`;
    }

    // 2. Renderizar la lista principal de la semana en #eventListContainer
    const eventListContainer = document.getElementById('eventListContainer');
    if (eventListContainer) {
        eventListContainer.innerHTML = '';
        eventListContainer.className = 'mnn-uniform-grid'; // Aplicamos tu cuadrícula de 2 columnas

        if (!eventos || eventos.length === 0) {
            eventListContainer.innerHTML = '<li class="mnn-empty-state">No hay eventos registrados actualmente.</li>';
        } else {
            eventos.forEach((evento, index) => {
                eventListContainer.appendChild(crearTarjetaIndex(evento, index === 0));
            });
        }
    }

    // 3. Renderizar bloques por categorías en #DisplayEventsPerCategory (máx 3 por categoría con enlace a catalog.html)
    const displayPerCategory = document.getElementById('DisplayEventsPerCategory');
    if (displayPerCategory) {
        displayPerCategory.innerHTML = '';

        const configCategorias = [
            { dbValue: 'Musica en vivo', badge: 'LIVE MUSIC', titulo: 'Música en vivo', hash: '#musica-en-vivo' },
            { dbValue: 'DJ sets', badge: 'DJ SETS & CLUBS', titulo: 'DJ sets y clubs', hash: '#dj-sets' },
            { dbValue: 'Pop-ups', badge: 'POP-UPS & MARKETS', titulo: 'Pop-ups', hash: '#pop-ups' },
            { dbValue: 'Arte', badge: 'ART & PERFORMANCE', titulo: 'Arte y performance', hash: '#arte' }
        ];

        configCategorias.forEach(cat => {
            const eventosCat = eventos.filter(e => e.categoria === cat.dbValue);
            if (eventosCat.length === 0) return;

            const catSection = document.createElement('div');
            catSection.className = 'mnn-home-category-block';
            catSection.style.marginBottom = '50px';

            catSection.innerHTML = `
                <div class="mnn-section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding: 0 24px;">
                    <div>
                        <span class="mnn-section-kicker" style="display: block; font-size: 0.7rem; color: #777; letter-spacing: 0.08em; margin-bottom: 4px; text-transform: uppercase;">${cat.badge}</span>
                        <h2 style="font-size: 1.75rem; font-weight: 800; color: #fff; margin: 0;">${cat.titulo}</h2>
                    </div>
                    <a href="catalog.html${cat.hash}" class="mnn-ver-mas-btn" style="color: #ccff00; text-decoration: none; font-size: 0.88rem; font-weight: 700; border: 1px solid #333; padding: 8px 16px; border-radius: 6px;">
                        Ver cartelera completa (${eventosCat.length}) &rarr;
                    </a>
                </div>
            `;

            const ulCat = document.createElement('ul');
            ulCat.className = 'mnn-uniform-grid';
            ulCat.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; list-style: none; padding: 0 24px; margin: 0;';

            // Máximo 3 eventos por categoría en el Index
            eventosCat.slice(0, 3).forEach(evento => {
                ulCat.appendChild(crearTarjetaIndex(evento, false));
            });

            catSection.appendChild(ulCat);
            displayPerCategory.appendChild(catSection);
        });
    }

    inyectarEstilosIndexExtra();
}

function crearTarjetaIndex(evento, esElMasProximo) {
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

function inyectarEstilosIndexExtra() {
    if (document.getElementById('mnn-index-extra-styles')) return;
    const style = document.createElement('style');
    style.id = 'mnn-index-extra-styles';
    style.textContent = `
        #DisplayEventsWeek {
            max-width: 1240px;
            margin: 0 auto;
            padding: 20px 24px;
        }
        .mnn-uniform-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            list-style: none;
            padding: 0 24px;
            margin: 0 0 40px 0;
        }
        @media (max-width: 768px) {
            .mnn-uniform-grid {
                grid-template-columns: 1fr;
                padding: 0 16px;
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
        .mnn-ver-mas-btn:hover {
            background: #ccff00;
            color: #0a0a0a;
            border-color: #ccff00;
        }
    `;
    document.head.appendChild(style);
}
document.addEventListener('DOMContentLoaded', () => {
    inyectarEstilosDetail();
    cargarDetalleEvento();
});

async function cargarDetalleEvento() {
    // 1. Obtener el ID de los parámetros de la URL (ej: ?id=3)
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
        mostrarError("No se ha especificado ningún evento.");
        return;
    }

    try {
        const response = await fetch('api/eventos');
        if (!response.ok) throw new Error('Error al conectar con el servidor.');

        const eventos = await response.json();

        // Buscamos el evento que coincide con el ID
        const evento = eventos.find(e => String(e.id) === String(eventId));

        if (!evento) {
            mostrarError("El evento solicitado no existe o ha sido eliminado.");
            return;
        }

        renderizarDetalle(evento);

    } catch (error) {
        console.error('Error:', error);
        mostrarError("Error al cargar los datos del evento.");
    }
}

function renderizarDetalle(evento) {
    // Título y descripción superior
    const tituloEl = document.querySelector('.tituloEvento');
    const descEl = document.getElementById('descriptionEvent');

    if (tituloEl) tituloEl.textContent = evento.titulo;
    if (descEl) descEl.textContent = evento.descripcion;

    // Contenedor de Imágenes (Foto principal y secundarias si las hay)
    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
        imageContainer.innerHTML = '';

        const mainImg = document.createElement('div');
        mainImg.className = 'detail-main-img';
        mainImg.innerHTML = `<img src="${evento.foto1 || 'images/logo-MNN.jpg'}" alt="${evento.titulo}">`;
        imageContainer.appendChild(mainImg);

        // Si hay foto2 o foto3, creamos una pequeña galería inferior
        if (evento.foto2 || evento.foto3) {
            const gallery = document.createElement('div');
            gallery.className = 'detail-gallery';

            if (evento.foto2) {
                gallery.innerHTML += `<div class="detail-thumb"><img src="${evento.foto2}" alt="Foto adicional 2"></div>`;
            }
            if (evento.foto3) {
                gallery.innerHTML += `<div class="detail-thumb"><img src="${evento.foto3}" alt="Foto adicional 3"></div>`;
            }
            imageContainer.appendChild(gallery);
        }
    }

    // Contenedor de Detalles Prácticos (Campos del formulario)
    const detailsContainer = document.getElementById('detailsContainer');
    if (detailsContainer) {
        const precioTexto = Number(evento.precio) === 0 ? 'Gratis' : `${Number(evento.precio).toFixed(2)} €`;

        detailsContainer.innerHTML = `
            <div class="detail-card-box">
                <div class="detail-box-top">
                    <span class="mnn-badge-neon">${evento.categoria.toUpperCase()}</span>
                    <span class="detail-price-highlight">${precioTexto}</span>
                </div>
                
                <h3 class="detail-info-title">${evento.titulo}</h3>
                <p class="detail-venue">${evento.ubicacion}</p>
                
                <div class="detail-practical-section">
                    <h4>PRACTICAL DETAILS</h4>
                    <ul class="detail-practical-list">
                        <li><span>Cuándo (Fecha)</span> <strong>${formatearFechaEditorial(evento.fecha)}</strong></li>
                        <li><span>Ubicación</span> <strong>${evento.ubicacion}</strong></li>
                        <li><span>Categoría</span> <strong>${evento.categoria}</strong></li>
                        <li><span>Precio</span> <strong>${precioTexto}</strong></li>
                    </ul>
                </div>

                <div class="detail-action-row">
                    <a href="catalog.html" class="detail-back-btn">&larr; Volver al catálogo</a>
                </div>
            </div>
        `;
    }
}

function mostrarError(mensaje) {
    const mainContainer = document.getElementById('detailMainContainer');
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div style="text-align: center; padding: 80px 20px; color: #ff4444;">
                <h2>Aviso</h2>
                <p>${mensaje}</p>
                <br>
                <a href="index.html" class="detail-back-btn" style="display:inline-block; padding: 10px 20px;">Volver al inicio</a>
            </div>
        `;
    }
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

function inyectarEstilosDetail() {
    if (document.getElementById('mnn-detail-styles')) return;
    const style = document.createElement('style');
    style.id = 'mnn-detail-styles';
    style.textContent = `
        #detailMainContainer {
            max-width: 1240px;
            margin: 0 auto;
            padding: 40px 24px;
        }
        .detail-hero-header {
            margin-bottom: 32px;
            border-bottom: 1px solid #222;
            padding-bottom: 24px;
        }
        .mnn-kicker-meta {
            color: #888;
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            display: block;
            margin-bottom: 8px;
        }
        .tituloEvento {
            font-size: clamp(2rem, 4vw, 3.2rem);
            font-weight: 800;
            color: #fff;
            margin: 0 0 12px 0;
            line-height: 1.1;
        }
        #descriptionEvent {
            color: #aaa;
            font-size: 1.05rem;
            line-height: 1.5;
            max-width: 800px;
            margin: 0;
        }
        .detail-content-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 36px;
            align-items: start;
        }
        @media (max-width: 900px) {
            .detail-content-grid {
                grid-template-columns: 1fr;
            }
        }
        .detail-main-img {
            width: 100%;
            height: 440px;
            border-radius: 12px;
            overflow: hidden;
            background: #141414;
            border: 1px solid #242424;
            margin-bottom: 16px;
        }
        .detail-main-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .detail-gallery {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .detail-thumb {
            height: 140px;
            border-radius: 8px;
            overflow: hidden;
            background: #141414;
            border: 1px solid #242424;
        }
        .detail-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .detail-card-box {
            background: #141414;
            border: 1px solid #242424;
            border-radius: 12px;
            padding: 30px;
        }
        .detail-box-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .mnn-badge-neon {
            background-color: #ccff00;
            color: #0a0a0a;
            font-weight: 800;
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .detail-price-highlight {
            color: #fff;
            font-weight: 700;
            font-size: 0.95rem;
        }
        .detail-info-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            margin: 0 0 6px 0;
        }
        .detail-venue {
            color: #888;
            font-size: 0.9rem;
            margin: 0 0 24px 0;
            padding-bottom: 20px;
            border-bottom: 1px solid #222;
        }
        .detail-practical-section h4 {
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: #666;
            margin: 0 0 14px 0;
            text-transform: uppercase;
        }
        .detail-practical-list {
            list-style: none;
            padding: 0;
            margin: 0 0 24px 0;
        }
        .detail-practical-list li {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #1c1c1c;
            font-size: 0.9rem;
        }
        .detail-practical-list li span {
            color: #888;
        }
        .detail-practical-list li strong {
            color: #fff;
            text-align: right;
        }
        .detail-back-btn {
            display: inline-block;
            color: #ccff00;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9rem;
            border: 1px solid #333;
            padding: 10px 18px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .detail-back-btn:hover {
            background: #ccff00;
            color: #0a0a0a;
            border-color: #ccff00;
        }
    `;
    document.head.appendChild(style);
}
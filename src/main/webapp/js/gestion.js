document.addEventListener('DOMContentLoaded', () => {
    cargarTablaEventos();

    const form = document.getElementById('eventForm');
    if (form) {
        form.addEventListener('submit', manejarEnvioFormulario);
    }
});

//el GET
async function cargarTablaEventos() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6">Cargando registros...</td></tr>'; // Estado de carga

    try {

        const response = await fetch('api/eventos');
        
        if (!response.ok) throw new Error('Error al recuperar los datos del servidor.');

        const eventos = await response.json();
        tbody.innerHTML = '';

        if (!eventos || eventos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No existen registros almacenados.</td></tr>'; // Estado vacío[cite: 17]
            return;
        }

        eventos.forEach(evento => {
            const tr = document.createElement('tr');

            // Creamos las celdas de forma segura con textContent
            const tdId = document.createElement('td');
            tdId.textContent = evento.id;

            const tdFoto = document.createElement('td');
            if (evento.foto1) {
                const img = document.createElement('img');
                img.src = evento.foto1;
                img.alt = evento.titulo;
                img.style.width = '60px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                tdFoto.appendChild(img);
            } else {
                tdFoto.textContent = 'Sin imagen';
            }

            const tdInfo = document.createElement('td');
            const h4 = document.createElement('strong');
            h4.textContent = evento.titulo;
            const pDesc = document.createElement('p');
            pDesc.textContent = evento.descripcion;
            pDesc.style.fontSize = '0.85rem';
            pDesc.style.color = '#aaa';
            tdInfo.appendChild(h4);
            tdInfo.appendChild(pDesc);

            const tdCat = document.createElement('td');
            tdCat.textContent = evento.categoria;

            const tdFechaUbi = document.createElement('td');
            tdFechaUbi.textContent = `${evento.fecha} - ${evento.ubicacion}`;

            const tdPrecio = document.createElement('td');
            tdPrecio.textContent = Number(evento.precio) === 0 ? 'Gratis' : `${evento.precio} €`;

            tr.appendChild(tdId);
            tr.appendChild(tdFoto);
            tr.appendChild(tdInfo);
            tr.appendChild(tdCat);
            tr.appendChild(tdFechaUbi);
            tr.appendChild(tdPrecio);

            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="color: #ff4444;">Error: ${error.message}</td></tr>`;
    }
}

// Envio el formulario por AJAX (POST)
async function manejarEnvioFormulario(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('btnSubmit');
    const messageDiv = document.getElementById('formMessage');

    const nuevoEvento = {
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria').value,
        fecha: document.getElementById('fecha').value,
        ubicacion: document.getElementById('ubicacion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        descripcion: document.getElementById('descripcion').value.trim(),
        foto1: document.getElementById('foto1').value.trim(),
        foto2: document.getElementById('foto2').value.trim() || '',
        foto3: document.getElementById('foto3').value.trim() || ''
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    messageDiv.textContent = '';

    try {

        const response = await fetch('api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(nuevoEvento)
        });

        // Verifico si la respuesta es JSON 
        const contentType = response.headers.get("content-type");
        let resultado = {};
        if (contentType && contentType.includes("application/json")) {
            resultado = await response.json();
        } else {
            throw new Error("El servidor no devolvió una respuesta JSON válida.");
        }

        if (response.ok) {
            messageDiv.textContent = '¡Evento guardado con éxito!';
            messageDiv.style.color = '#ccff00';
            
            form.reset(); // Limpia el formulario
            cargarTablaEventos(); // Refresco inmediato de la tabla sin recargar
        } else {
            throw new Error(resultado.error || 'No se pudo procesar el alta.');
        }

    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = '#ff4444';
        // Los datos introducidos se conservan si falla
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Evento';
    }
}
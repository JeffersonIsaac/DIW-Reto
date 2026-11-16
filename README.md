# 🌃 MadNightsNews — Agenda Cultural & Eventos Independientes de Madrid

**MadNightsNews** es una plataforma web *full-stack* dedicada a la difusión, consulta y gestión de eventos culturales alternativos e independientes en Madrid (música en vivo, sesiones de DJ y clubs, mercados *pop-up* y arte/performance).

---

## 🎯 1. Qué ofrece el sitio y a quién se dirige

### ¿Qué ofrece?
* **Cartelera Editorial Dinámica (`index.html`):** Muestra los próximos eventos destacados de la semana en Madrid y una vista previa organizada por categorías culturales.
* **Catálogo Filtrable por Categorías (`catalog.html`):** Permite explorar de forma asíncrona todos los eventos clasificados en *Música en vivo*, *DJ sets y clubs*, *Pop-ups* y *Arte*, ordenados cronológicamente por proximidad.
* **Ficha Detallada del Evento (`detail.html`):** Vista individual con información práctica completa (fecha, ubicación, precio, descripción extendida y galería de hasta 3 fotografías).
* **Panel de Gestión y Publicación (`gestion.html`):** Formulario interactivo para dar de alta nuevos eventos culturales con validación en cliente y servidor, acompañado de una agenda en tiempo real de todos los registros almacenados en la base de datos.

### ¿A quién se dirige?
1. **Público general y asistentes culturales:** Jóvenes, amantes de la música independiente, escena *underground* y cultura alternativa en Madrid que buscan planes seleccionados fuera de los circuitos comerciales convencionales.
2. **Promotores, salas y artistas independientes:** Organizadores de eventos que necesitan un canal ágil para publicar y dar visibilidad a sus conciertos, sesiones o exposiciones.

---

## 🛠️ 2. Tecnologías y versiones utilizadas

| Capa | Tecnología | Versión recomendada / utilizada |
| :--- | :--- | :--- |
| **Lenguaje Backend** | Java (JDK) | Java 21 (LTS) / Java 17+ |
| **Servidor Web / Contenedor** | Apache Tomcat | Tomcat 10.1.x (Jakarta EE 10) |
| **API Backend** | Jakarta Servlet API (`jakarta.servlet`) | 6.0.0 |
| **Serialización JSON** | Google Gson | 2.10.1 |
| **Base de Datos** | MySQL Server | 8.0+ |
| **Driver JDBC** | MySQL Connector/J (`mysql-connector-j`) | 8.3.0+ |
| **Frontend** | HTML5, CSS3 (Grid / Flexbox) y JavaScript (ES6+ Fetch API) | Estándar moderno |
| **Gestión de Dependencias** | Apache Maven | 3.9+ |

---

## 🗄️ 3. Cómo crear y configurar la base de datos

1. Asegúrate de tener el servicio de **MySQL Server** iniciado en tu equipo local (puerto por defecto `3306`).
2. Accede a tu cliente MySQL (MySQL Workbench, DBeaver o consola) y ejecuta el siguiente script SQL para crear la base de datos y la tabla `eventos`:

```sql
CREATE DATABASE IF NOT EXISTS madnights_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE madnights_db;

CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    descripcion TEXT NOT NULL,
    foto1 VARCHAR(500) NOT NULL,
    foto2 VARCHAR(500) NULL,
    foto3 VARCHAR(500) NULL
);
```

*(Opcional)* Puedes insertar un registro inicial de comprobación:
```sql
INSERT INTO eventos (titulo, categoria, fecha, ubicacion, precio, descripcion, foto1)
VALUES (
    'Underground Synthwave Night',
    'Musica en vivo',
    '2026-06-20',
    'Sala Clamores, Madrid',
    12.00,
    'Una noche dedicada a los sonidos retro-futuristas y sintetizadores analógicos en pleno centro de Madrid.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
);
```

---

## 🔌 4. Cómo configurar la conexión desde Java

La conexión con MySQL se gestiona mediante JDBC en la clase de utilidad de conexión (por ejemplo, `ConexionDB.java` dentro del paquete `util` o `dao`).

1. Abre el archivo de configuración de conexión en `src/main/java/.../ConexionDB.java`.
2. Ajusta las constantes según tus credenciales locales de MySQL:

```java
private static final String URL = "jdbc:mysql://localhost:3306/madnights_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
private static final String USER = "root";       // Tu usuario de MySQL
private static final String PASSWORD = "";       // Tu contraseña de MySQL
```

3. Verifica que la dependencia del conector esté declarada en el archivo `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
```

---

## 🚀 5. Cómo compilar y desplegar la aplicación

### Opción A: Desde IntelliJ IDEA (Entorno de desarrollo)
1. Abre el proyecto en **IntelliJ IDEA** y espera a que Maven descargue las dependencias (`jakarta.servlet-api`, `gson`, `mysql-connector-j`).
2. Ve a **Run > Edit Configurations...** y añade un servidor **Tomcat Server (Local)** apuntando a tu instalación de Tomcat 10.1+.
3. En la pestaña **Deployment**, añade el artefacto `madnights:war exploded` y establece el **Application context** en `/` (raíz).
4. Pulsa **Run** (o `Shift + F10`) para compilar y levantar el servidor automáticamente.

### Opción B: Compilación manual con Maven (`.war`)
1. Abre una terminal en la raíz del proyecto (donde se ubica el `pom.xml`) y ejecuta:
   ```bash
   mvn clean package
   ```
2. Se generará el archivo `.war` dentro de la carpeta `target/`.
3. Copia ese archivo dentro de la carpeta `webapps/` de tu instalación de Apache Tomcat (renómbralo a `ROOT.war` si deseas desplegarlo en la ruta raíz) e inicia Tomcat mediante `bin/startup.bat` (Windows) o `bin/startup.sh` (Linux/macOS).

---

## 🌐 6. URLs de acceso al sitio

Una vez desplegada la aplicación en Tomcat (puerto `8080` por defecto), las vistas públicas y de gestión son accesibles desde:

* **Página Principal (Esta semana):** `http://localhost:8080/index.html`
* **Catálogo por Categorías:** `http://localhost:8080/catalog.html#musica-en-vivo`
* **Detalle de un Evento:** `http://localhost:8080/detail.html?id=1`
* **Panel de Gestión (Crear Evento):** `http://localhost:8080/gestion.html`

---

## 📡 7. Rutas del Servicio Web (API REST) y ejemplos de JSON

El backend expone una API RESTful implementada mediante Servlets bajo el mapeo `/api/eventos`, intercambiando información exclusivamente en formato `application/json`.

### 1. Obtener todos los eventos
* **Método:** `GET`
* **Ruta:** `/api/eventos`
* **Respuesta exitosa (`200 OK`):** Devuelve un array JSON con todos los eventos registrados en MySQL.

```json
[
  {
    "id": 1,
    "titulo": "Underground Synthwave Night",
    "categoria": "Musica en vivo",
    "fecha": "2026-06-20",
    "ubicacion": "Sala Clamores, Madrid",
    "precio": 12.0,
    "descripcion": "Una noche dedicada a los sonidos retro-futuristas y sintetizadores analógicos en pleno centro de Madrid.",
    "foto1": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "foto2": "",
    "foto3": ""
  },
  {
    "id": 2,
    "titulo": "Pop-Up Vintage Market Malasaña",
    "categoria": "Pop-ups",
    "fecha": "2026-06-25",
    "ubicacion": "Calle San Andrés 24, Madrid",
    "precio": 0.0,
    "descripcion": "Encuentra ropa de segunda mano exclusiva, vinilos y arte independiente de creadores locales madrileños.",
    "foto1": "https://images.unsplash.com/photo-1555529771-835f59fc5efe",
    "foto2": "",
    "foto3": ""
  }
]
```

### 2. Registrar un nuevo evento
* **Método:** `POST`
* **Ruta:** `/api/eventos`
* **Cabeceras requeridas:** `Content-Type: application/json`
* **Cuerpo de la petición (Request Body JSON):**

```json
{
  "titulo": "Exposición Inmersiva: Luces de Óxido",
  "categoria": "Arte",
  "fecha": "2026-07-01",
  "ubicacion": "Nave 16, Matadero Madrid",
  "precio": 5.50,
  "descripcion": "Performance artística experimental que explora la relación entre la arquitectura industrial y la tecnología moderna.",
  "foto1": "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
  "foto2": "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8",
  "foto3": ""
}
```

* **Respuestas posibles:**
  * `201 Created`: Evento validado e insertado correctamente en la base de datos. Devuelve confirmación en JSON.
  * `400 Bad Request`: Faltan campos obligatorios, el precio es negativo o el formato de datos es inválido.
  * `500 Internal Server Error`: Error de conexión o ejecución SQL en el servidor.

---

## 🧪 8. Cómo ejecutar las pruebas

### 1. Pruebas funcionales End-to-End (Interfaz Web)
1. **Alta de evento (`gestion.html`):**
   * Accede a `http://localhost:8080/gestion.html`.
   * Completa todos los campos obligatorios del formulario (título, categoría, fecha, ubicación, precio, descripción y URL de `foto1`) y pulsa **Guardar Evento**.
   * **Resultado esperado:** El formulario se limpia sin recargar la página con parámetros en la URL, aparece un mensaje de confirmación y el nuevo registro se renderiza inmediatamente en la tabla inferior *"Agenda de Eventos Registrados"*.
2. **Validación de formulario:**
   * Intenta enviar el formulario dejando campos requeridos vacíos o introduciendo un precio negativo.
   * **Resultado esperado:** El navegador y/o el backend bloquean el envío mostrando el aviso correspondiente.
3. **Filtrado y visualización (`index.html` y `catalog.html`):**
   * Navega a `index.html` y verifica que el nuevo evento aparece en el listado general y en su bloque de categoría correspondiente.
   * Pulsa en las pestañas del menú superior (*Música en vivo*, *DJ sets y clubs*, *Pop-ups*, *Arte*) y comprueba que `catalog.html` filtra dinámicamente los eventos sin recargar el documento.
4. **Vista de detalle (`detail.html`):**
   * Haz clic sobre la tarjeta de cualquier evento.
   * **Resultado esperado:** Redirige a `detail.html?id=<ID>` mostrando toda la información del evento, su precio formateado (`Gratis` si es `0`) y la galería de imágenes.

### 2. Pruebas de API REST (cURL / Postman)
Con el servidor Tomcat arrancado, puedes verificar directamente el endpoint desde una terminal:

* **Probar lectura (`GET`):**
  ```bash
  curl -i -X GET http://localhost:8080/api/eventos
  ```
* **Probar inserción (`POST`):**
  ```bash
  curl -i -X POST http://localhost:8080/api/eventos \
    -H "Content-Type: application/json" \
    -d '{"titulo":"Test Session","categoria":"DJ sets","fecha":"2026-08-15","ubicacion":"Siroco, Madrid","precio":10,"descripcion":"Prueba de API","foto1":"https://images.unsplash.com/photo-1571266028243-3716f02d2d2e"}'
  ```
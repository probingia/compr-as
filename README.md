# Compr-As: Tu Asistente de Compras Inteligente

**Versión:** 1.0.0

Una PWA (Progressive Web App) moderna y completa para gestionar tus listas de la compra de forma fácil, rápida y con funciones avanzadas. La aplicación está diseñada para funcionar en cualquier dispositivo con un navegador web moderno y puede ser "instalada" en tu escritorio o móvil para un acceso rápido y soporte sin conexión.

## ✨ Características Principales

- **Gestión Completa de Productos:** Añade, edita, elimina y marca productos como comprados con un solo clic.
- **Organización Avanzada:** Clasifica tus productos por categorías y asígnalos a tiendas específicas para una compra más organizada.
- **Cálculos Automáticos:** Calcula el coste total de tus productos y el coste por peso (ej. €/kg) automáticamente.
- **Prioridad y Notas:** Asigna prioridades (alta, media, baja) a tus productos y añade notas detalladas.
- **Búsqueda y Filtrado:** Encuentra productos rápidamente con un buscador de texto y filtra tu lista por tienda o prioridad.
- **Ordenación Dinámica:** Ordena tu lista por categoría, nombre de producto (alfabéticamente) o coste (ascendente/descendente).
- **Importación y Exportación:**
    - **Exporta** tu lista de compras a formatos `.txt`, `.jpg` y `.pdf` con un diseño limpio.
    - **Importa** productos desde un archivo `.txt`, con previsualización y manejo inteligente de datos.
- **Entrada de Voz y Autocompletado:** Añade productos usando tu voz o aprovecha las sugerencias de autocompletado.
- **100% Offline:** Gracias a la tecnología PWA y Service Workers, la aplicación funciona perfectamente sin conexión a internet.
- **Interfaz Adaptable (Responsive):** Diseño optimizado para verse y funcionar bien en ordenadores, tablets y móviles.
- **Personalización:** Ajusta el tamaño de la letra para una mejor accesibilidad.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
- **Framework CSS:** Bootstrap 5
- **Iconos:** Bootstrap Icons
- **Generación de PDF:** [jsPDF](https://github.com/parallax/jsPDF)
- **Generación de JPG:** [html2canvas](https://html2canvas.hertzen.com/)
- **Entorno de Desarrollo:** [Vite](https://vitejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/) y [JSDOM](https://github.com/jsdom/jsdom)

## 🚀 Instalación y Uso

Este proyecto utiliza **Vite** para un desarrollo rápido y moderno.

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-del-repositorio>
    cd compr-as-con-mejoras-codigo
    ```

2.  **Instala las dependencias:**
    Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, ejecuta:
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Esto iniciará un servidor local (normalmente en `http://localhost:5173`) y abrirá la aplicación en tu navegador. La página se recargará automáticamente cada vez que hagas un cambio en el código.

4.  **Para producción (build):**
    Si quieres generar la versión optimizada para producción, ejecuta:
    ```bash
    npm run build
    ```
    Los archivos finales se guardarán en el directorio `dist/`.

## 📂 Estructura del Proyecto

```
/
├─── .gitignore
├─── app.js                # (Deprecado) Lógica inicial, ahora refactorizada en /js
├─── index.html            # Punto de entrada de la aplicación
├─── manifest.json         # Configuración de la PWA
├─── package.json          # Dependencias y scripts de Node.js
├─── productos.json        # Datos iniciales de productos
├─── service-worker.js     # Lógica para el funcionamiento offline
├─── style.css             # Estilos principales
├─── tiendas.json          # Datos iniciales de tiendas
├─── vite.config.js        # Configuración de Vite
├─── images/               # Iconos de la PWA
├─── js/                   # **Lógica principal de la aplicación (modularizada)**
│    ├─── api.js           # Manejo de localStorage
│    ├─── confirm.js       # Módulo para diálogos de confirmación
│    ├─── db.js            # (Deprecado) Lógica de BD inicial
│    ├─── dom.js           # Referencias a elementos del DOM
│    ├─── events.js        # Manejadores de eventos de la UI
│    ├─── importParser.js  # Lógica para parsear archivos .txt
│    ├─── notifications.js # Sistema de notificaciones (toasts)
│    ├─── pdfGenerator.js  # Generador de archivos PDF
│    ├─── render.js        # Funciones para renderizar la UI
│    ├─── state.js         # Estado central de la aplicación
│    └─── utils.js         # Funciones de utilidad
├─── libs/                 # Librerías de terceros (Bootstrap, jsPDF, etc.)
└─── node_modules/         # Dependencias de desarrollo
```

## 🚀 Mejoras Implementadas Recientemente

Durante el desarrollo reciente, se han abordado y solucionado varios puntos clave para mejorar la robustez, el rendimiento y la experiencia de usuario de la aplicación:

*   **Estrategia de Caché del Service Worker:** Se implementó la estrategia `StaleWhileRevalidate` para asegurar que la aplicación se cargue instantáneamente desde la caché mientras se mantiene actualizada en segundo plano.
*   **Validación de Importación de Archivos:** Se añadió una validación robusta en el parser de importación (`js/importParser.js`) y se mejoró la visualización de errores en la previsualización de importación (`js/render.js`), proporcionando feedback claro al usuario sobre líneas malformadas.
*   **Gestión Centralizada del Estado:** Las mutaciones del estado de la UI (`modoOrden`, `compradosOcultos`) se centralizaron en `js/state.js` a través de funciones específicas (`setSortMode`, `toggleHidePurchased`), haciendo el flujo de datos más predecible y el código más mantenible.
*   **Manejo Consistente de Errores y Notificaciones:** Se aseguró que todos los errores críticos, especialmente los relacionados con la base de datos (`js/db.js`), se comuniquen al usuario a través de notificaciones visibles, en lugar de solo registrarse en la consola.
*   **Accesibilidad (A11y):** Se mejoró la accesibilidad para usuarios de lectores de pantalla añadiendo el atributo `aria-live="polite"` a los contenedores de la lista de productos y a los elementos que muestran los totales, asegurando que los cambios dinámicos sean anunciados.
*   **Generación de PDF:** Se refactorizó la generación de PDF para eliminar valores fijos y permitir un control más granular sobre el diseño, incluyendo el interlineado entre campos.

## 🔮 Posibles Mejoras Futuras

Aunque la aplicación es muy completa, aún quedan áreas de mejora para futuras iteraciones:

1.  **Confirmaciones de Usuario:** Añadir un diálogo de confirmación de "¿Estás seguro?" al eliminar categorías o tiendas para prevenir borrados accidentales, de forma similar al que ya existe para eliminar productos.
2.  **Guía de Formato de Importación:** Añadir un pequeño ícono de ayuda (`<i class="bi bi-info-circle"></i>`) junto al botón de importar que, al hacer clic, muestre una ventana con instrucciones claras y ejemplos del formato `.txt` esperado.
3.  **Refinamiento de UI/UX:** Pulir detalles como añadir animaciones sutiles a la aparición/desaparición de productos o unificar el estilo de todos los modales de la aplicación.

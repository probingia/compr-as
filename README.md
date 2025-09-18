# Compr-As: Tu Lista de Compras Inteligente

Compr-As es una Aplicación Web Progresiva (PWA) diseñada para ofrecer una experiencia rápida y eficiente en la gestión de listas de compras. Su núcleo es una interfaz de usuario altamente optimizada que permite añadir y organizar productos de forma intuitiva.

## ✨ Características Principales

- **Añadir Productos de Forma Detallada**: Guarda productos con cantidad, unidad, categoría, tienda, nivel de prioridad y notas.
- **Clasificación Automática**: Sugiere una categoría automáticamente al escribir el nombre de un producto.
- **Entrada por Voz**: Dicta productos usando el micrófono para añadirlos rápidamente.
- **Gestión de Datos**: Crea, edita y elimina tus propias **categorías** y **tiendas**.
- **Filtros y Búsqueda**:
    - Filtra la lista de productos por tienda.
    - Busca instantáneamente por nombre de producto o por contenido en las notas.
- **Orden Inteligente**: Organiza tu lista con un solo clic por:
    - **Categoría** (agrupación por pasillos del supermercado).
    - **Orden Alfabético**.
    - **Nivel de Prioridad**.
- **Exportación Multi-formato**: Exporta tu lista de compras a:
    - Archivo de texto (`.txt`).
    - Imagen (`.jpg`).
    - Documento (`.pdf`), con un diseño profesional que respeta los grupos y prioridades.
- **Importación Rápida**: Importa una lista de productos desde un archivo `.txt`.
- **Aplicación Web Progresiva (PWA)**:
    - **Instalable**: Puede ser instalada en escritorio o móvil para un acceso rápido.
    - **Funcionalidad Offline**: Gracias al Service Worker, la aplicación funciona sin conexión a internet.

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Framework de Estilos**: Bootstrap 5 y Bootstrap Icons.
- **Bibliotecas Externas**:
    - `jsPDF` para la generación de documentos PDF.
    - `html2canvas` para la creación de imágenes JPG.
- **PWA**: Manifiesto de aplicación web y Service Worker para la funcionalidad offline.

## 🛠️ Instalación y Uso

### Como Aplicación Web
Simplemente abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).

### Como Aplicación Instalada (PWA)
1.  Abre la aplicación en un navegador compatible (como Chrome o Edge).
2.  Busca el icono de "Instalar" en la barra de direcciones del navegador.
3.  Haz clic en él para añadir Compr-As a tu escritorio o pantalla de inicio. La aplicación se ejecutará en su propia ventana y estará disponible sin conexión.

## 📂 Estructura del Proyecto

```
/
├── app.js                  # Lógica principal de la aplicación
├── index.html              # Estructura de la página
├── style.css               # Estilos personalizados
├── manifest.json           # Archivo de configuración de la PWA
├── service-worker.js       # Script para el funcionamiento offline
├── README.md               # Este archivo
└── images/
    ├── icon-192.png
    └── icon-512.png
```

## 🔮 Posibles Mejoras Futuras

- **Sincronización en la Nube**: Guardar la lista de compras en una base de datos para sincronizarla entre múltiples dispositivos.
- **Empaquetado para Escritorio**: Utilizar **Electron** para crear una aplicación de escritorio nativa para Windows, macOS y Linux.
- **Empaquetado para Móvil**: Utilizar **Cordova** o **Capacitor** para generar una aplicación instalable para Android y iOS.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

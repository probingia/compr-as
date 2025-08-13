
document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================================
    // 1. REFERENCIAS A ELEMENTOS DEL DOM
    // ===================================================================================
    const nombreProductoInput = document.getElementById('nombre-producto');
    const sugerenciasDataList = document.getElementById('sugerencias-productos');
    const cantidadProductoInput = document.getElementById('cantidad-producto');
    const unidadProductoSelect = document.getElementById('unidad-producto');
    const categoriaProductoSelect = document.getElementById('categoria-producto');
    const tiendaProductoSelect = document.getElementById('tienda-producto');
    const notasProductoInput = document.getElementById('notas-producto');
    const prioridadProductoSelect = document.getElementById('prioridad-producto');
    const btnAnadir = document.getElementById('btn-anadir');
    const listaComprasContainer = document.getElementById('lista-compras');
    const totalProductosSpan = document.getElementById('total-productos');
    const btnVoz = document.getElementById('btn-voz');

    // Modales de gestión
    const nuevaCategoriaInput = document.getElementById('nueva-categoria');
    const btnAnadirCategoria = document.getElementById('btn-anadir-categoria');
    const listaCategoriasUl = document.getElementById('lista-categorias');
    const nuevaTiendaInput = document.getElementById('nueva-tienda');
    const btnAnadirTienda = document.getElementById('btn-anadir-tienda');
    const listaTiendasUl = document.getElementById('lista-tiendas');

    // Filtros y Acciones
    const filtroTiendaSelect = document.getElementById('filtro-tienda');
    const busquedaInput = document.getElementById('busqueda');
    const btnOrdenar = document.getElementById('btn-ordenar');
    const btnExportTxt = document.getElementById('btn-export-txt');
    const btnExportJpg = document.getElementById('btn-export-jpg');
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnImportTxt = document.getElementById('btn-import-txt');

    // Modal de edición
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editModalBody = document.querySelector('#editModal .modal-body');
    const btnGuardarEdicion = document.getElementById('btn-guardar-edicion');


    // ===================================================================================
    // 2. ESTADO DE LA APLICACIÓN (DATOS)
    // ===================================================================================
    let productos = [];
    let categorias = [];
    let tiendas = [];
    let modoOrden = 'categoria'; // 'categoria', 'alfa', 'prioridad'
    const prioridadMap = { 'alta': 3, 'media': 2, 'baja': 1 };

    const autoCategoriaMap = {
        // Lácteos y huevos (id: 3)
        'leche': 3, 'yogur': 3, 'queso': 3, 'huevos': 3, 'nata': 3, 'kéfir': 3, 'requesón': 3,
        // Frutas (id: 1)
        'manzana': 1, 'plátano': 1, 'naranja': 1, 'fresa': 1, 'uva': 1, 'pera': 1, 'melón': 1, 'sandía': 1,
        // Verduras (id: 2)
        'tomate': 2, 'cebolla': 2, 'ajo': 2, 'patata': 2, 'lechuga': 2, 'zanahoria': 2, 'pimiento': 2, 'pepino': 2, 'brócoli': 2, 'espinaca': 2,
        // Carnes (id: 4)
        'pollo': 4, 'ternera': 4, 'cerdo': 4, 'cordero': 4, 'pavo': 4, 'salchicha': 4, 'hamburguesa': 4, 'jamón': 4,
        // Pescados (id: 5)
        'salmón': 5, 'merluza': 5, 'atún': 5, 'sardina': 5, 'bacalao': 5, 'gamba': 5, 'mejillones': 5, 'trucha': 5,
        // Panadería y cereales (id: 6)
        'pan': 6, 'cereales': 6, 'arroz': 6, 'pasta': 6, 'avena': 6,
        // Repostería (id: 7)
        'azúcar': 7, 'harina': 7, 'levadura': 7, 'chocolate': 7, 'cacao': 7, 'vainilla': 7, 'miel': 7, 'mermelada': 7, 'mantequilla': 7, 'bizcocho': 7, 'galletas': 7, 'magdalena': 7, 'pastel': 7, 'tarta': 7, 'natillas': 7, 'flan': 7,
        // Limpieza (id: 8)
        'lejía': 8, 'detergente': 8, 'suavizante': 8, 'lavavajillas': 8, 'fregasuelos': 8, 'limpiacristales': 8,
        // Higiene personal (id: 9)
        'champú': 9, 'gel': 9, 'desodorante': 9, 'pasta de dientes': 9, 'papel higiénico': 9, 'jabón': 9,
        // Bebidas (id: 10)
        'agua': 10, 'refresco': 10, 'zumo': 10, 'cerveza': 10, 'vino': 10, 'café': 10, 'té': 10,
        // Despensa (id: 11)
        'aceite': 11, 'vinagre': 11, 'sal': 11, 'especias': 11, 'conservas': 11, 'salsa': 11, 'almendra': 11, 'nuez': 11, 'cacahuete': 11, 'pistacho': 11, 'avellana': 11, 'anacardo': 11, 'frutos secos': 11, 'aceituna': 11
    };

    // ===================================================================================
    // 3. FUNCIONES
    // ===================================================================================

    // --- Funciones de persistencia de datos ---
    const guardarDatos = () => {
        localStorage.setItem('compras-productos', JSON.stringify(productos));
        localStorage.setItem('compras-categorias', JSON.stringify(categorias));
        localStorage.setItem('compras-tiendas', JSON.stringify(tiendas));
    };

    const cargarDatos = () => {
        productos = JSON.parse(localStorage.getItem('compras-productos')) || [];
        categorias = JSON.parse(localStorage.getItem('compras-categorias')) || [
            { id: 1, nombre: 'Frutas' }, { id: 2, nombre: 'Verduras' },
            { id: 3, nombre: 'Lácteos y huevos' },
            { id: 4, nombre: 'Carnes' }, { id: 5, nombre: 'Pescados' },
            { id: 6, nombre: 'Panadería y cereales' },
            { id: 7, nombre: 'Repostería' },
            { id: 8, nombre: 'Limpieza' }, { id: 9, nombre: 'Higiene personal' },
            { id: 10, nombre: 'Bebidas' }, { id: 11, nombre: 'Despensa' },
            { id: 12, nombre: 'Otros' }
        ];
        tiendas = JSON.parse(localStorage.getItem('compras-tiendas')) || [
            { id: 1, nombre: 'Carrefour' }, { id: 2, nombre: 'Mercadona' },
            { id: 3, nombre: 'Farmacia' }
        ];
    };

    // --- Funciones de renderizado ---
    const render = () => {
        renderProductos();
        renderCategorias();
        renderTiendas();
        guardarDatos();
    };

    const renderProductos = () => {
        listaComprasContainer.innerHTML = '';
        
        // 1. Filtrar
        const tiendaFiltradaId = filtroTiendaSelect.value;
        const textoBusqueda = busquedaInput.value.toLowerCase();
        let productosAMostrar = productos.filter(p => {
            const filtroTiendaOk = tiendaFiltradaId === 'all' || p.tiendaId == tiendaFiltradaId;
            const filtroBusquedaOk = textoBusqueda === '' || 
                                     p.nombre.toLowerCase().includes(textoBusqueda) || 
                                     (p.notas && p.notas.toLowerCase().includes(textoBusqueda));
            return filtroTiendaOk && filtroBusquedaOk;
        });

        // 2. Ordenar
        if (modoOrden === 'alfa') {
            productosAMostrar.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (modoOrden === 'prioridad') {
            productosAMostrar.sort((a, b) => (prioridadMap[b.prioridad] || 0) - (prioridadMap[a.prioridad] || 0));
        }

        totalProductosSpan.textContent = productosAMostrar.length;

        if (productosAMostrar.length === 0) {
            listaComprasContainer.innerHTML = '<div class="alert alert-info">No hay productos para la selección actual.</div>';
            return;
        }

        // 3. Agrupar y mostrar
        if (modoOrden === 'alfa' || modoOrden === 'prioridad') {
            const lista = document.createElement('ul');
            lista.className = 'list-group mb-4';
            productosAMostrar.forEach(p => lista.appendChild(crearElementoProducto(p)));
            listaComprasContainer.appendChild(lista);
        } else {
            const productosAgrupados = agruparPorCategoria(productosAMostrar);
            for (const categoriaId in productosAgrupados) {
                const categoria = categorias.find(c => c.id == categoriaId) || { nombre: 'Sin Categoría' };
                const categoriaWrapper = document.createElement('div');
                categoriaWrapper.innerHTML = `
                    <h4 class="categoria-header border-bottom pb-2 mb-3">${categoria.nombre} 
                        <span class="badge bg-secondary float-end">${productosAgrupados[categoriaId].length}</span>
                    </h4>`;
                
                const lista = document.createElement('ul');
                lista.className = 'list-group mb-4';
                productosAgrupados[categoriaId].forEach(p => lista.appendChild(crearElementoProducto(p)));
                categoriaWrapper.appendChild(lista);
                listaComprasContainer.appendChild(categoriaWrapper);
            }
        }
    };

    const crearElementoProducto = (p) => {
        const item = document.createElement('li');
        item.className = `list-group-item producto-item d-flex justify-content-between align-items-center ${p.comprado ? 'comprado' : ''} prioridad-${p.prioridad || 'baja'}`;
        item.dataset.id = p.id;

        const tienda = tiendas.find(t => t.id == p.tiendaId);
        const tiendaNombre = tienda ? tienda.nombre : 'Sin tienda';

        item.innerHTML = `
            <div class="form-check">
                <input class="form-check-input check-comprado" type="checkbox" ${p.comprado ? 'checked' : ''}>
                <label class="form-check-label">
                    <span class="fw-bold">${p.nombre}</span>
                    <small class="text-muted d-block">${p.cantidad} ${p.unidad} | ${tiendaNombre}</small>
                    ${p.notas ? `<small class="text-muted d-block fst-italic">Nota: ${p.notas}</small>` : ''}
                </label>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary btn-editar"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar"><i class="bi bi-trash"></i></button>
            </div>
        `;
        return item;
    };

    const renderCategorias = () => {
        const categoriasOrdenadas = [...categorias].sort((a, b) => a.nombre.localeCompare(b.nombre));

        categoriaProductoSelect.innerHTML = '<option selected value="">Seleccionar categoría...</option>';
        categoriasOrdenadas.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            categoriaProductoSelect.appendChild(option);
        });

        listaCategoriasUl.innerHTML = '';
        categoriasOrdenadas.forEach(c => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.dataset.id = c.id;
            item.innerHTML = `<span>${c.nombre}</span>
                <div>
                    <button class="btn btn-sm btn-outline-primary btn-editar-categoria me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar-categoria" title="Eliminar"><i class="bi bi-trash"></i></button>
                </div>`;
            listaCategoriasUl.appendChild(item);
        });
    };
    
    const renderTiendas = () => {
        const tiendasOrdenadas = [...tiendas].sort((a, b) => a.nombre.localeCompare(b.nombre));

        tiendaProductoSelect.innerHTML = '<option selected value="">Seleccionar tienda...</option>';
        tiendasOrdenadas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.nombre;
            tiendaProductoSelect.appendChild(option);
        });

        filtroTiendaSelect.innerHTML = '<option value="all" selected>Todas las tiendas</option>';
        tiendasOrdenadas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.nombre;
            filtroTiendaSelect.appendChild(option);
        });

        listaTiendasUl.innerHTML = '';
        tiendasOrdenadas.forEach(t => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.dataset.id = t.id;
            item.innerHTML = `<span>${t.nombre}</span><button class="btn btn-sm btn-outline-danger btn-eliminar-tienda"><i class="bi bi-trash"></i></button>`;
            listaTiendasUl.appendChild(item);
        });
    };

    // --- Funciones de Lógica ---
    const agruparPorCategoria = (listaDeProductos) => {
        return listaDeProductos.reduce((acc, producto) => {
            const categoriaId = producto.categoriaId || '0';
            if (!acc[categoriaId]) acc[categoriaId] = [];
            acc[categoriaId].push(producto);
            return acc;
        }, {});
    };

    const anadirProducto = () => {
        const nombre = nombreProductoInput.value.trim();
        if (!nombre) {
            alert('El nombre del producto no puede estar vacío.');
            return;
        }
        const nuevoProducto = {
            id: Date.now(),
            nombre: nombre,
            cantidad: cantidadProductoInput.value || 1,
            unidad: unidadProductoSelect.value,
            categoriaId: categoriaProductoSelect.value,
            tiendaId: tiendaProductoSelect.value,
            notas: notasProductoInput.value.trim(),
            comprado: false,
            prioridad: prioridadProductoSelect.value
        };
        productos.push(nuevoProducto);

        // Limpiar formulario
        nombreProductoInput.value = '';
        cantidadProductoInput.value = '';
        notasProductoInput.value = '';
        categoriaProductoSelect.selectedIndex = 0;
        tiendaProductoSelect.selectedIndex = 0;
        prioridadProductoSelect.value = 'baja';
        
        render();
    };

    const anadirCategoria = () => {
        const nombre = nuevaCategoriaInput.value.trim();
        if (nombre && !categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
            categorias.push({ id: Date.now(), nombre });
            nuevaCategoriaInput.value = '';
            render();
        }
    };

    const anadirTienda = () => {
        const nombre = nuevaTiendaInput.value.trim();
        if (nombre && !tiendas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
            tiendas.push({ id: Date.now(), nombre });
            nuevaTiendaInput.value = '';
            render();
        }
    };
    
    const abrirModalEdicion = (id) => {
        const producto = productos.find(p => p.id == id);
        if (!producto) return;
        editModalBody.innerHTML = `
            <input type="hidden" id="edit-id" value="${producto.id}">
            <div class="mb-3"><label for="edit-nombre" class="form-label">Nombre</label><input type="text" id="edit-nombre" class="form-control" value="${producto.nombre}"></div>
            <div class="row g-3 mb-3">
                <div class="col-md-6"><label for="edit-cantidad" class="form-label">Cantidad</label><input type="number" id="edit-cantidad" class="form-control" value="${producto.cantidad}"></div>
                <div class="col-md-6"><label for="edit-unidad" class="form-label">Unidad</label><select id="edit-unidad" class="form-select">
                    <option value="uds" ${producto.unidad === 'uds' ? 'selected' : ''}>Uds</option><option value="kg" ${producto.unidad === 'kg' ? 'selected' : ''}>kg</option>
                    <option value="g" ${producto.unidad === 'g' ? 'selected' : ''}>g</option><option value="l" ${producto.unidad === 'l' ? 'selected' : ''}>l</option></select></div>
            </div>
            <div class="mb-3"><label for="edit-categoria" class="form-label">Categoría</label><select id="edit-categoria" class="form-select"></select></div>
            <div class="mb-3"><label for="edit-tienda" class="form-label">Tienda</label><select id="edit-tienda" class="form-select"></select></div>
            <div class="mb-3"><label for="edit-notas" class="form-label">Notas</label><textarea id="edit-notas" class="form-control">${producto.notas}</textarea></div>
            <div class="mb-3"><label for="edit-prioridad" class="form-label">Prioridad</label><select id="edit-prioridad" class="form-select">
                <option value="baja" ${producto.prioridad === 'baja' ? 'selected' : ''}>Baja</option><option value="media" ${producto.prioridad === 'media' ? 'selected' : ''}>Media</option>
                <option value="alta" ${producto.prioridad === 'alta' ? 'selected' : ''}>Alta</option></select></div>`;
        
        const editCategoriaSelect = document.getElementById('edit-categoria');
        categorias.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id; option.textContent = c.nombre;
            if (c.id == producto.categoriaId) option.selected = true;
            editCategoriaSelect.appendChild(option);
        });
        const editTiendaSelect = document.getElementById('edit-tienda');
        tiendas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id; option.textContent = t.nombre;
            if (t.id == producto.tiendaId) option.selected = true;
            editTiendaSelect.appendChild(option);
        });
        editModal.show();
    };

    const guardarEdicion = () => {
        const id = document.getElementById('edit-id').value;
        const productoIndex = productos.findIndex(p => p.id == id);
        if (productoIndex === -1) return;
        productos[productoIndex] = {
            ...productos[productoIndex],
            nombre: document.getElementById('edit-nombre').value,
            cantidad: document.getElementById('edit-cantidad').value,
            unidad: document.getElementById('edit-unidad').value,
            categoriaId: document.getElementById('edit-categoria').value,
            tiendaId: document.getElementById('edit-tienda').value,
            notas: document.getElementById('edit-notas').value,
            prioridad: document.getElementById('edit-prioridad').value,
        };
        render();
        editModal.hide();
    };

    // --- Funciones Avanzadas ---
    const toggleOrden = () => {
        const ordenes = ['categoria', 'alfa', 'prioridad'];
        const currentIndex = ordenes.indexOf(modoOrden);
        modoOrden = ordenes[(currentIndex + 1) % ordenes.length];
        
        const icon = btnOrdenar.querySelector('i');
        if (modoOrden === 'alfa') {
            icon.className = 'bi bi-sort-alpha-down';
            btnOrdenar.title = 'Ordenar por Prioridad';
        } else if (modoOrden === 'prioridad') {
            icon.className = 'bi bi-bar-chart-fill';
            btnOrdenar.title = 'Ordenar por Categoría';
        } else {
            icon.className = 'bi bi-collection-fill';
            btnOrdenar.title = 'Ordenar Alfabéticamente';
        }
        renderProductos();
    };

    const exportarTxt = () => {
        let contenido = 'Lista de Compras - Compr-As\n';
        contenido += '=================================\n';
        productos.forEach(p => {
            const check = p.comprado ? '[x]' : '[ ]';
            contenido += `${check} ${p.nombre} (${p.cantidad} ${p.unidad})\n`;
        });
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'lista-compras.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportarJpg = () => {
        // 1. Añadir clase de exportación al body para activar los estilos CSS
        document.body.classList.add('export-mode');

        html2canvas(listaComprasContainer, {
            scale: 2, // Mejora la resolución de la imagen
            backgroundColor: '#f8f9fa' // Asegura que el fondo de la imagen sea el correcto
        }).then(canvas => {
            // 2. Quitar la clase de exportación para volver a la vista normal
            document.body.classList.remove('export-mode');

            // 3. Crear y descargar el enlace de la imagen
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.download = 'lista-compras.jpg';
            a.click();
        }).catch(err => {
            // Asegurarse de quitar la clase incluso si hay un error
            document.body.classList.remove('export-mode');
            console.error("Error al generar la imagen:", err);
        });
    };

    const exportarPdf = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

        // 1. Filtrar y agrupar los productos
        const tiendaFiltradaId = filtroTiendaSelect.value;
        const textoBusqueda = busquedaInput.value.toLowerCase();
        let productosAMostrar = productos.filter(p => {
            const filtroTiendaOk = tiendaFiltradaId === 'all' || p.tiendaId == tiendaFiltradaId;
            const filtroBusquedaOk = textoBusqueda === '' || 
                                     p.nombre.toLowerCase().includes(textoBusqueda) || 
                                     (p.notas && p.notas.toLowerCase().includes(textoBusqueda));
            return filtroTiendaOk && filtroBusquedaOk;
        });
        const productosAgrupados = agruparPorCategoria(productosAMostrar);

        // 2. Definir layout y colores
        let yPos = 60; // Margen superior aumentado
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const priorityColor = {
            alta: [220, 53, 69],   // Rojo
            media: [255, 193, 7],  // Amarillo
            baja: [13, 202, 240]    // Azul claro
        };

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(17); // Tamaño de fuente reducido
        pdf.text('LISTA DE COMPRAS', margin, yPos);
        yPos += 45; // Aumentado el espacio después del título

        const checkPageBreak = () => {
            if (yPos >= pageHeight - margin) {
                pdf.addPage();
                yPos = margin;
            }
        };

        // 3. Recorrer y dibujar los datos
        for (const categoriaId in productosAgrupados) {
            checkPageBreak();
            const categoria = categorias.find(c => c.id == categoriaId) || { nombre: 'Sin Categoría' };
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.text(categoria.nombre, margin, yPos);
            yPos += 28; // Interlineado aumentado

            productosAgrupados[categoriaId].forEach(p => {
                checkPageBreak();
                const tienda = tiendas.find(t => t.id == p.tiendaId);
                const tiendaNombre = tienda ? tienda.nombre : 'Sin tienda';
                const textXPosition = margin + 15;

                if (p.comprado) {
                    // Dibujar check verde
                    pdf.setLineWidth(1.5);
                    pdf.setDrawColor(40, 167, 69); // Verde bootstrap
                    pdf.line(margin, yPos - 8, margin + 4, yPos - 4);
                    pdf.line(margin + 4, yPos - 4, margin + 9, yPos - 11);
                    pdf.setDrawColor(0); // Restaurar color de línea
                } else {
                    // Dibujar barra de color de prioridad
                    const color = priorityColor[p.prioridad || 'baja'];
                    pdf.setFillColor(color[0], color[1], color[2]);
                    pdf.rect(margin, yPos - 10, 5, 12, 'F');
                }

                // Dibujar nombre del producto
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(11);
                if(p.comprado) {
                  pdf.setTextColor(150);
                }
                pdf.text(p.nombre, textXPosition, yPos);
                if(p.comprado) {
                   pdf.setTextColor(0);
                }
                yPos += 18; // Interlineado producto-detalles

                // Dibujar detalles
                checkPageBreak();
                pdf.setFont('helvetica', 'italic');
                pdf.setFontSize(9);
                pdf.setTextColor(100);
                pdf.text(`${p.cantidad} ${p.unidad} | ${tiendaNombre}`, margin + 15, yPos);
                if (p.notas) {
                    yPos += 15; // Interlineado detalles-notas
                    checkPageBreak();
                    pdf.text(`Nota: ${p.notas}`, margin + 15, yPos);
                }
                pdf.setTextColor(0);
                yPos += 25; // Espacio final entre productos
            });
            yPos += 10; // Espacio entre categorías
        }

        // 4. Guardar el PDF
        pdf.save('lista-compras.pdf');
    };

    const importarTxt = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const lineas = e.target.result.split('\n');
            lineas.forEach(linea => {
                const nombre = linea.replace(/\s*\[[x ]\]\s*/, '').trim();
                if (nombre) {
                    productos.push({ id: Date.now(), nombre, cantidad: 1, unidad: 'uds', comprado: linea.includes('[x]'), prioridad: 'baja', notas: 'Importado' });
                }
            });
            render();
        };
        reader.readAsText(file);
    };

    const iniciarReconocimientoVoz = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Tu navegador no soporta el reconocimiento de voz.');
            return;
        }
        console.log("API de SpeechRecognition encontrada. Iniciando...");

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // --- Eventos para depuración ---
        recognition.onstart = () => { console.log("Reconocimiento de voz iniciado."); };
        recognition.onaudiostart = () => { console.log("El navegador ha comenzado a capturar audio."); };
        recognition.onsoundstart = () => { console.log("Se ha detectado algún sonido."); };
        recognition.onspeechstart = () => { console.log("Se ha detectado voz."); };
        recognition.onspeechend = () => {
            console.log("La voz ha dejado de ser detectada. Deteniendo reconocimiento...");
            recognition.stop();
        };
        recognition.onend = () => { console.log("El reconocimiento de voz ha finalizado."); };

        // --- Eventos de resultado y error ---
        recognition.onresult = (event) => {
            console.log("Resultado recibido.");
            const productoReconocido = event.results[0][0].transcript;
            nombreProductoInput.value = productoReconocido;
            sugerirCategoria(productoReconocido);
        };

        recognition.onerror = (event) => {
            console.error("Error en reconocimiento de voz:", event.error, event.message);
            let mensajeError = `Error: ${event.error}`;
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                mensajeError += '\n\nLa API de voz requiere una conexión segura (HTTPS) para funcionar en la mayoría de navegadores móviles y necesita que concedas permiso para usar el micrófono.';
            } else if (event.error === 'no-speech') {
                mensajeError += '\n\nNo se ha detectado ninguna palabra. Inténtalo de nuevo.';
            } else if (event.error === 'network') {
                mensajeError += '\n\nError de red. El reconocimiento de voz requiere conexión a internet.';
            }
            alert(mensajeError);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Error al intentar iniciar el reconocimiento:", e);
            alert("No se pudo iniciar el servicio de reconocimiento de voz. Puede que ya esté activo o haya un error interno.");
        }
    };

    const actualizarSugerencias = () => {
        const valor = nombreProductoInput.value.toLowerCase();
        sugerenciasDataList.innerHTML = '';
        if (valor.length < 2) return;
        const filtrados = listaAutocompletado.filter(item => item.toLowerCase().startsWith(valor));
        filtrados.slice(0, 5).forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            sugerenciasDataList.appendChild(option);
        });
    };

    const sugerirCategoria = (nombreProducto) => {
        const nombre = nombreProducto.toLowerCase().trim();
        
        // Si el campo de texto se limpia, reseteamos la categoría
        if (!nombre) {
            categoriaProductoSelect.value = "";
            return;
        }

        // Buscamos una nueva categoría para el producto introducido
        for (const keyword in autoCategoriaMap) {
            if (nombre.includes(keyword)) {
                const categoriaId = autoCategoriaMap[keyword];
                categoriaProductoSelect.value = categoriaId;
                return; // Encontramos una categoría, la establecemos y salimos.
            }
        }

        // Si no se encontró ninguna categoría para el nuevo producto, reseteamos el selector
        categoriaProductoSelect.value = "";
    };

    // ===================================================================================
    // 4. EVENT LISTENERS
    // ===================================================================================
    nombreProductoInput.addEventListener('change', () => sugerirCategoria(nombreProductoInput.value));
    btnAnadir.addEventListener('click', anadirProducto);
    btnAnadirCategoria.addEventListener('click', anadirCategoria);
    btnAnadirTienda.addEventListener('click', anadirTienda);
    btnGuardarEdicion.addEventListener('click', guardarEdicion);
    filtroTiendaSelect.addEventListener('change', renderProductos);
    busquedaInput.addEventListener('input', renderProductos);
    btnOrdenar.addEventListener('click', toggleOrden);
    btnExportTxt.addEventListener('click', exportarTxt);
    btnExportJpg.addEventListener('click', exportarJpg);
    btnExportPdf.addEventListener('click', exportarPdf);
    btnImportTxt.addEventListener('change', importarTxt);
    btnVoz.addEventListener('click', iniciarReconocimientoVoz);
    nombreProductoInput.addEventListener('input', actualizarSugerencias);

    listaComprasContainer.addEventListener('click', (e) => {
        const target = e.target;
        const item = target.closest('.producto-item');
        if (!item) return;
        const id = item.dataset.id;
        if (target.classList.contains('check-comprado')) {
            const producto = productos.find(p => p.id == id);
            if (producto) { producto.comprado = target.checked; render(); }
        }
        if (target.closest('.btn-eliminar')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                productos = productos.filter(p => p.id != id);
                render();
            }
        }
        if (target.closest('.btn-editar')) {
            abrirModalEdicion(id);
        }
    });

    listaCategoriasUl.addEventListener('click', (e) => {
        const editButton = e.target.closest('.btn-editar-categoria');
        const deleteButton = e.target.closest('.btn-eliminar-categoria');

        if (editButton) {
            const id = editButton.closest('li').dataset.id;
            const categoria = categorias.find(c => c.id == id);
            if (!categoria) return;

            const nuevoNombre = prompt('Introduce el nuevo nombre para la categoría:', categoria.nombre);

            if (nuevoNombre && nuevoNombre.trim() !== '') {
                // Comprobar si el nuevo nombre ya existe en otra categoría
                if (categorias.some(c => c.nombre.toLowerCase() === nuevoNombre.trim().toLowerCase() && c.id != id)) {
                    alert('Ya existe una categoría con ese nombre.');
                    return;
                }
                categoria.nombre = nuevoNombre.trim();
                render(); // Re-render para actualizar la UI
            }
        } else if (deleteButton) {
            const id = deleteButton.closest('li').dataset.id;
            if (confirm('¿Seguro? Los productos en esta categoría quedarán sin categoría.')) {
                categorias = categorias.filter(c => c.id != id);
                // Desasigna la categoría de los productos afectados
                productos.forEach(p => { if (p.categoriaId == id) p.categoriaId = ""; });
                render();
            }
        }
    });
    
    listaTiendasUl.addEventListener('click', (e) => {
        if (e.target.closest('.btn-eliminar-tienda')) {
            const id = e.target.closest('li').dataset.id;
            if (confirm('¿Seguro que quieres eliminar esta tienda?')) {
                tiendas = tiendas.filter(t => t.id != id);
                productos.forEach(p => { if (p.tiendaId == id) p.tiendaId = ""; });
                render();
            }
        }
    });

    // ===================================================================================
    // 5. INICIALIZACIÓN
    // ===================================================================================
    const listaAutocompletado = ['Leche', 'Pan', 'Huevos', 'Queso', 'Jamón', 'Yogur', 'Mantequilla', 'Cereales', 'Arroz', 'Pasta', 'Lentejas', 'Garbanzos', 'Tomate', 'Cebolla', 'Ajo', 'Patatas', 'Lechuga', 'Pimiento', 'Pepino', 'Zanahoria', 'Manzanas', 'Plátanos', 'Naranjas', 'Fresas', 'Uvas', 'Pollo', 'Carne de ternera', 'Pescado', 'Atún en lata', 'Aceite de oliva', 'Vinagre', 'Sal', 'Azúcar', 'Harina', 'Café', 'Té', 'Galletas', 'Chocolate', 'Agua mineral', 'Refrescos', 'Cerveza', 'Vino', 'Papel higiénico', 'Servilletas', 'Detergente', 'Suavizante', 'Lavavajillas', 'Bolsas de basura', 'Champú', 'Gel de ducha', 'Pasta de dientes', 'Jabón de manos', 'Aceitunas', 'Maíz', 'Champiñones', 'Espárragos', 'Brócoli', 'Coliflor', 'Espinacas', 'Acelgas', 'Calabacín', 'Berenjena', 'Limones', 'Aguacate', 'Kiwi', 'Melón', 'Sandía', 'Piña', 'Mango', 'Pera', 'Melocotón', 'Ciruelas', 'Cerezas', 'Frutos secos', 'Nueces', 'Almendras', 'Pistachos', 'Avellanas', 'Miel', 'Mermelada', 'Cacao en polvo', 'Salsas', 'Ketchup', 'Mayonesa', 'Mostaza', 'Especias', 'Pimienta', 'Orégano', 'Comino', 'Pimentón', 'Canela', 'Laurel', 'Perejil', 'Helado', 'Pizzas congeladas', 'Verduras congeladas', 'Croquetas', 'Empanadillas', 'Leche condensada', 'Nata para cocinar', 'Caldo', 'Sopa', 'Puré de patatas', 'Alubias', 'Guisantes', 'Habas', 'Soja', 'Tofu', 'Seitán', 'Leche de avena', 'Leche de soja', 'Leche de almendras', 'Yogures de soja', 'Margarina', 'Pan de molde', 'Biscotes', 'Magdalenas', 'Croissants', 'Donuts', 'Tortillas de trigo', 'Nachos', 'Patatas fritas', 'Palomitas', 'Golosinas', 'Zumo de naranja', 'Zumo de piña', 'Zumo de melocotón', 'Tónica', 'Bebida energética', 'Agua con gas', 'Hielo', 'Velas', 'Pilas', 'Bombillas', 'Fósforos', 'Insecticida', 'Ambientador', 'Papel de cocina', 'Papel de aluminio', 'Film transparente', 'Fregasuelos', 'Limpiacristales', 'Lejía', 'Amoniaco', 'Estropajos', 'Bayetas', 'Guantes de limpieza', 'Desodorante', 'Crema hidratante', 'Protector solar', 'Cuchillas de afeitar', 'Espuma de afeitar', 'Algodón', 'Bastoncillos', 'Tiritas', 'Alcohol', 'Agua oxigenada', 'Comida para mascotas', 'Arena para gatos', 'Juguetes para mascotas', 'Correa', 'Collar', 'Biberón', 'Chupete', 'Pañales', 'Toallitas húmedas', 'Potitos', 'Leche en polvo', 'Cereales infantiles', 'Galletas para bebés', 'Compresas', 'Tampones', 'Salvaslips', 'Preservativos', 'Lubricante', 'Enjuague bucal', 'Seda dental', 'Cepillo de dientes', 'Ensalada preparada', 'Gazpacho', 'Salmorejo', 'Hummus', 'Guacamole', 'Aceite de girasol', 'Vinagre de manzana', 'Salsa de soja', 'Salsa picante', 'Hierbas provenzales', 'Azafrán', 'Vainilla', 'Levadura', 'Bicarbonato', 'Fruta en almíbar', 'Tomate frito', 'Tomate triturado', 'Helado de vainilla', 'Helado de chocolate', 'Helado de fresa', 'Tarta de queso congelada', 'Tarta de manzana congelada', 'Rollitos de primavera congelados', 'Gyozas congeladas', 'Aros de cebolla congelados', 'Barritas de pescado congeladas', 'Caramelos de menta', 'Pastillas para la tos', 'Barritas energéticas', 'Chips de plátano', 'Chips de vegetales', 'Hilo dental con cera', 'Cepillo de dientes eléctrico', 'Irrigador bucal', 'Crema antiarrugas', 'Sérum facial', 'Contorno de ojos', 'Exfoliante corporal', 'Piedra pómez', 'Limpiador de hornos', 'Desatascador de tuberías', 'Suavizante concentrado', 'Quitamanchas', 'Papilla de frutas para bebé', 'Potitos de verdura para bebé', 'Juguetes para la dentición', 'Biberones', 'Chupetes', 'Comida húmeda para perros', 'Comida húmeda para gatos', 'Vitaminas para mascotas', 'Malta para gatos', 'Acelga roja', 'Berros', 'Canónigos', 'Cardo', 'Escarola', 'Guisantes lágrima', 'Habas frescas', 'Tirabeques', 'Tomate raf', 'Tomate rosa', 'Brevas', 'Chirimoya', 'Kiwano', 'Nísperos', 'Paraguayas', 'Codillo de cerdo', 'Entrecot de ternera', 'Solomillo de cerdo ibérico', 'Panceta', 'Fiambre de pavo', 'Cangrejo real', 'Langostinos', 'Cigalas', 'Navajas', 'Berberechos', 'Requesón de cabra', 'Yogur búlgaro', 'Skyr', 'Queso cottage', 'Queso quark', 'Pan de espelta', 'Pan de kamut', 'Colines', 'Picos de pan', 'Regañás', 'Harina de fuerza', 'Harina de repostería', 'Cuscús perlado', 'Fregola', 'Orzo', 'Salsa de yogur', 'Salsa tártara', 'Vinagreta', 'Pasta de sésamo (tahini)', 'Melaza de granada', 'Aceite de girasol', 'Manteca de cerdo', 'Pimienta rosa', 'Bayas de enebro', 'Macis', 'Nigella', 'Sal de apio', 'Extracto de limón', 'Agua de azahar', 'Fondant', 'Nueces pecanas', 'Castañas de cajú', 'Infusión de tila', 'Infusión de poleo menta', 'Café torrefacto', 'Bebida de soja con chocolate', 'Mosto', 'Zumo de granada', 'Zumo de multifrutas', 'Cerveza tostada', 'Cerveza roja', 'Lambrusco', 'Moscato', 'Grappa', 'Pisco', 'Mezcal', 'Cachaça', 'Licor de melocotón', 'Licor de manzana', 'Helado de pistacho', 'Helado de turrón', 'Tiramisú congelado', 'Coulant de chocolate congelado', 'Lasaña congelada', 'Moussaka congelada', 'Pimientos del piquillo rellenos congelados', 'Alcachofas rebozadas congeladas', 'Chocolate con leche', 'Chocolate con almendras', 'Tableta de chocolate para postres', 'Almendras garrapiñadas', 'Pistachos tostados y salados', 'Enjuague bucal infantil', 'Pasta de dientes para niños', 'Cepillo de dientes suave', 'Crema hidratante con color', 'BB cream', 'CC cream', 'Mascarilla para el pelo', 'Sérum para el pelo', 'Laca', 'Gomina', 'Cera para el pelo', 'Descalcificador para lavadora', 'Abrillantador para lavavajillas', 'Sal para lavavajillas', 'Friegasuelos', 'Leche de continuación para bebé', 'Toallitas para el cambio de pañal', 'Crema para el culito del bebé', 'Esponja natural para bebé', 'Tijeras de uñas para bebé', 'Pienso para cachorros', 'Pienso para perros senior', 'Pienso para gatos esterilizados', 'Pienso para gatitos', 'Snacks dentales para perros', 'Juguetes interactivos para gatos', 'Rascadores para gatos', 'Camas para mascotas', 'Endibia roja', 'Radicchio', 'Tatsoi', 'Calabaza bonetera', 'Calabaza cacahuete', 'Pimiento de Padrón', 'Pimiento choricero', 'Gindillas', 'Ajo negro', 'Cebolla morada', 'Membrillo', 'Physalis', 'Mirabeles', 'Reinetas', 'Verde doncella', 'Carrilleras de cerdo', 'Entraña de ternera', 'Magret de pato', 'Confit de pato', 'Cecina', 'Pulpo cocido', 'Sepia', 'Bígaros', 'Cañaíllas', 'Ortiguillas de mar', 'Cuajada', 'Leche de cabra', 'Kumis', 'Queso de tetilla', 'Queso idiazábal', 'Pan de hogaza', 'Pan de chapata', 'Pan de cristal', 'Tortas de aceite', 'Rosquilletas', 'Harina de maíz', 'Harina de teff', 'Polenta instantánea', 'Arroz bomba', 'Arroz venere', 'Salsa brava', 'Salsa romesco', 'Alioli', 'Pasta de ají amarillo', 'Sirope de chocolate', 'Sirope de caramelo', 'Manteca de cacao', 'Grasa de pato', 'Pimienta de Sichuan', 'Cardamomo negro', 'Vainilla en polvo', 'Sal ahumada', 'Sal en escamas', 'Esencia de ron', 'Esencia de anís', 'Perlas de azúcar', 'Fideos de chocolate', 'Cacahuetes garrapiñados', 'Nueces de pecán caramelizadas', 'Infusión de frutos rojos', 'Infusión relajante', 'Café en cápsulas', 'Bebida de avellana', 'Zumo de pomelo', 'Zumo de albaricoque', 'Cerveza IPA', 'Cerveza stout', 'Vino frizzante', 'Vino de aguja', 'Licor de cereza', 'Licor de almendras', 'Amaretto', 'Frangelico', 'Limoncello', 'Sambuca', 'Helado de limón', 'Helado de café', 'Profiteroles congelados', 'Buñuelos congelados', 'Churros congelados', 'Tequeños congelados', 'Alitas de pollo adobadas congeladas', 'Costillas a la barbacoa congeladas', 'Salteado de gambas y verduras congelado', 'Paella de marisco congelada', 'Chocolate para fundir', 'Cacao puro en polvo', 'Pepitas de chocolate', 'Fruta deshidratada', 'Orejones', 'Ciruelas pasas', 'Dátiles sin hueso', 'Higos secos', 'Pasta de dientes blanqueadora', 'Pasta de dientes para encías sensibles', 'Colutorio con flúor', 'Aceite seco', 'Crema reafirmante', 'Gel reductor', 'Tratamiento anticelulítico', 'Champú en seco', 'Mascarilla de color para el pelo', 'Protector térmico para el pelo', 'Limpiador antical', 'Detergente para prendas delicadas', 'Bolas antipolillas', 'Recambios de ambientador', 'Cereales hidrolizados para bebé', 'Tarritos de fruta y yogur para bebé', 'Toallitas nasales para bebé', 'Aspirador nasal para bebé', 'Termómetro de baño', 'Pienso hipoalergénico para perros', 'Pienso sin cereales para gatos', 'Snacks naturales para perros', 'Latas de paté para gatos', 'Juguetes de cuerda para perros', 'Plumeros para gatos', 'Lecho vegetal para roedores', 'Piedras minerales para pájaros'];
    cargarDatos();
    render();
    console.log("Fase 3 completada: Funcionalidades avanzadas implementadas.");

    // ===================================================================================
    // 6. REGISTRO DEL SERVICE WORKER
    // ===================================================================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.log('Fallo en el registro del Service Worker:', error);
                });
        });
    }
});

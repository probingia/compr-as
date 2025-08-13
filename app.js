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
    const btnAnadir = document.getElementById('btn-anadir');
    const listaComprasContainer = document.getElementById('lista-compras');
    const totalProductosSpan = document.getElementById('total-productos');
    const btnVoz = document.getElementById('btn-voz');
    const btnImagen = document.getElementById('btn-imagen');

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
            { id: 1, nombre: 'Frutas y Verduras' }, { id: 2, nombre: 'Lácteos y Huevos' },
            { id: 3, nombre: 'Carnes y Pescados' }, { id: 4, nombre: 'Panadería y Cereales' },
            { id: 5, nombre: 'Limpieza' }, { id: 6, nombre: 'Higiene Personal' },
            { id: 7, nombre: 'Bebidas' }, { id: 8, nombre: 'Despensa' },
        ];
        tiendas = JSON.parse(localStorage.getItem('compras-tiendas')) || [
            { id: 1, nombre: 'Supermercado General' }, { id: 2, nombre: 'Mercado Local' },
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
        categoriaProductoSelect.innerHTML = '<option selected value="">Seleccionar categoría...</option>';
        categorias.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            categoriaProductoSelect.appendChild(option);
        });
        listaCategoriasUl.innerHTML = '';
        categorias.forEach(c => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.dataset.id = c.id;
            item.innerHTML = `<span>${c.nombre}</span><button class="btn btn-sm btn-outline-danger btn-eliminar-categoria"><i class="bi bi-trash"></i></button>`;
            listaCategoriasUl.appendChild(item);
        });
    };
    
    const renderTiendas = () => {
        tiendaProductoSelect.innerHTML = '<option selected value="">Seleccionar tienda...</option>';
        tiendas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.nombre;
            tiendaProductoSelect.appendChild(option);
        });
        filtroTiendaSelect.innerHTML = '<option value="all" selected>Todas las tiendas</option>';
        tiendas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.nombre;
            filtroTiendaSelect.appendChild(option);
        });
        listaTiendasUl.innerHTML = '';
        tiendas.forEach(t => {
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
            prioridad: 'baja'
        };
        productos.push(nuevoProducto);
        nombreProductoInput.value = '';
        cantidadProductoInput.value = '';
        notasProductoInput.value = '';
        categoriaProductoSelect.selectedIndex = 0;
        tiendaProductoSelect.selectedIndex = 0;
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
        html2canvas(listaComprasContainer).then(canvas => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.download = 'lista-compras.jpg';
            a.click();
        });
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
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.start();
        recognition.onresult = (event) => {
            nombreProductoInput.value = event.results[0][0].transcript;
        };
        recognition.onspeechend = () => { recognition.stop(); };
        recognition.onerror = (event) => { alert('Error en el reconocimiento de voz: ' + event.error); };
    };

    const simularReconocimientoImagen = () => {
        nombreProductoInput.value = 'Producto Reconocido';
        nombreProductoInput.focus();
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

    // ===================================================================================
    // 4. EVENT LISTENERS
    // ===================================================================================
    btnAnadir.addEventListener('click', anadirProducto);
    btnAnadirCategoria.addEventListener('click', anadirCategoria);
    btnAnadirTienda.addEventListener('click', anadirTienda);
    btnGuardarEdicion.addEventListener('click', guardarEdicion);
    filtroTiendaSelect.addEventListener('change', renderProductos);
    busquedaInput.addEventListener('input', renderProductos);
    btnOrdenar.addEventListener('click', toggleOrden);
    btnExportTxt.addEventListener('click', exportarTxt);
    btnExportJpg.addEventListener('click', exportarJpg);
    btnImportTxt.addEventListener('change', importarTxt);
    btnVoz.addEventListener('click', iniciarReconocimientoVoz);
    btnImagen.addEventListener('change', simularReconocimientoImagen);
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
        if (e.target.closest('.btn-eliminar-categoria')) {
            const id = e.target.closest('li').dataset.id;
            if (confirm('¿Seguro? Los productos en esta categoría quedarán sin categoría.')) {
                categorias = categorias.filter(c => c.id != id);
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
    const listaAutocompletado = ['Leche', 'Pan', 'Huevos', 'Queso', 'Jamón', 'Yogur', 'Mantequilla', 'Cereales', 'Arroz', 'Pasta', 'Lentejas', 'Garbanzos', 'Tomate', 'Cebolla', 'Ajo', 'Patatas', 'Lechuga', 'Pimiento', 'Pepino', 'Zanahoria', 'Manzanas', 'Plátanos', 'Naranjas', 'Fresas', 'Uvas', 'Pollo', 'Carne de ternera', 'Pescado', 'Atún en lata', 'Aceite de oliva', 'Vinagre', 'Sal', 'Azúcar', 'Harina', 'Café', 'Té', 'Galletas', 'Chocolate', 'Agua mineral', 'Refrescos', 'Cerveza', 'Vino', 'Papel higiénico', 'Servilletas', 'Detergente', 'Suavizante', 'Lavavajillas', 'Bolsas de basura', 'Champú', 'Gel de ducha', 'Pasta de dientes', 'Jabón de manos', 'Aceitunas', 'Maíz', 'Champiñones', 'Espárragos', 'Brócoli', 'Coliflor', 'Espinacas', 'Acelgas', 'Calabacín', 'Berenjena', 'Limones', 'Aguacate', 'Kiwi', 'Melón', 'Sandía', 'Piña', 'Mango', 'Pera', 'Melocotón', 'Ciruelas', 'Cerezas', 'Frutos secos', 'Nueces', 'Almendras', 'Pistachos', 'Avellanas', 'Miel', 'Mermelada', 'Cacao en polvo', 'Salsas', 'Ketchup', 'Mayonesa', 'Mostaza', 'Especias', 'Pimienta', 'Orégano', 'Comino', 'Pimentón', 'Canela', 'Laurel', 'Perejil', 'Helado', 'Pizzas congeladas', 'Verduras congeladas', 'Croquetas', 'Empanadillas', 'Leche condensada', 'Nata para cocinar', 'Caldo', 'Sopa', 'Puré de patatas', 'Alubias', 'Guisantes', 'Habas', 'Soja', 'Tofu', 'Seitán', 'Leche de avena', 'Leche de soja', 'Leche de almendras', 'Yogures de soja', 'Margarina', 'Pan de molde', 'Biscotes', 'Magdalenas', 'Croissants', 'Donuts', 'Tortillas de trigo', 'Nachos', 'Patatas fritas', 'Palomitas', 'Golosinas', 'Zumo de naranja', 'Zumo de piña', 'Zumo de melocotón', 'Tónica', 'Bebida energética', 'Agua con gas', 'Hielo', 'Velas', 'Pilas', 'Bombillas', 'Fósforos', 'Insecticida', 'Ambientador', 'Papel de cocina', 'Papel de aluminio', 'Film transparente', 'Fregasuelos', 'Limpiacristales', 'Lejía', 'Amoniaco', 'Estropajos', 'Bayetas', 'Guantes de limpieza', 'Desodorante', 'Crema hidratante', 'Protector solar', 'Cuchillas de afeitar', 'Espuma de afeitar', 'Algodón', 'Bastoncillos', 'Tiritas', 'Alcohol', 'Agua oxigenada', 'Comida para mascotas', 'Arena para gatos', 'Juguetes para mascotas', 'Correa', 'Collar', 'Biberón', 'Chupete', 'Pañales', 'Toallitas húmedas', 'Potitos', 'Leche en polvo', 'Cereales infantiles', 'Galletas para bebés', 'Compresas', 'Tampones', 'Salvaslips', 'Preservativos', 'Lubricante', 'Enjuague bucal', 'Seda dental', 'Cepillo de dientes', 'Ensalada preparada', 'Gazpacho', 'Salmorejo', 'Hummus', 'Guacamole', 'Aceite de girasol', 'Vinagre de manzana', 'Salsa de soja', 'Salsa picante', 'Hierbas provenzales', 'Azafrán', 'Vainilla', 'Levadura', 'Bicarbonato', 'Fruta en almíbar', 'Tomate frito', 'Tomate triturado'];
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
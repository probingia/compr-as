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
    const listaAutocompletado = ['Manzanas', 'Plátanos', 'Naranjas', 'Uvas', 'Fresas', 'Arándanos', 'Frambuesas', 'Moras', 'Sandía', 'Melón', 'Piña', 'Mangos', 'Kiwis', 'Limones', 'Limas', 'Aguacates', 'Duraznos', 'Nectarinas', 'Ciruelas', 'Cerezas', 'Peras', 'Toronja', 'Granada', 'Papaya', 'Higos', 'Dátiles', 'Coco', 'Maracuyá', 'Guayaba', 'Lichi', 'Tomates', 'Lechuga', 'Espinacas', 'Kale', 'Brócoli', 'Coliflor', 'Zanahorias', 'Apio', 'Pepinos', 'Pimientos', 'Cebollas', 'Ajo', 'Papas', 'Batatas', 'Champiñones', 'Calabacín', 'Berenjena', 'Espárragos', 'Maíz', 'Judías verdes', 'Guisantes', 'Repollo', 'Coles de Bruselas', 'Rábanos', 'Remolacha', 'Nabo', 'Calabaza', 'Jengibre', 'Cilantro', 'Perejil', 'Carne molida de res', 'Bistec de res', 'Asado de res', 'Costillas de res', 'Carne para estofado', 'Chuletas de cerdo', 'Lomo de cerdo', 'Tocino', 'Salchichas de cerdo', 'Jamón', 'Pechuga de pollo', 'Muslos de pollo', 'Alas de pollo', 'Pollo entero', 'Pavo molido', 'Pechuga de pavo', 'Salmón', 'Atún', 'Tilapia', 'Bacalao', 'Camarones', 'Almejas', 'Mejillones', 'Cangrejo', 'Langosta', 'Leche', 'Crema de leche', 'Mantequilla', 'Margarina', 'Yogur', 'Queso cheddar', 'Queso mozzarella', 'Queso suizo', 'Queso parmesano', 'Queso de cabra', 'Requesón', 'Crema agria', 'Huevos', 'Leche de almendras', 'Leche de soja', 'Leche de avena', 'Pan de molde', 'Panecillos', 'Bagels', 'Muffins ingleses', 'Pan de pita', 'Tortillas de harina', 'Tortillas de maíz', 'Cereal de desayuno', 'Avena', 'Granola', 'Barritas de cereal', 'Arroz blanco', 'Arroz integral', 'Pasta espagueti', 'Pasta penne', 'Quinoa', 'Cuscús', 'Lentejas', 'Frijoles negros', 'Garbanzos', 'Tomates enlatados', 'Salsa de tomate', 'Frijoles enlatados', 'Maíz enlatado', 'Guisantes enlatados', 'Atún enlatado', 'Sopas enlatadas', 'Caldo de pollo', 'Sal', 'Pimienta negra', 'Aceite de oliva', 'Aceite vegetal', 'Vinagre blanco', 'Ketchup', 'Mostaza', 'Mayonesa', 'Salsa de soja', 'Salsa picante', 'Miel', 'Jarabe de arce', 'Mermelada', 'Mantequilla de cacahuete', 'Orégano seco', 'Albahaca seca', 'Romero seco', 'Tomillo seco', 'Pimentón', 'Chile en polvo', 'Comino molido', 'Canela molida', 'Nuez moscada', 'Ajo en polvo', 'Cebolla en polvo', 'Harina de trigo', 'Azúcar granulada', 'Polvo de hornear', 'Bicarbonato de sodio', 'Extracto de vainilla', 'Chispas de chocolate', 'Cacao en polvo', 'Levadura', 'Agua embotellada', 'Agua con gas', 'Jugo de naranja', 'Jugo de manzana', 'Refrescos de cola', 'Té negro', 'Café molido', 'Leche con chocolate', 'Bebidas deportivas', 'Bebidas energéticas', 'Cerveza', 'Vino tinto', 'Vino blanco', 'Verduras congeladas', 'Frutas congeladas', 'Pizza congelada', 'Comidas preparadas congeladas', 'Helado', 'Papas fritas congeladas', 'Nuggets de pollo congelados', 'Papas fritas de bolsa', 'Tortilla chips', 'Pretzels', 'Galletas saladas', 'Galletas dulces', 'Palomitas de maíz', 'Frutos secos', 'Frutas secas', 'Barritas de granola', 'Chocolate en barra', 'Champú', 'Acondicionador', 'Jabón en barra', 'Gel de ducha', 'Pasta de dientes', 'Cepillo de dientes', 'Hilo dental', 'Enjuague bucal', 'Desodorante', 'Loción corporal', 'Protector solar', 'Maquinillas de afeitar', 'Crema de afeitar', 'Productos de higiene femenina', 'Papel higiénico', 'Detergente para la ropa', 'Suavizante de telas', 'Lejía', 'Limpiador multiusos', 'Limpiacristales', 'Lavavajillas líquido', 'Detergente para lavavajillas', 'Esponjas de cocina', 'Toallas de papel', 'Bolsas de basura', 'Pañales', 'Toallitas húmedas para bebé', 'Fórmula para bebés', 'Comida para bebés', 'Champú para bebé', 'Loción para bebé', 'Comida para perros', 'Galletas para perros', 'Comida para gatos', 'Arena para gatos', 'Aceitunas', 'Alcaparras', 'Anchoas', 'Sardinas enlatadas', 'Chorizo', 'Salchichón', 'Mortadela', 'Pastel de carne', 'Tofu', 'Tempeh', 'Seitan', 'Leche de coco', 'Leche de arroz', 'Queso feta', 'Queso azul', 'Queso brie', 'Queso camembert', 'Queso gouda', 'Queso provolone', 'Pan de centeno', 'Pan integral', 'Croissants', 'Donas', 'Galletas de avena', 'Galletas de chocolate', 'Arroz basmati', 'Arroz jazmín', 'Fideos de arroz', 'Lasaña', 'Macarrones', 'Fideos udon', 'Fideos soba', 'Salsa barbacoa', 'Salsa teriyaki', 'Salsa Worcestershire', 'Mostaza de Dijon', 'Vinagre de vino tinto', 'Vinagre balsámico', 'Aceite de sésamo', 'Aceite de coco', 'Pimienta de cayena', 'Cúrcuma', 'Curry en polvo', 'Jengibre en polvo', 'Semillas de chía', 'Semillas de lino', 'Semillas de sésamo', 'Miel de agave', 'Azúcar moreno', 'Harina de almendras', 'Harina de coco', 'Nueces', 'Almendras', 'Pistachos', 'Anacardos', 'Cacahuetes', 'Té verde', 'Té de manzanilla', 'Café en grano', 'Café instantáneo', 'Jugo de arándano', 'Jugo de uva', 'Limonada', 'Tónica', 'Cerveza artesanal', 'Vino rosado', 'Champán', 'Ron', 'Vodka', 'Ginebra', 'Whisky', 'Tequila', 'Brandy', 'Edamame congelado', 'Pescado empanizado congelado', 'Hamburguesas vegetales congeladas', 'Waffles congelados', 'Pan de ajo congelado', 'Chicles', 'Caramelos', 'Gomitas', 'Malvaviscos', 'Regaliz', 'Jabón de manos líquido', 'Toallitas desinfectantes', 'Limpiador de baño', 'Limpiador de cocina', 'Bolsas para sándwich', 'Papel de aluminio', 'Film transparente', 'Velas', 'Cerillas', 'Bombillas', 'Pilas', 'Comida para peces', 'Comida para pájaros', 'Heno para roedores', 'Lechuga iceberg', 'Lechuga romana', 'Rúcula', 'Acelgas', 'Col rizada', 'Puerros', 'Cebolletas', 'Alcachofas', 'Hinojo', 'Chayote', 'Okra', 'Colinabo', 'Chirivía', 'Manzanas Granny Smith', 'Manzanas Fuji', 'Manzanas Gala', 'Uvas rojas', 'Uvas verdes', 'Melocotones', 'Albaricoques', 'Caquis', 'Carambola', 'Rambután', 'Mangostán', 'Fruta del dragón', 'Salchichas italianas', 'Salchichas de pavo', 'Carne de cordero', 'Costillas de cordero', 'Pato', 'Codorniz', 'Hígado de pollo', 'Mollejas', 'Pulpo', 'Calamar', 'Vieiras', 'Ostras', 'Yogur griego', 'Yogur de soja', 'Kéfir', 'Leche condensada', 'Leche evaporada', 'Nata para montar', 'Queso crema', 'Queso manchego', 'Queso de oveja', 'Pan de masa madre', 'Focaccia', 'Ciabatta', 'Pan de ajo', 'Crutones', 'Cereales integrales', 'Muesli', 'Arroz salvaje', 'Cebada', 'Bulgur', 'Pasta de trigo integral', 'Gnocchi', 'Ravioles', 'Tortellini', 'Salsa Alfredo', 'Salsa pesto', 'Salsa marinara', 'Chutney de mango', 'Salsa de pescado', 'Pasta de curry', 'Wasabi', 'Rábano picante', 'Sal rosa del Himalaya', 'Pimienta blanca', 'Azafrán', 'Cardamomo', 'Clavo', 'Anís estrellado', 'Hojas de laurel', 'Vainas de vainilla', 'Azúcar glas', 'Azúcar de coco', 'Melaza', 'Levadura nutricional', 'Goma xantana', 'Pipas de girasol', 'Pipas de calabaza', 'Nueces de Brasil', 'Nueces de macadamia', 'Avellanas', 'Té de jengibre', 'Té de menta', 'Mate', 'Horchata', 'Agua de coco', 'Kombucha', 'Sidra', 'Vino de Oporto', 'Vermut', 'Licor de café', 'Sorbete', 'Yogur helado', 'Polos de hielo', 'Masa de hojaldre congelada', 'Masa para galletas congelada', 'Frutos rojos congelados', 'Mango congelado', 'Piña congelada', 'Barritas de proteína', 'Galletas de arroz', 'Turrón', 'Mazapán', 'Fruta confitada', 'Crema de avellanas', 'Enjuague bucal sin alcohol', 'Protector labial', 'Crema de manos', 'Aceite corporal', 'Sales de baño', 'Mascarilla facial', 'Algodón', 'Bastoncillos de algodón', 'Tiritas', 'Vendas', 'Alcohol isopropílico', 'Agua oxigenada', 'Ambientador', 'Insecticida', 'Bolsas de congelación', 'Filtros de café', 'Servilletas de papel', 'Palillos', 'Juguetes para perros', 'Juguetes para gatos', 'Correa para perro', 'Collar para gato', 'Apio nabo', 'Endivias', 'Grelos', 'Tupinambo', 'Tomatillos', 'Clementinas', 'Mandarinas', 'Pomelos', 'Kumquats', 'Longan', 'Salak', 'Carne de venado', 'Carne de búfalo', 'Salmón ahumado', 'Trucha', 'Rodaballo', 'Mero', 'Pez espada', 'Anguila', 'Erizos de mar', 'Percebes', 'Queso emmental', 'Queso gruyere', 'Queso havarti', 'Queso roquefort', 'Mascarpone', 'Pan de pita integral', 'Naan', 'Pumpernickel', 'Scones', 'Magdalenas', 'Polenta', 'Amaranto', 'Mijo', 'Harina de centeno', 'Harina de espelta', 'Fideos de huevo', 'Couscous integral', 'Salsa de ostras', 'Salsa hoisin', 'Vinagre de arroz', 'Aceite de aguacate', 'Aceite de nuez', 'Pimentón ahumado', 'Semillas de amapola', 'Semillas de cilantro', 'Fenogreco', 'Galanga', 'Hierba de limón', 'Edulcorante artificial', 'Stevia', 'Pectina', 'Castañas', 'Piñones', 'Té oolong', 'Té blanco', 'Café descafeinado', 'Cacao caliente', 'Zumo de tomate', 'Zumo de piña', 'Cerveza sin alcohol', 'Licor de hierbas', 'Aperol', 'Campari', 'Masa para pizza congelada', 'Croquetas congeladas', 'Empanadillas congeladas', 'Canelones congelados', 'Verduras para saltear congeladas', 'Patatas bravas congeladas', 'Chocolate blanco', 'Chocolate negro', 'Bombones', 'Frutos secos cubiertos de chocolate', 'Cortaúñas', 'Lima de uñas', 'Pinzas', 'Tónico facial', 'Desmaquillante', 'Espuma de afeitar', 'After-shave', 'Talco', 'Guantes de limpieza', 'Estropajos', 'Leche en polvo para bebé', 'Cereales para bebé', 'Galletas para la dentición', 'Aceite para bebé', 'Premios para perros', 'Huesos de cuero', 'Hierba gatera', 'Snacks para gatos', 'Bok choy', 'Daikon', 'Jícama', 'Kohlrabi', 'Patatas moradas', 'Yuca', 'Lulos', 'Uchuvas', 'Tamarillo', 'Tamarindo', 'Carne de cabra', 'Chuletón de buey', 'Butifarra', 'Morcilla', 'Sobrasada', 'Ancas de rana', 'Caviar', 'Surimi', 'Yogur de coco', 'Yogur de oveja', 'Queso halloumi', 'Paneer', 'Panettone', 'Stollen', 'Biscotti', 'Grissini', 'Tostadas', 'Harina de garbanzo', 'Harina de arroz', 'Tapioca', 'Sémola', 'Fideos ramen', 'Salsa de soja baja en sodio', 'Mirin', 'Sake', 'Aceite de palma', 'Ghee', 'Pimienta de Jamaica', 'Zumaque', 'Asafétida', 'Achiote', 'Extracto de almendra', 'Colorante alimentario', 'Glaseado para pasteles', 'Decoraciones de azúcar', 'Anacardos salados', 'Almendras tostadas', 'Té chai', 'Té rooibos', 'Bebida de almendras', 'Bebida de arroz', 'Refresco de jengibre', 'Zumo de mango', 'Zumo de melocotón', 'Cerveza negra', 'Cerveza de trigo', 'Prosecco', 'Cava', 'Absenta', 'Sake', 'Pacharán', 'Orujo', 
        'Helado de vainilla', 'Helado de chocolate', 'Helado de fresa', 'Tarta de queso congelada', 'Tarta de manzana congelada', 'Rollitos de primavera congelados', 'Gyozas congeladas', 'Aros de cebolla congelados', 'Barritas de pescado congeladas', 'Caramelos de menta', 'Pastillas para la tos', 'Barritas energéticas', 'Chips de plátano', 'Chips de vegetales', 'Hilo dental con cera', 'Cepillo de dientes eléctrico', 'Irrigador bucal', 'Crema antiarrugas', 'Sérum facial', 'Contorno de ojos', 'Exfoliante corporal', 'Piedra pómez', 'Limpiador de hornos', 'Desatascador de tuberías', 'Suavizante concentrado', 'Quitamanchas', 'Papilla de frutas para bebé', 'Potitos de verdura para bebé', 'Juguetes para la dentición', 'Biberones', 'Chupetes', 'Comida húmeda para perros', 'Comida húmeda para gatos', 'Vitaminas para mascotas', 'Malta para gatos', 'Acelga roja', 'Berros', 'Canónigos', 'Cardo', 'Escarola', 'Guisantes lágrima', 'Habas frescas', 'Tirabeques', 'Tomate raf', 'Tomate rosa', 'Brevas', 'Chirimoya', 'Kiwano', 'Nísperos', 'Paraguayas', 'Codillo de cerdo', 'Entrecot de ternera', 'Solomillo de cerdo ibérico', 'Panceta', 'Fiambre de pavo', 'Cangrejo real', 'Langostinos', 'Cigalas', 'Navajas', 'Berberechos', 'Requesón de cabra', 'Yogur búlgaro', 'Skyr', 'Queso cottage', 'Queso quark', 'Pan de espelta', 'Pan de kamut', 'Colines', 'Picos de pan', 'Regañás', 'Harina de fuerza', 'Harina de repostería', 'Cuscús perlado', 'Fregola', 'Orzo', 'Salsa de yogur', 'Salsa tártara', 'Vinagreta', 'Pasta de sésamo (tahini)', 'Melaza de granada', 'Aceite de girasol', 'Manteca de cerdo', 'Pimienta rosa', 'Bayas de enebro', 'Macis', 'Nigella', 'Sal de apio', 'Extracto de limón', 'Agua de azahar', 'Fondant', 'Nueces pecanas', 'Castañas de cajú', 'Infusión de tila', 'Infusión de poleo menta', 'Café torrefacto', 'Bebida de soja con chocolate', 'Mosto', 'Zumo de granada', 'Zumo de multifrutas', 'Cerveza tostada', 'Cerveza roja', 'Lambrusco', 'Moscato', 'Grappa', 'Pisco', 'Mezcal', 'Cachaça', 'Licor de melocotón', 'Licor de manzana', 'Helado de pistacho', 'Helado de turrón', 'Tiramisú congelado', 'Coulant de chocolate congelado', 'Lasaña congelada', 'Moussaka congelada', 'Pimientos del piquillo rellenos congelados', 'Alcachofas rebozadas congeladas', 'Chocolate con leche', 'Chocolate con almendras', 'Tableta de chocolate para postres', 'Almendras garrapiñadas', 'Pistachos tostados y salados', 'Enjuague bucal infantil', 'Pasta de dientes para niños', 'Cepillo de dientes suave', 'Crema hidratante con color', 'BB cream', 'CC cream', 'Mascarilla para el pelo', 'Sérum para el pelo', 'Laca', 'Gomina', 'Cera para el pelo', 'Descalcificador para lavadora', 'Abrillantador para lavavajillas', 'Sal para lavavajillas', 'Friegasuelos', 'Leche de continuación para bebé', 'Toallitas para el cambio de pañal', 'Crema para el culito del bebé', 'Esponja natural para bebé', 'Tijeras de uñas para bebé', 'Pienso para cachorros', 'Pienso para perros senior', 'Pienso para gatos esterilizados', 'Pienso para gatitos', 'Snacks dentales para perros', 'Juguetes interactivos para gatos', 'Rascadores para gatos', 'Camas para mascotas', 'Endibia roja', 'Radicchio', 'Tatsoi', 'Calabaza bonetera', 'Calabaza cacahuete', 'Pimiento de Padrón', 'Pimiento choricero', 'Gindillas', 'Ajo negro', 'Cebolla morada', 'Membrillo', 'Physalis', 'Mirabeles', 'Reinetas', 'Verde doncella', 'Carrilleras de cerdo', 'Entraña de ternera', 'Magret de pato', 'Confit de pato', 'Cecina', 'Pulpo cocido', 'Sepia', 'Bígaros', 'Cañaíllas', 'Ortiguillas de mar', 'Cuajada', 'Leche de cabra', 'Kumis', 'Queso de tetilla', 'Queso idiazábal', 'Pan de hogaza', 'Pan de chapata', 'Pan de cristal', 'Tortas de aceite', 'Rosquilletas', 'Harina de maíz', 'Harina de teff', 'Polenta instantánea', 'Arroz bomba', 'Arroz venere', 'Salsa brava', 'Salsa romesco', 'Alioli', 'Pasta de ají amarillo', 'Sirope de chocolate', 'Sirope de caramelo', 'Manteca de cacao', 'Grasa de pato', 'Pimienta de Sichuan', 'Cardamomo negro', 'Vainilla en polvo', 'Sal ahumada', 'Sal en escamas', 'Esencia de ron', 'Esencia de anís', 'Perlas de azúcar', 'Fideos de chocolate', 'Cacahuetes garrapiñados', 'Nueces de pecán caramelizadas', 'Infusión de frutos rojos', 'Infusión relajante', 'Café en cápsulas', 'Bebida de avellana', 'Zumo de pomelo', 'Zumo de albaricoque', 'Cerveza IPA', 'Cerveza stout', 'Vino frizzante', 'Vino de aguja', 'Licor de cereza', 'Licor de almendras', 'Amaretto', 'Frangelico', 'Limoncello', 'Sambuca', 'Helado de limón', 'Helado de café', 'Profiteroles congelados', 'Buñuelos congelados', 'Churros congelados', 'Tequeños congelados', 'Alitas de pollo adobadas congeladas', 'Costillas a la barbacoa congeladas', 'Salteado de gambas y verduras congelado', 'Paella de marisco congelada', 'Chocolate para fundir', 'Cacao puro en polvo', 'Pepitas de chocolate', 'Fruta deshidratada', 'Orejones', 'Ciruelas pasas', 'Dátiles sin hueso', 'Higos secos', 'Pasta de dientes blanqueadora', 'Pasta de dientes para encías sensibles', 'Colutorio con flúor', 'Aceite seco', 'Crema reafirmante', 'Gel reductor', 'Tratamiento anticelulítico', 'Champú en seco', 'Mascarilla de color para el pelo', 'Protector térmico para el pelo', 'Limpiador antical', 'Detergente para prendas delicadas', 'Bolas antipolillas', 'Recambios de ambientador', 'Cereales hidrolizados para bebé', 'Tarritos de fruta y yogur para bebé', 'Toallitas nasales para bebé', 'Aspirador nasal para bebé', 'Termómetro de baño', 'Pienso hipoalergénico para perros', 'Pienso sin cereales para gatos', 'Snacks naturales para perros', 'Latas de paté para gatos', 'Juguetes de cuerda para perros', 'Plumeros para gatos', 'Lecho vegetal para roedores', 'Piedras minerales para pájaros'];
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

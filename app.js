
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
        // Bebés (id: 1)
        'Aceite para bebé': 1, 'Aspirador nasal para bebé': 1, 'Biberón': 1, 'Cereales hidrolizados para bebé': 1, 'Cereales infantiles': 1, 'Chupete': 1, 'Colonia infantil': 1, 'Crema para el culito del bebé': 1, 'Crema para pañal': 1, 'Esponja natural para bebé': 1, 'Fórmula infantil': 1, 'Galletas para bebés': 1, 'Jabón infantil': 1, 'Juguetes para la dentición': 1, 'Leche de continuación': 1, 'Leche en polvo para bebé': 1, 'Mordedor': 1, 'Pañales': 1, 'Papilla de frutas para bebé': 1, 'Potito': 1, 'Potitos de verdura para bebé': 1, 'Tarritos de fruta y yogur para bebé': 1, 'Termómetro de baño': 1, 'Tijeras de uñas para bebé': 1, 'Toallitas húmedas': 1, 'Toallitas nasales para bebé': 1, 'Toallitas para el cambio de pañal': 1,
        // Bebidas y zumos  (id: 2)
        'Agua': 2, 'Agua con gas': 2, 'Agua de coco': 2, 'Agua tónica': 2, 'Anís': 2, 'Aperol': 2, 'Bebida de almendras': 2, 'Bebida de arroz': 2, 'Bebida de avellana': 2, 'Bebida de avena': 2, 'Bebida de soja': 2, 'Bebida de soja con chocolate': 2, 'Bebida energética': 2, 'Bebida isotónica': 2, 'Brandy': 2, 'Cacao caliente': 2, 'Café': 2, 'Café en cápsulas': 2, 'Café soluble': 2, 'Campari': 2, 'Cava': 2, 'Cerveza': 2, 'Cerveza IPA': 2, 'Cerveza de trigo': 2, 'Cerveza negra': 2, 'Cerveza roja': 2, 'Cerveza sin alcohol': 2, 'Cerveza stout': 2, 'Cerveza tostada': 2, 'Champán': 2, 'Cointreau': 2, 'Coñac': 2, 'Ginebra': 2, 'Horchata': 2, 'Infusión': 2, 'Infusión de frutos rojos': 2, 'Infusión relajante': 2, 'Jerez': 2, 'Kombucha': 2, 'Leche de coco': 2, 'Licor': 2, 'Licor de almendras': 2, 'Licor de cereza': 2, 'Licor de hierbas': 2, 'Limonada': 2, 'Limoncello': 2, 'Mosto': 2, 'Néctar': 2, 'Pacharán': 2, 'Prosecco': 2, 'Refresco': 2, 'Refresco de cola': 2, 'Refresco de jengibre': 2, 'Refresco de limón': 2, 'Refresco de naranja': 2, 'Ron': 2, 'Sake': 2, 'Sidra': 2, 'Té': 2, 'Té chai': 2, 'Té rooibos': 2, 'Tequila': 2, 'Vermut': 2, 'Vino': 2, 'Vino blanco': 2, 'Vino de aguja': 2, 'Vino de mesa': 2, 'Vino dulce': 2, 'Vino espumoso': 2, 'Vino frizzante': 2, 'Vino rosado': 2, 'Vino tinto': 2, 'Vodka': 2, 'Whisky': 2, 'Zumo': 2, 'Zumo de albaricoque': 2, 'Zumo de frutas': 2, 'Zumo de granada': 2, 'Zumo de mango': 2, 'Zumo de manzana': 2, 'Zumo de melocotón': 2, 'Zumo de multifrutas': 2, 'Zumo de naranja': 2, 'Zumo de piña': 2, 'Zumo de pomelo': 2, 'Zumo de tomate': 2,
        // Carnes y embutidos (id: 3)
        'Alitas de pollo': 3, 'Bacon': 3, 'Butifarra': 3, 'Carne de cerdo': 3, 'Carne de pollo': 3, 'Carne de ternera': 3, 'Carne picada': 3, 'Chistorra': 3, 'Chorizo': 3, 'Chuleta': 3, 'Codillo': 3, 'Conejo': 3, 'Costillas': 3, 'Embutido': 3, 'Foie gras': 3, 'Fuet': 3, 'Hamburguesa': 3, 'Jamón': 3, 'Jamón cocido': 3, 'Jamón serrano': 3, 'Lacón': 3, 'Lomo': 3, 'Longaniza': 3, 'Morcilla': 3, 'Mortadela': 3, 'Muslo de pollo': 3, 'Panceta': 3, 'Pato': 3, 'Pavo': 3, 'Pechuga de pollo': 3, 'Pechuga de pavo': 3, 'Pincho': 3, 'Pollo': 3, 'Salami': 3, 'Salchicha': 3, 'Salchichón': 3, 'Solomillo': 3,
        // Congelados (id: 4)
        'Acelgas congeladas': 4, 'Alitas de pollo adobadas congeladas': 4, 'Arroz congelado': 4, 'Bacalao congelado': 4, 'Buñuelos congelados': 4, 'Calamares congelados': 4, 'Canelones congelados': 4, 'Carne congelada': 4, 'Coliflor congelada': 4, 'Costillas a la barbacoa congeladas': 4, 'Croquetas congeladas': 4, 'Empanadillas congeladas': 4, 'Espinacas congeladas': 4, 'Fruta congelada': 4, 'Frutos rojos congelados': 4, 'Gambas congeladas': 4, 'Guisantes congelados': 4, 'Helado': 4, 'Hielo': 4, 'Judías verdes congeladas': 4, 'Langostinos congelados': 4, 'Lasaña congelada': 4, 'Mango congelado': 4, 'Marisco congelado': 4, 'Menestra congelada': 4, 'Merluza congelada': 4, 'Paella congelada': 4, 'Paella de marisco congelada': 4, 'Pan congelado': 4, 'Patatas fritas congeladas': 4, 'Pescado congelado': 4, 'Piña congelada': 4, 'Pizza congelada': 4, 'Platos preparados congelados': 4, 'Pollo congelado': 4, 'Profiteroles congelados': 4, 'Salmón congelado': 4, 'Salteado de gambas y verduras congelado': 4, 'Sopa congelada': 4, 'Tarta congelada': 4, 'Tequeños congelados': 4, 'Verdura congelada': 4,
        // Conservas y legumbres (id: 5)
        'Aceitunas': 5, 'Alcaparras': 5, 'Alcachofas en conserva': 5, 'Alubias': 5, 'Anchoas': 5, 'Atún en conserva': 5, 'Berberechos en conserva': 5, 'Caballa en conserva': 5, 'Champiñones en conserva': 5, 'Espárragos en conserva': 5, 'Fabada': 5, 'Garbanzos': 5, 'Guisantes en conserva': 5, 'Habas': 5, 'Judías': 5, 'Judía pinta': 5, 'Lentejas': 5, 'Maíz en conserva': 5, 'Melocotón en almíbar': 5, 'Mejillones en conserva': 5, 'Pimientos en conserva': 5, 'Piña en almíbar': 5, 'Sardinas en conserva': 5, 'Tomate en conserva': 5, 'Zanahorias en conserva': 5,
        // Cuidado personal (id: 6)
        'Acondicionador': 6, 'Aceite corporal': 6, 'After-shave': 6, 'Algodón': 6, 'Bastoncillos': 6, 'Cepillo de dientes': 6, 'Champú': 6, 'Champú en seco': 6, 'Colonia': 6, 'Colutorio con flúor': 6, 'Compresas': 6, 'Crema de afeitar': 6, 'Crema de manos': 6, 'Crema depilatoria': 6, 'Crema facial': 6, 'Crema hidratante': 6, 'Crema reafirmante': 6, 'Crema solar': 6, 'Cuchillas de afeitar': 6, 'Desodorante': 6, 'Enjuague bucal': 6, 'Espuma de afeitar': 6, 'Gel de baño': 6, 'Gel fijador': 6, 'Gel reductor': 6, 'Hilo dental': 6, 'Jabón': 6, 'Laca': 6, 'Maquinilla de afeitar': 6, 'Mascarilla de color para el pelo': 6, 'Mascarilla facial': 6, 'Papel higiénico': 6, 'Pasta de dientes': 6, 'Pasta de dientes blanqueadora': 6, 'Pasta de dientes para encías sensibles': 6, 'Peine': 6, 'Protector labial': 6, 'Protector térmico para el pelo': 6, 'Salvaslips': 6, 'Tampones': 6, 'Tinte para el pelo': 6, 'Toallitas desmaquillantes': 6, 'Tratamiento anticelulítico': 6,
        // Desayuno (id: 7)
        'Bizcochos': 7, 'Cacao en polvo': 7, 'Cereales': 7, 'Galletas': 7, 'Mermelada': 7, 'Miel': 7,
        // Despensa (id: 8)
        'Aceite': 8, 'Aceite de girasol': 8, 'Aceite de oliva': 8, 'Aderezo': 8, 'Alioli': 8, 'Azafrán': 8, 'Azúcar': 8, 'Caldo': 8, 'Canela': 8, 'Colorante alimentario': 8, 'Comino': 8, 'Especias': 8, 'Harina': 8, 'Ketchup': 8, 'Laurel': 8, 'Levadura': 8, 'Mayonesa': 8, 'Mostaza': 8, 'Orégano': 8, 'Pan rallado': 8, 'Perejil': 8, 'Pimentón': 8, 'Pimienta': 8, 'Puré de patatas': 8, 'Sal': 8, 'Sal fina': 8, 'Sal gorda': 8, 'Sal marina': 8, 'Salsa': 8, 'Salsa de soja': 8, 'Salsa de tomate': 8, 'Sémola': 8, 'Soja texturizada': 8, 'Sopa': 8, 'Tomate frito': 8, 'Vinagre': 8, 
        // Frutas (id: 9)
        'Aguacate': 9, 'Albaricoque': 9, 'Arándanos': 9, 'Cereza': 9, 'Chirimoya': 9, 'Ciruela': 9, 'Ciruelas pasas': 9, 'Coco': 9, 'Dátiles sin hueso': 9, 'Frambuesa': 9, 'Fresa': 9, 'Fruta deshidratada': 9, 'Granada': 9, 'Higo': 9, 'Higos secos': 9, 'Kiwi': 9, 'Lima': 9, 'Limón': 9, 'Mandarina': 9, 'Mango': 9, 'Manzana': 9, 'Maracuyá': 9, 'Melocotón': 9, 'Melón': 9, 'Membrillo': 9, 'Naranja': 9, 'Nectarina': 9, 'Níspero': 9, 'Orejones': 9, 'Papaya': 9, 'Paraguaya': 9, 'Pera': 9, 'Piña': 9, 'Plátano': 9, 'Pomelo': 9, 'Sandía': 9, 'Uva': 9,
        // Frutos secos y snacks (id: 10)
        'Almendra': 10, 'Anacardo': 10, 'Aperitivo': 10, 'Avellana': 10, 'Cacahuete': 10, 'Castaña': 10, 'Chicle': 10, 'Chocolate (snack)': 10, 'Chuchería': 10, 'Dátil': 10, 'Frutos secos': 10, 'Nueces': 10, 'Palomitas': 10, 'Patatas fritas': 10, 'Piñón': 10, 'Pipa': 10, 'Pistacho': 10, 'Snack': 10, 
        // Hogar y bazar (id: 11)
        'Ambientador': 11, 'Bombilla': 11, 'Caja de almacenaje': 11, 'Fósforos': 11, 'Mechero': 11, 'Papel de aluminio': 11, 'Papel de cocina': 11, 'Papel de horno': 11, 'Papel film': 11, 'Pila': 11, 'Pinzas': 11, 'Sartén': 11, 'Servilleta': 11, 'Vela': 11,
        // Lácteos y huevos (id: 12)
        'Actimel': 12, 'Batido': 12, 'Cuajada': 12, 'Flan': 12, 'Huevo': 12, 'Kéfir': 12, 'Leche': 12, 'Leche condensada': 12, 'Leche desnatada': 12, 'Leche en polvo': 12, 'Leche entera': 12, 'Leche semidesnatada': 12, 'Mantequilla': 12, 'Margarina': 12, 'Mascarpone': 12, 'Nata': 12, 'Natillas': 12, 'Queso': 12, 'Queso azul': 12, 'Queso de cabra': 12, 'Queso de untar': 12, 'Queso en lonchas': 12, 'Queso fresco': 12, 'Queso rallado': 12, 'Requesón': 12, 'Yogur': 12, 'Yogur de frutas': 12, 'Yogur desnatado': 12, 'Yogur griego': 12, 'Yogur líquido': 12, 'Yogur natural': 12, 
        // Limpieza (id: 13)
        'Abrillantador': 13, 'Amoniaco': 13, 'Antical': 13, 'Bayeta': 13, 'Bolas antipolillas': 13, 'Bolsa de basura': 13, 'Cepillo': 13, 'Cera': 13, 'Cubo': 13, 'Detergente': 13, 'Detergente para prendas delicadas': 13, 'Escoba': 13, 'Estropajo': 13, 'Fregasuelos': 13, 'Fregona': 13, 'Guantes': 11, 'Insecticida': 13, 'Lavavajillas': 13, 'Lejía': 13, 'Limpiacristales': 13, 'Limpiador': 13, 'Limpiador antical': 13, 'Limpiador de baño': 13, 'Limpiador de cocina': 13, 'Limpiador de muebles': 13, 'Quitamanchas': 13, 'Recambios de ambientador': 13, 'Recogedor': 13, 'Suavizante': 13,
        // Mascotas (id: 14)
        'Arena para gatos': 14, 'Comida para gatos': 14, 'Comida para pájaros': 14, 'Comida para perros': 14, 'Comida para peces': 14, 'Comida para roedores': 14, 'Galletas para perros': 14, 'Hierba gatera': 14, 'Hueso para perro': 14, 'Huesos de cuero': 14, 'Juguete para gato': 14, 'Juguete para perro': 14, 'Juguetes de cuerda para perros': 14, 'Latas de paté para gatos': 14, 'Lecho para roedores': 14, 'Piedra para pájaros': 14, 'Piedras minerales para pájaros': 14, 'Pienso hipoalergénico para perros': 14, 'Pienso sin cereales para gatos': 14, 'Plumeros para gatos': 14, 'Premios para perros': 14, 'Snack para gato': 14, 'Snack para perro': 14, 'Snacks naturales para perros': 14,
        // Panadería y bollería (id: 15)
        'Baguette': 15, 'Bizcocho': 15, 'Bollería': 15, 'Croissant': 15, 'Donut': 15, 'Empanada': 15, 'Ensaimada': 15, 'Magdalena': 15, 'Muffin': 15, 'Napolitana': 15, 'Pan': 15, 'Pan de hamburguesa': 15, 'Pan de leche': 15, 'Pan de molde': 15, 'Pan de perrito caliente': 15, 'Pan integral': 15, 'Pan tostado': 15, 'Pastel': 15, 'Tarta': 15, 'Tostada': 15,
        // Parafarmacia (id: 16)
        'Gasas': 16, 'Tiritas': 16, 
        // Pasta y arroces (id: 17)
        'Arroz': 17, 'Cuscús': 17, 'Espaguetis': 17, 'Fideos': 17, 'Lasaña': 17, 'Macarrones': 17, 'Pasta': 17, 'Pasta fresca': 17, 'Quinoa': 17, 'Raviolis': 17, 'Tallarines': 17, 'Tortellini': 17,
        // Pescados (id: 18)
        'Almejas': 18, 'Atún': 18, 'Bacalao': 18, 'Berberechos': 18, 'Boquerones': 18, 'Caballa': 18, 'Calamares': 18, 'Cangrejo': 18, 'Dorada': 18, 'Gallo': 18, 'Gambas': 18, 'Langostinos': 18, 'Lenguado': 18, 'Lubina': 18, 'Mejillones': 18, 'Merluza': 18, 'Pescadilla': 18, 'Pulpo': 18, 'Salmón': 18, 'Sardinas': 18, 'Sepia': 18, 'Trucha': 18,
        // Platos preparados (id: 19)
        'Canelones': 19, 'Crema': 19, 'Croquetas': 19, 'Empanadillas': 19, 'Ensalada': 19, 'Ensaladilla rusa': 19, 'Gazpacho': 19, 'Lasaña (preparado)': 19, 'Paella': 19, 'Pasta preparada': 19, 'Pizza': 19, 'Pollo asado': 19, 'Puré': 19, 'Salmorejo': 19, 'Tortilla': 19,
        // Postres y repostería (id: 20)
        'Arroz con leche': 20, 'Brownie': 20, 'Chocolate': 20, 'Coulant': 20, 'Crema catalana': 20, 'Crema pastelera': 20, 'Flan': 20, 'Fruta en almíbar': 20, 'Gelatina': 20, 'Hojaldre': 20, 'Mousse': 20, 'Natillas': 20, 'Profiteroles': 20, 'Tiramisú': 20, 'Tocino de cielo': 20, 'Turrón': 20,
        // Textil (id: 21)
        'Albornoz': 21, 'Calcetines': 21, 'Calzoncillos': 21, 'Camiseta': 21, 'Leotardos': 21, 'Mantel': 21, 'Medias': 21, 'Pijama': 21, 'Ropa interior': 21, 'Sábana': 21, 'Toalla': 21, 'Trapo': 21,
        // Verduras (id: 22)
        'Acelga': 22, 'Ajo': 22, 'Alcachofa': 22, 'Apio': 22, 'Berenjena': 22, 'Borraja': 22, 'Brócoli': 22, 'Calabacín': 22, 'Calabaza': 22, 'Cebolla': 22, 'Champiñón': 22, 'Col': 22, 'Coliflor': 22, 'Endivia': 22, 'Escarola': 22, 'Espárrago': 22, 'Espinaca': 22, 'Guisante': 22, 'Haba': 22, 'Judía verde': 22, 'Lechuga': 22, 'Nabo': 22, 'Patata': 22, 'Pepino': 22, 'Pimiento': 22, 'Puerro': 22, 'Rábano': 22, 'Remolacha': 22, 'Repollo': 22, 'Seta': 22, 'Tomate': 22, 'Zanahoria': 22,
        // Otros (id: 23)
        'Carbón': 23, 'Leña': 23,
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
            { id: 1, nombre: 'Bebés' }, { id: 2, nombre: 'Bebidas y zumos' },
            { id: 3, nombre: 'Carnes y embutidos' }, { id: 4, nombre: 'Congelados' },
            { id: 5, nombre: 'Conservas y legumbres' }, { id: 6, nombre: 'Cuidado personal' },
            { id: 7, nombre: 'Desayuno' }, { id: 8, nombre: 'Despensa' },
            { id: 9, nombre: 'Frutas' }, { id: 10, nombre: 'Frutos secos y snacks' },
            { id: 11, nombre: 'Hogar y bazar' }, { id: 12, nombre: 'Lácteos y huevos' },
            { id: 13, nombre: 'Limpieza' }, { id: 14, nombre: 'Mascotas' },
            { id: 15, nombre: 'Panadería y bollería' }, { id: 16, nombre: 'Parafarmacia' },
            { id: 17, nombre: 'Pasta y arroces' }, { id: 18, nombre: 'Pescados' },
            { id: 19, nombre: 'Platos preparados' }, { id: 20, nombre: 'Postres y repostería' },
            { id: 21, nombre: 'Textil' }, { id: 22, nombre: 'Verduras' },
            { id: 23, nombre: 'Otros' }
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
        const nombreSinFormatear = nombreProductoInput.value.trim();
        if (!nombreSinFormatear) {
            alert('El nombre del producto no puede estar vacío.');
            return;
        }
        const nombre = nombreSinFormatear.charAt(0).toUpperCase() + nombreSinFormatear.slice(1).toLowerCase();
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

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const productoReconocido = event.results[0][0].transcript;
            const nombreFormateado = productoReconocido.charAt(0).toUpperCase() + productoReconocido.slice(1).toLowerCase();
            nombreProductoInput.value = nombreFormateado;
            // Llamamos manualmente a la función para sugerir la categoría
            sugerirCategoria(nombreFormateado);
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            let mensajeError = 'Error en el reconocimiento de voz: ' + event.error;
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                mensajeError += '\n\nLa API de voz requiere una conexión segura (HTTPS) para funcionar en la mayoría de navegadores móviles y necesita que concedas permiso para usar el micrófono.';
            }
            alert(mensajeError);
        };
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
        const keywordsOrdenadas = Object.keys(autoCategoriaMap).sort((a, b) => b.length - a.length);
        
        for (const keyword of keywordsOrdenadas) {
            if (nombre.includes(keyword.toLowerCase())) {
                const categoriaId = autoCategoriaMap[keyword];
                categoriaProductoSelect.value = categoriaId;
                return; // Encontramos la mejor y más larga coincidencia, y salimos.
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
    const listaAutocompletado = ['Aceite para bebé', 'Aspirador nasal para bebé', 'Biberón', 'Cereales hidrolizados para bebé', 'Cereales infantiles', 'Chupete', 'Colonia infantil', 'Crema para el culito del bebé', 'Crema para pañal', 'Esponja natural para bebé', 'Fórmula infantil', 'Galletas para bebés', 'Jabón infantil', 'Juguetes para la dentición', 'Leche de continuación', 'Leche en polvo para bebé', 'Mordedor', 'Pañales', 'Papilla de frutas para bebé', 'Potito', 'Potitos de verdura para bebé', 'Tarritos de fruta y yogur para bebé', 'Termómetro de baño', 'Tijeras de uñas para bebé', 'Toallitas húmedas', 'Toallitas nasales para bebé', 'Toallitas para el cambio de pañal', 'Agua', 'Agua con gas', 'Agua de coco', 'Agua tónica', 'Anís', 'Aperol', 'Bebida de almendras', 'Bebida de arroz', 'Bebida de avellana', 'Bebida de avena', 'Bebida de soja', 'Bebida de soja con chocolate', 'Bebida energética', 'Bebida isotónica', 'Brandy', 'Cacao caliente', 'Café', 'Café en cápsulas', 'Café soluble', 'Campari', 'Cava', 'Cerveza', 'Cerveza IPA', 'Cerveza de trigo', 'Cerveza negra', 'Cerveza roja', 'Cerveza sin alcohol', 'Cerveza stout', 'Cerveza tostada', 'Champán', 'Cointreau', 'Coñac', 'Ginebra', 'Horchata', 'Infusión', 'Infusión de frutos rojos', 'Infusión relajante', 'Jerez', 'Kombucha', 'Leche de coco', 'Licor', 'Licor de almendras', 'Licor de cereza', 'Licor de hierbas', 'Limonada', 'Limoncello', 'Mosto', 'Néctar', 'Pacharán', 'Prosecco', 'Refresco', 'Refresco de cola', 'Refresco de jengibre', 'Refresco de limón', 'Refresco de naranja', 'Ron', 'Sake', 'Sidra', 'Té', 'Té chai', 'Té rooibos', 'Tequila', 'Vermut', 'Vino', 'Vino blanco', 'Vino de aguja', 'Vino de mesa', 'Vino dulce', 'Vino espumoso', 'Vino frizzante', 'Vino rosado', 'Vino tinto', 'Vodka', 'Whisky', 'Zumo', 'Zumo de albaricoque', 'Zumo de frutas', 'Zumo de granada', 'Zumo de mango', 'Zumo de manzana', 'Zumo de melocotón', 'Zumo de multifrutas', 'Zumo de naranja', 'Zumo de piña', 'Zumo de pomelo', 'Zumo de tomate', 'Alitas de pollo', 'Bacon', 'Butifarra', 'Carne de cerdo', 'Carne de pollo', 'Carne de ternera', 'Carne picada', 'Chistorra', 'Chorizo', 'Chuleta', 'Codillo', 'Conejo', 'Costillas', 'Embutido', 'Foie gras', 'Fuet', 'Hamburguesa', 'Jamón', 'Jamón cocido', 'Jamón serrano', 'Lacón', 'Lomo', 'Longaniza', 'Morcilla', 'Mortadela', 'Muslo de pollo', 'Panceta', 'Pato', 'Pavo', 'Pechuga de pollo', 'Pechuga de pavo', 'Pincho', 'Pollo', 'Salami', 'Salchicha', 'Salchichón', 'Solomillo', 'Acelgas congeladas', 'Alitas de pollo adobadas congeladas', 'Arroz congelado', 'Bacalao congelado', 'Buñuelos congelados', 'Calamares congelados', 'Canelones congelados', 'Carne congelada', 'Coliflor congelada', 'Costillas a la barbacoa congeladas', 'Croquetas congeladas', 'Empanadillas congeladas', 'Espinacas congeladas', 'Fruta congelada', 'Frutos rojos congelados', 'Gambas congeladas', 'Guisantes congelados', 'Helado', 'Hielo', 'Judías verdes congeladas', 'Langostinos congelados', 'Lasaña congelada', 'Mango congelado', 'Marisco congelado', 'Menestra congelada', 'Merluza congelada', 'Paella congelada', 'Paella de marisco congelada', 'Pan congelado', 'Patatas fritas congeladas', 'Pescado congelado', 'Piña congelada', 'Pizza congelada', 'Platos preparados congelados', 'Pollo congelado', 'Profiteroles congelados', 'Salmón congelado', 'Salteado de gambas y verduras congelado', 'Sopa congelada', 'Tarta congelada', 'Tequeños congelados', 'Verdura congelada', 'Alcaparras', 'Alcachofas en conserva', 'Alubias', 'Anchoas', 'Atún en conserva', 'Berberechos en conserva', 'Caballa en conserva', 'Champiñones en conserva', 'Espárragos en conserva', 'Fabada', 'Garbanzos', 'Guisantes en conserva', 'Habas', 'Judías', 'Judía pinta', 'Lentejas', 'Maíz en conserva', 'Melocotón en almíbar', 'Mejillones en conserva', 'Pimientos en conserva', 'Piña en almíbar', 'Sardinas en conserva', 'Tomate en conserva', 'Zanahorias en conserva', 'Acondicionador', 'Aceite corporal', 'After-shave', 'Algodón', 'Bastoncillos', 'Cepillo de dientes', 'Champú', 'Champú en seco', 'Colonia', 'Colutorio con flúor', 'Compresas', 'Crema de afeitar', 'Crema de manos', 'Crema depilatoria', 'Crema facial', 'Crema hidratante', 'Crema reafirmante', 'Crema solar', 'Cuchillas de afeitar', 'Desodorante', 'Enjuague bucal', 'Espuma de afeitar', 'Gel de baño', 'Gel fijador', 'Gel reductor', 'Hilo dental', 'Jabón', 'Laca', 'Maquinilla de afeitar', 'Mascarilla de color para el pelo', 'Mascarilla facial', 'Papel higiénico', 'Pasta de dientes', 'Pasta de dientes blanqueadora', 'Pasta de dientes para encías sensibles', 'Peine', 'Protector labial', 'Protector térmico para el pelo', 'Salvaslips', 'Tampones', 'Tinte para el pelo', 'Toallitas desmaquillantes', 'Tratamiento anticelulítico', 'Cacao en polvo', 'Cereales', 'Galletas', 'Mermelada', 'Miel', 'Aceite', 'Aceite de girasol', 'Aceite de oliva', 'Aderezo', 'Alioli', 'Azafrán', 'Azúcar', 'Caldo', 'Canela', 'Colorante alimentario', 'Comino', 'Especias', 'Harina', 'Ketchup', 'Laurel', 'Levadura', 'Mayonesa', 'Mostaza', 'Orégano', 'Pan rallado', 'Perejil', 'Pimentón', 'Pimienta', 'Puré de patatas', 'Sal', 'Sal fina', 'Sal gorda', 'Sal marina', 'Salsa', 'Salsa de soja', 'Salsa de tomate', 'Sémola', 'Soja texturizada', 'Sopa', 'Tomate frito', 'Vinagre', 'Aguacate', 'Albaricoque', 'Arándanos', 'Cereza', 'Chirimoya', 'Ciruela', 'Ciruelas pasas', 'Coco', 'Dátiles sin hueso', 'Frambuesa', 'Fresa', 'Fruta deshidratada', 'Granada', 'Higo', 'Higos secos', 'Kiwi', 'Lima', 'Limón', 'Mandarina', 'Mango', 'Manzana', 'Maracuyá', 'Melocotón', 'Melón', 'Membrillo', 'Naranja', 'Nectarina', 'Níspero', 'Orejones', 'Papaya', 'Paraguaya', 'Pera', 'Piña', 'Plátano', 'Pomelo', 'Sandía', 'Uva', 'Anacardo', 'Aperitivo', 'Avellana', 'Cacahuete', 'Castaña', 'Chicle', 'Chocolate (snack)', 'Chuchería', 'Dátil', 'Frutos secos', 'Gominola', 'Nueces', 'Palomitas', 'Patatas fritas', 'Piñón', 'Pipa', 'Pistacho', 'Snack', 'Ambientador', 'Bombilla', 'Caja de almacenaje', 'Fósforos', 'Mechero', 'Papel de aluminio', 'Papel de cocina', 'Papel de horno', 'Papel film', 'Pila', 'Pinzas', 'Sartén', 'Servilleta', 'Vela', 'Actimel', 'Batido', 'Cuajada', 'Flan', 'Huevo', 'Kéfir', 'Leche', 'Leche condensada', 'Leche desnatada', 'Leche en polvo', 'Leche entera', 'Leche semidesnatada', 'Mantequilla', 'Margarina', 'Mascarpone', 'Nata', 'Natillas', 'Queso', 'Queso azul', 'Queso de cabra', 'Queso de untar', 'Queso en lonchas', 'Queso fresco', 'Queso rallado', 'Requesón', 'Yogur', 'Yogur de frutas', 'Yogur desnatado', 'Yogur griego', 'Yogur líquido', 'Yogur natural', 'Abrillantador', 'Amoniaco', 'Antical', 'Bayeta', 'Bolas antipolillas', 'Bolsa de basura', 'Cepillo', 'Cera', 'Cubo', 'Detergente', 'Detergente para prendas delicadas', 'Escoba', 'Estropajo', 'Fregasuelos', 'Fregona', 'Guantes', 'Insecticida', 'Lavavajillas', 'Lejía', 'Limpiacristales', 'Limpiador', 'Limpiador antical', 'Limpiador de baño', 'Limpiador de cocina', 'Limpiador de muebles', 'Quitamanchas', 'Recambios de ambientador', 'Recogedor', 'Suavizante', 'Arena para gatos', 'Comida para gatos', 'Comida para pájaros', 'Comida para perros', 'Comida para peces', 'Comida para roedores', 'Galletas para perros', 'Hierba gatera', 'Hueso para perro', 'Huesos de cuero', 'Juguete para gato', 'Juguete para perro', 'Juguetes de cuerda para perros', 'Latas de paté para gatos', 'Lecho para roedores', 'Piedra para pájaros', 'Piedras minerales para pájaros', 'Pienso hipoalergénico para perros', 'Pienso sin cereales para gatos', 'Plumeros para gatos', 'Premios para perros', 'Snack para gato', 'Snack para perro', 'Snacks naturales para perros', 'Baguette', 'Bizcocho', 'Bollería', 'Croissant', 'Donut', 'Empanada', 'Ensaimada', 'Magdalena', 'Muffin', 'Napolitana', 'Pan', 'Pan de hamburguesa', 'Pan de leche', 'Pan de molde', 'Pan de perrito caliente', 'Pan integral', 'Pan tostado', 'Pastel', 'Tarta', 'Tostada', 'Gasas', 'Tiritas', 'Arroz', 'Cuscús', 'Espaguetis', 'Fideos', 'Lasaña', 'Macarrones', 'Pasta', 'Pasta fresca', 'Quinoa', 'Raviolis', 'Tallarines', 'Tortellini', 'Almejas', 'Atún', 'Bacalao', 'Berberechos', 'Boquerones', 'Caballa', 'Calamares', 'Cangrejo', 'Dorada', 'Gallo', 'Gambas', 'Langostinos', 'Lenguado', 'Lubina', 'Mejillones', 'Merluza', 'Pescadilla', 'Pulpo', 'Salmón', 'Sardinas', 'Sepia', 'Trucha', 'Canelones', 'Crema', 'Croquetas', 'Empanadillas', 'Ensalada', 'Ensaladilla rusa', 'Gazpacho', 'Lasaña (preparado)', 'Paella', 'Pasta preparada', 'Pizza', 'Pollo asado', 'Puré', 'Salmorejo', 'Tortilla', 'Arroz con leche', 'Brownie', 'Chocolate', 'Coulant', 'Crema catalana', 'Crema pastelera', 'Flan', 'Fruta en almíbar', 'Gelatina', 'Hojaldre', 'Mousse', 'Natillas', 'Profiteroles', 'Tiramisú', 'Tocino de cielo', 'Turrón', 'Albornoz', 'Calcetines', 'Calzoncillos', 'Camiseta', 'Leotardos', 'Mantel', 'Medias', 'Pijama', 'Ropa interior', 'Sábana', 'Toalla', 'Trapo', 'Acelga', 'Ajo', 'Alcachofa', 'Apio', 'Berenjena', 'Borraja', 'Brócoli', 'Calabacín', 'Calabaza', 'Cebolla', 'Champiñón', 'Col', 'Coliflor', 'Endivia', 'Escarola', 'Espárrago', 'Espinaca', 'Guisante', 'Haba', 'Judía verde', 'Lechuga', 'Nabo', 'Patata', 'Pepino', 'Pimiento', 'Puerro', 'Rábano', 'Remolacha', 'Repollo', 'Seta', 'Tomate', 'Zanahoria', 'Carbón', 'Leña'];
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

import { capitalizar, normalizar } from './utils.js';

const VALIDATION_RULES = {
    NOMBRE_MAX_LENGTH: 100,
    NOTAS_MAX_LENGTH: 500,
    UNIDADES_PERMITIDAS: ['ud', 'uds', 'kg', 'g', 'l', 'ml'],
    PRIORIDADES_PERMITIDAS: ['alta', 'media', 'baja']
};

/**
 * Valida los datos parseados de una línea del archivo.
 * @param {object} datos - Los datos extraídos de la línea.
 * @returns {{isValid: boolean, error: string|null}} - Resultado de la validación.
 */
const validarDatosParseados = (datos) => {
    const { nombre, cantidad, precioTotalCalculado, notas, unidad, prioridad } = datos;

    if (!nombre) {
        return { isValid: false, error: "El nombre del producto no puede estar vacío." };
    }
    if (nombre.length > VALIDATION_RULES.NOMBRE_MAX_LENGTH) {
        return { isValid: false, error: `El nombre excede los ${VALIDATION_RULES.NOMBRE_MAX_LENGTH} caracteres.` };
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        return { isValid: false, error: `La cantidad "${cantidad}" debe ser un número positivo.` };
    }
    if (isNaN(precioTotalCalculado) || precioTotalCalculado < 0) {
        return { isValid: false, error: `El precio "${precioTotalCalculado}" no es un número válido.` };
    }
    if (notas.length > VALIDATION_RULES.NOTAS_MAX_LENGTH) {
        return { isValid: false, error: `Las notas exceden los ${VALIDATION_RULES.NOTAS_MAX_LENGTH} caracteres.` };
    }
    if (!VALIDATION_RULES.UNIDADES_PERMITIDAS.includes(unidad.toLowerCase())) {
        return { isValid: false, error: `La unidad "${unidad}" no es válida. Permitidas: ${VALIDATION_RULES.UNIDADES_PERMITIDAS.join(', ')}` };
    }
    if (!VALIDATION_RULES.PRIORIDADES_PERMITIDAS.includes(prioridad)) {
        return { isValid: false, error: `La prioridad "${prioridad}" no es válida. Permitidas: ${VALIDATION_RULES.PRIORIDADES_PERMITIDAS.join(', ')}` };
    }

    return { isValid: true, error: null };
};


/**
 * Parsea el contenido de texto de un archivo importado y lo convierte en una lista de productos.
 * @param {string} texto - El contenido de texto del archivo.
 * @param {object} state - El estado de la aplicación para buscar categorías y tiendas.
 * @returns {{productosParseados: Array, lineasConError: Array}} - Un objeto con los productos y los errores.
 */
export const parsearTextoImportado = (texto, state) => {
    const lineas = texto.split('\n');
    const productosParseados = [];
    const lineasConError = [];

    const extractores = [
        // Regex más flexible para capturar cualquier prioridad y validarla después.
        { key: 'prioridad', regex: /\(Prioridad:\s*([^)]+)\)/i }, 
        { key: 'cantidad', regex: /\((\d+[,.]?\d*)\s*(\w+)\)/ },
        { key: 'tienda', regex: /@\s*([^()@-]+)/ },
        { key: 'precio', regex: /-\s*(\d+[,.]?\d*)\s*€/ },
        { key: 'notas', regex: /\(Nota:/i } // Solo para detectar el inicio
    ];

    lineas.forEach((lineaOriginal, index) => {
        let linea = lineaOriginal.trim();
        if (!linea || linea.startsWith('=') || linea.startsWith('Lista de Compras')) return;

        try {
            if (!linea.startsWith('[') || !linea.includes(']')) {
                throw new Error("Formato incorrecto. La línea debe empezar con [ ] o [x].");
            }

            const comprado = linea.substring(1, 2).toLowerCase() === 'x';
            let lineaRestante = linea.substring(linea.indexOf(']') + 1).trim();

            if (!lineaRestante) {
                throw new Error("No se encontró nombre de producto después de [..].");
            }

            const datosExtraidos = {
                prioridad: 'baja',
                cantidad: 1,
                unidad: 'ud',
                precioTotalCalculado: 0,
                notas: '',
                tiendaStr: ''
            };

            extractores.forEach(({ key, regex }) => {
                if (key === 'notas') {
                    const notaStartIndex = lineaRestante.lastIndexOf('(Nota:');
                    if (notaStartIndex !== -1) {
                        let balance = 1;
                        let notaEndIndex = -1;
                        for (let i = notaStartIndex + 6; i < lineaRestante.length; i++) {
                            if (lineaRestante[i] === '(') balance++;
                            else if (lineaRestante[i] === ')') balance--;
                            if (balance === 0) {
                                notaEndIndex = i;
                                break;
                            }
                        }

                        if (notaEndIndex !== -1) {
                            const notaCompleta = lineaRestante.substring(notaStartIndex, notaEndIndex + 1);
                            datosExtraidos.notas = lineaRestante.substring(notaStartIndex + 6, notaEndIndex).trim();
                            lineaRestante = (lineaRestante.replace(notaCompleta, '')).trim();
                        }
                    }
                } else {
                    const matches = [...lineaRestante.matchAll(new RegExp(regex, 'g'))];
                    if (matches.length > 0) {
                        const lastMatch = matches[matches.length - 1];
                        switch (key) {
                            case 'cantidad':
                                datosExtraidos.cantidad = parseFloat(lastMatch[1].replace(',', '.'));
                                datosExtraidos.unidad = lastMatch[2] || 'ud';
                                break;
                            case 'tienda':
                                datosExtraidos.tiendaStr = lastMatch[1].trim();
                                break;
                            case 'precio':
                                datosExtraidos.precioTotalCalculado = parseFloat(lastMatch[1].replace(',', '.'));
                                break;
                            case 'prioridad':
                                // Se extrae cualquier valor y se valida después.
                                datosExtraidos.prioridad = lastMatch[1].toLowerCase().trim();
                                break;
                        }
                        const lastIndex = lineaRestante.lastIndexOf(lastMatch[0]);
                        lineaRestante = (lineaRestante.substring(0, lastIndex) + lineaRestante.substring(lastIndex + lastMatch[0].length)).trim();
                    }
                }
            });

            const nombre = capitalizar(lineaRestante.trim());

            const datosAValidar = { ...datosExtraidos, nombre };
            const validacion = validarDatosParseados(datosAValidar);
            if (!validacion.isValid) {
                throw new Error(validacion.error);
            }

            const categoriaNombre = state.productoCategoriaMapNormalizado[normalizar(nombre)];
            const categoria = Array.from(state.mapaCategorias.values()).find(c => c.nombre === categoriaNombre);
            const tienda = Array.from(state.mapaTiendas.values()).find(t => datosExtraidos.tiendaStr && normalizar(t.nombre) === normalizar(datosExtraidos.tiendaStr));

            productosParseados.push({
                nombre,
                cantidad: datosExtraidos.cantidad,
                unidad: datosExtraidos.unidad.toLowerCase().startsWith('ud') ? 'ud' : datosExtraidos.unidad.toLowerCase(),
                precioTotalCalculado: datosExtraidos.precioTotalCalculado,
                categoriaId: categoria ? categoria.id : '',
                categoriaNombre: categoria ? categoria.nombre : 'Sin categoría',
                precioUnitario: (datosExtraidos.cantidad > 0 ? parseFloat((datosExtraidos.precioTotalCalculado / datosExtraidos.cantidad).toFixed(2)) : 0),
                tiendaId: tienda ? tienda.id : '',
                tiendaNombre: tienda ? tienda.nombre : 'Sin asignar',
                notas: datosExtraidos.notas,
                comprado,
                prioridad: datosExtraidos.prioridad,
                importado: true
            });

        } catch (error) {
            lineasConError.push({ num: index + 1, contenido: lineaOriginal, error: error.message });
        }
    });

    return { productosParseados, lineasConError };
};
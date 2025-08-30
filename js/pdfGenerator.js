import { mostrarNotificacion } from './notifications.js';
import { agruparPorCategoria } from './utils.js';

// --- Configuración por Defecto para la Generación de PDF ---
const defaultConfig = {
    outputFilename: 'lista-compras.pdf',
    margins: { top: 15, right: 15, bottom: 15, left: 15 },
    fontSizes: { title: 16, category: 12, body: 10, small: 8 },
    lineHeight: 6,
    fieldSpacing: 4, // Espacio entre campos de un mismo producto
    priorityColors: { alta: '#dc3545', media: '#ffc107', baja: '#198754', default: '#cccccc' },
    textColors: { normal: '#000000', strikethrough: '#6c757d' }
};

/**
 * Genera un documento PDF a partir de una lista de productos.
 * @param {Array} productos - La lista de productos a exportar.
 * @param {object} state - El estado de la aplicación (para acceder a categorías y tiendas).
 * @param {object} [config=defaultConfig] - Configuración para la generación del PDF.
 */
export const generarPdfLista = (productos, state, config = defaultConfig) => {
    mostrarNotificacion('Generando PDF, por favor espere...', 'info');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- Configuración del Documento ---
    const { margins, lineHeight, fontSizes, priorityColors, textColors, outputFilename, fieldSpacing } = config;
    const pageHeight = doc.internal.pageSize.getHeight();
    const columnWidth = doc.internal.pageSize.getWidth() - margins.left - margins.right;

    // --- Cálculos y Ordenación ---
    const costeTotal = productos.reduce((total, p) => total + (p.precioTotalCalculado || 0), 0);
    const productosAgrupados = agruparPorCategoria(productos);

    for (const catId in productosAgrupados) {
        productosAgrupados[catId].sort((a, b) => {
            if (a.comprado !== b.comprado) return a.comprado ? 1 : -1;
            return a.nombre.localeCompare(b.nombre);
        });
    }

    const sortedCategoryIds = Object.keys(productosAgrupados).sort((a, b) => {
        const catA = state.mapaCategorias.get(a)?.nombre || 'z';
        const catB = state.mapaCategorias.get(b)?.nombre || 'z';
        return catA.localeCompare(catB);
    });

    // --- Dibujado del PDF ---
    let y = margins.top + lineHeight;
    doc.setFontSize(fontSizes.title);
    doc.text(`Lista de Compras | Total: ${costeTotal.toFixed(2)}€`, margins.left, y);
    y += lineHeight * 2;
    doc.setFontSize(fontSizes.body);

    sortedCategoryIds.forEach(catId => {
        const categoria = state.mapaCategorias.get(catId) || { nombre: 'Sin Categoría' };
        const productsInCat = productosAgrupados[catId];

        if (y + lineHeight * 2 > pageHeight - margins.bottom) {
            doc.addPage();
            y = margins.top + lineHeight;
        }

        doc.setFont(undefined, 'bold');
        doc.setFontSize(fontSizes.category);
        doc.text(categoria.nombre, margins.left, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(fontSizes.body);
        y += lineHeight * 1.5;

        productsInCat.forEach(p => {
            const textX = margins.left + 5;
            const initialY = y;

            const tienda = state.mapaTiendas.get(p.tiendaId);
            const precioTexto = p.precioTotalCalculado ? `${p.precioTotalCalculado.toFixed(2)}€` : 'N/A';
            const tiendaTexto = tienda ? `Tienda: ${tienda.nombre}` : '';
            const notaTexto = p.notas ? `Nota: ${p.notas}` : '';

            const productoLines = [
                `${p.nombre} (${p.cantidad} ${p.unidad}) | Precio: ${precioTexto}`,
                tiendaTexto,
                notaTexto
            ].filter(Boolean);

            const blockHeight = productoLines.reduce((height, line, index) => {
                const split = doc.splitTextToSize(line, columnWidth - 8);
                const spacing = (index < productoLines.length - 1) ? fieldSpacing : 0;
                return height + (split.length * lineHeight * 0.9) + spacing;
            }, 0);

            if (y + blockHeight > pageHeight - margins.bottom) {
                doc.addPage();
                y = margins.top;
            }

            const startYForDrawing = y;

            productoLines.forEach((line, index) => {
                const splitText = doc.splitTextToSize(line, columnWidth - 8);
                const textHeight = splitText.length * (lineHeight * 0.9);

                if (p.comprado) {
                    doc.setTextColor(textColors.strikethrough);
                    doc.text(splitText, textX, y, { flags: { 'strikeout': true } });
                    doc.setTextColor(textColors.normal);
                } else {
                    doc.text(splitText, textX, y);
                }
                
                y += textHeight;
                if (index < productoLines.length - 1) {
                    y += fieldSpacing;
                }
            });

            const finalY = y;
            const totalBlockHeight = finalY - startYForDrawing;

            if (!p.comprado && p.prioridad) {
                const lineX = margins.left + 1.5;
                const lineTopY = startYForDrawing - (lineHeight * 0.7);
                const lineBottomY = lineTopY + totalBlockHeight - (lineHeight * 0.2);
                doc.setDrawColor(priorityColors[p.prioridad] || priorityColors.default);
                doc.setLineWidth(1);
                doc.line(lineX, lineTopY, lineX, lineBottomY);
            }

            y += lineHeight;
        });
    });

    doc.save(outputFilename);
};
// Array para almacenar el historial de conteos
let historialConteos = [];

// Función para cargar el historial desde localStorage
function loadHistorialConteos() {
    const saved = localStorage.getItem('historialConteos');
    if (saved) {
        historialConteos = JSON.parse(saved);
    }
    displayHistorialConteos();
}

// Función para guardar el historial en localStorage
function saveHistorialConteos() {
    localStorage.setItem('historialConteos', JSON.stringify(historialConteos));
}

// Función para agregar el conteo actual al historial
function agregarConteoAlHistorial() {
    if (userCreatedBoxes.length === 0) {
        return;
    }
    
    // Verificar si hay cantidades para contar
    const totalCantidad = userCreatedBoxes.reduce((total, box) => total + (box.cantidad || 0), 0);
    if (totalCantidad === 0) {
        return;
    }
    
    // Crear el registro del conteo
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
    });
    const hora = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const fechaCompleta = `${fecha} ${hora}`;
    
    const nuevoConteo = {
        fecha: fechaCompleta,
        cajas: {},
        total: totalCantidad
    };
    
    // Agregar las cantidades de cada caja
    userCreatedBoxes.forEach(box => {
        if (box.cantidad && box.cantidad > 0) {
            nuevoConteo.cajas[box.nombre] = box.cantidad;
        }
    });
    
    // Agregar al historial
    historialConteos.unshift(nuevoConteo); // Agregar al inicio para mostrar los más recientes primero
    saveHistorialConteos();
    
    // Resetear las cantidades
    userCreatedBoxes.forEach(box => {
        box.cantidad = 0;
    });
    saveUserBoxes();
    
    // Actualizar las pantallas
    displayUserBoxesInHome();
    updateTotalBoxes();
    displayHistorialConteos();
}

// Función para mostrar el historial de conteos
function displayHistorialConteos() {
    const tbody = document.querySelector('#historial-table tbody');
    if (!tbody) {
        return;
    }
    
    // Limpiar contenido existente
    tbody.innerHTML = '';
    
    if (historialConteos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No hay conteos guardados</td></tr>';
        return;
    }
    
    // Usar todas las cajas juntas sin separar
    const todasLasCajas = userCreatedBoxes;
    const todasLasCajasArray = todasLasCajas.map(box => box.nombre);
    
    // Mantener arrays vacíos para compatibilidad
    const cajasNormalesArray = todasLasCajasArray;
    const cajasPaletArray = [];
    
    // Variables para subtotales (solo cajas normales)
    let subtotalesPorCaja = {};
    let subtotalGeneral = 0;
    let contadorFilas = 0;
    
    // Variables para total general (solo cajas normales)
    let totalesPorCaja = {};
    let totalGeneral = 0;
    
    // Variables para palets (separados)
    let subtotalesPalets = {};
    let totalesPalets = {};
    
    // Inicializar subtotales y totales para cajas normales
    cajasNormalesArray.forEach(nombreCaja => {
        subtotalesPorCaja[nombreCaja] = 0;
        totalesPorCaja[nombreCaja] = 0;
    });
    
    // Inicializar subtotales y totales para palets
    cajasPaletArray.forEach(nombreCaja => {
        subtotalesPalets[nombreCaja] = 0;
        totalesPalets[nombreCaja] = 0;
    });
    
    // Mostrar cada conteo
    historialConteos.forEach((conteo, index) => {
        const row = document.createElement('tr');
        
        // Crear celdas dinámicamente basadas en las cajas del conteo
        let cellsHTML = `<td>${conteo.fecha}</td>`;
        
        // Calcular total solo de cajas normales (excluyendo palets)
        let totalCajasNormales = 0;
        
        // Primero calcular el total
        cajasNormalesArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            totalCajasNormales += cantidad;
        });
        
        // Agregar columna Total después de Fecha
        cellsHTML += `<td><strong>${totalCajasNormales}</strong></td>`;
        
        // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
        const cajaPaleMercancia = todasLasCajas.find(box => 
            box.nombre.toLowerCase().includes('palet') || 
            box.nombre.toLowerCase().includes('mercancia')
        );
        
        if (index === 0) {
            console.log('🎯 En displayHistorialConteos - Caja de palet encontrada:', cajaPaleMercancia ? cajaPaleMercancia.nombre : 'NINGUNA');
            console.log('🔄 Cells HTML antes de agregar palet:', cellsHTML);
        }
        
        // Agregar PALE DE MERCANCIA inmediatamente después de Total
        if (cajaPaleMercancia) {
            const cantidad = (conteo.cajas && conteo.cajas[cajaPaleMercancia.nombre]) || 0;
            cellsHTML += `<td>${cantidad}</td>`;
            
            if (index === 0) {
                console.log('✅ Agregada celda de palet después de Total en fila de datos:', cajaPaleMercancia.nombre, 'cantidad:', cantidad);
                console.log('🔄 Cells HTML después de agregar palet:', cellsHTML);
            }
            
            // Acumular en subtotales y totales
            subtotalesPorCaja[cajaPaleMercancia.nombre] += cantidad;
            totalesPorCaja[cajaPaleMercancia.nombre] += cantidad;
        } else {
            if (index === 0) {
                console.log('❌ No se encontró caja palet para agregar en fila de datos');
            }
        }
        
        // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
        todasLasCajas.forEach(box => {
            if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
                const cantidad = (conteo.cajas && conteo.cajas[box.nombre]) || 0;
                cellsHTML += `<td>${cantidad}</td>`;
                
                // Acumular en subtotales y totales
                subtotalesPorCaja[box.nombre] += cantidad;
                totalesPorCaja[box.nombre] += cantidad;
            }
        });
        
        // Agregar celdas para palets (separadas)
        cajasPaletArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            cellsHTML += `<td>${cantidad}</td>`;
            
            // Acumular solo en totales de palets (no en subtotales generales)
            subtotalesPalets[nombreCaja] += cantidad;
            totalesPalets[nombreCaja] += cantidad;
        });
        
        // Acumular totales generales (solo cajas normales)
        subtotalGeneral += totalCajasNormales;
        totalGeneral += totalCajasNormales;
        
        row.innerHTML = cellsHTML;
        
        // Agregar clase para resaltar si tiene cantidades
        if (totalCajasNormales > 0 || cajasPaletArray.some(nombreCaja => (conteo.cajas && conteo.cajas[nombreCaja]) > 0)) {
            row.classList.add('has-quantities');
        }
        
        // Agregar clase a las celdas de palets
        const paletCells = row.querySelectorAll('td');
        const startPaletIndex = 1 + cajasNormalesArray.length; // 1 para fecha + cajas normales
        for (let i = 0; i < cajasPaletArray.length; i++) {
            if (paletCells[startPaletIndex + i]) {
                paletCells[startPaletIndex + i].classList.add('palet-column');
            }
        }
        
        tbody.appendChild(row);
        
        contadorFilas++;
        
        // Agregar subtotal cada 4 filas
        if (contadorFilas % 4 === 0 || index === historialConteos.length - 1) {
            const subtotalRow = document.createElement('tr');
            subtotalRow.className = 'subtotal-row';
            
            let subtotalHTML = '<td><strong>Subtotal</strong></td>';
            
            // Agregar columna Total después de Fecha
            subtotalHTML += `<td><strong>${subtotalGeneral}</strong></td>`;
            
            // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
        const cajaPaleMercancia = todasLasCajas.find(box => 
            box.nombre.toLowerCase().includes('palet') || 
            box.nombre.toLowerCase().includes('mercancia')
        );
            
            // Agregar PALE DE MERCANCIA inmediatamente después de Total
            if (cajaPaleMercancia) {
                subtotalHTML += `<td><strong>${subtotalesPorCaja[cajaPaleMercancia.nombre] || 0}</strong></td>`;
            }
            
            // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
            todasLasCajas.forEach(box => {
                if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
                    subtotalHTML += `<td><strong>${subtotalesPorCaja[box.nombre] || 0}</strong></td>`;
                }
            });
            
            subtotalRow.innerHTML = subtotalHTML;
            tbody.appendChild(subtotalRow);
            
            // Resetear subtotales
            cajasNormalesArray.forEach(nombreCaja => {
                subtotalesPorCaja[nombreCaja] = 0;
            });
            cajasPaletArray.forEach(nombreCaja => {
                subtotalesPalets[nombreCaja] = 0;
            });
            subtotalGeneral = 0;
        }
    });
    
    // Agregar fila de total general
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    
    let totalHTML = '<td><strong>TOTAL GENERAL</strong></td>';
    
    // Agregar columna Total después de Fecha
    totalHTML += `<td><strong>${totalGeneral}</strong></td>`;
    
    // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
        const cajaPaleMercancia = todasLasCajas.find(box => 
            box.nombre.toLowerCase().includes('palet') || 
            box.nombre.toLowerCase().includes('mercancia')
        );
    
    // Agregar PALE DE MERCANCIA inmediatamente después de Total
    if (cajaPaleMercancia) {
        totalHTML += `<td><strong>${totalesPorCaja[cajaPaleMercancia.nombre] || 0}</strong></td>`;
    }
    
    // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
    todasLasCajas.forEach(box => {
        if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
            totalHTML += `<td><strong>${totalesPorCaja[box.nombre] || 0}</strong></td>`;
        }
    });
    
    totalRow.innerHTML = totalHTML;
    tbody.appendChild(totalRow);
    
    // Actualizar encabezados de la tabla
    updateHistorialHeaders();
}

// Función para actualizar los encabezados de la tabla del historial
function updateHistorialHeaders() {
    const thead = document.querySelector('#historial-table thead tr');
    if (!thead) {
        return;
    }

    const todasLasCajas = [...userCreatedBoxes, ...defaultBoxes];

    const cajaPaleMercancia = todasLasCajas.find(box => 
        box.nombre.toLowerCase().includes('palet') || 
        box.nombre.toLowerCase().includes('mercancia')
    );

    let headersHTML = '<th>Fecha</th><th>Hora</th>';
    
    userCreatedBoxes.forEach(box => {
        if (box.nombre.toLowerCase().includes('palet') || box.nombre.toLowerCase().includes('mercancia')) {
            return;
        }
        headersHTML += `<th>${box.nombre}</th>`;
    });
    
    defaultBoxes.forEach(box => {
        headersHTML += `<th>${box.nombre}</th>`;
    });
    
    headersHTML += '<th>Total</th>';
    
    if (cajaPaleMercancia) {
        headersHTML += `<th>${cajaPaleMercancia.nombre}</th>`;
    }
    
    thead.innerHTML = headersHTML;
}

// Array para almacenar los registros archivados
let registrosArchivados = [];

// Función para cargar los registros archivados desde localStorage
function loadRegistrosArchivados() {
    const saved = localStorage.getItem('registrosArchivados');
    if (saved) {
        registrosArchivados = JSON.parse(saved);
    }
    displayRegistrosArchivados();
}

// Función para guardar los registros archivados en localStorage
function saveRegistrosArchivados() {
    localStorage.setItem('registrosArchivados', JSON.stringify(registrosArchivados));
}

// Función principal para archivar y limpiar el historial
function archivarYLimpiarHistorial() {
    if (historialConteos.length === 0) {
        return;
    }
        // Crear el registro archivado con la fecha actual
        const ahora = new Date();
        const fechaArchivo = ahora.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
        const horaArchivo = ahora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const fechaCompleta = `${fechaArchivo} ${horaArchivo}`;
        
        // Calcular totales por tipo de caja
        const totalesPorCaja = {};
        let totalGeneral = 0;
        
        historialConteos.forEach(conteo => {
            if (conteo.cajas) {
                Object.keys(conteo.cajas).forEach(nombreCaja => {
                    if (!totalesPorCaja[nombreCaja]) {
                        totalesPorCaja[nombreCaja] = 0;
                    }
                    totalesPorCaja[nombreCaja] += conteo.cajas[nombreCaja];
                    totalGeneral += conteo.cajas[nombreCaja];
                });
            }
        });
        
        const nuevoRegistro = {
            fechaArchivo: fechaCompleta,
            totales: totalesPorCaja,
            totalGeneral: totalGeneral,
            conteos: [...historialConteos] // Copia del historial completo
        };
        
        // Agregar al inicio de los registros archivados
        registrosArchivados.unshift(nuevoRegistro);
        saveRegistrosArchivados();
        
        // Limpiar el historial actual
        historialConteos = [];
        saveHistorialConteos();
        
        // Actualizar las pantallas
        displayHistorialConteos();
        displayRegistrosArchivados();
}

// Función para mostrar los registros archivados
function displayRegistrosArchivados() {
    const tbody = document.querySelector('#registros .data-table tbody');
    if (!tbody) return;
    
    // Limpiar contenido existente
    tbody.innerHTML = '';
    
    if (registrosArchivados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #666;">No hay registros archivados</td></tr>';
        return;
    }
    
    // Mostrar cada registro archivado
    registrosArchivados.forEach((registro, index) => {
        const row = document.createElement('tr');
        
        let cellsHTML = `<td>${registro.fechaArchivo}</td>`;
        
        // Agregar celdas para cada tipo de caja usando el orden de userCreatedBoxes
        userCreatedBoxes.forEach(box => {
            const cantidad = (registro.totales && registro.totales[box.nombre]) || 0;
            cellsHTML += `<td>${cantidad}</td>`;
        });
        
        // Botones de acciones
        cellsHTML += `<td>
            <button class="btn small-btn" onclick="verDetalleRegistro(${index})" title="Ver detalle"><i class="fas fa-eye"></i></button>
            <button class="btn small-btn danger-btn" onclick="eliminarRegistroArchivado(${index})" title="Eliminar registro" style="margin-left: 5px;"><i class="fas fa-trash"></i></button>
        </td>`;
        
        row.innerHTML = cellsHTML;
        tbody.appendChild(row);
    });
    
    // Actualizar encabezados de la tabla de registros
    updateRegistrosHeaders();
}

// Función para actualizar los encabezados de la tabla de registros
function updateRegistrosHeaders() {
    const thead = document.querySelector('#registros .data-table thead tr');
    if (!thead) return;
    
    // Crear encabezados dinámicamente usando el orden de userCreatedBoxes
    let headersHTML = '<th>Fecha Archivo</th>';
    
    // Encabezados para cada tipo de caja usando nombres completos
    userCreatedBoxes.forEach(box => {
        headersHTML += `<th>${box.nombre}</th>`;
    });
    
    headersHTML += '<th>Acciones</th>';
    
    thead.innerHTML = headersHTML;
}

// Función para ver el detalle de un registro archivado
function verDetalleRegistro(index) {
    const registro = registrosArchivados[index];
    if (!registro) return;
    
    let mensaje = `Detalle del registro archivado el ${registro.fechaArchivo}:\n\n`;
    mensaje += `Total general: ${registro.totalGeneral} cajas\n\n`;
    mensaje += 'Totales por tipo de caja:\n';
    
    Object.keys(registro.totales).forEach(nombreCaja => {
        mensaje += `- ${nombreCaja}: ${registro.totales[nombreCaja]}\n`;
    });
    
    mensaje += `\nConteos individuales: ${registro.conteos.length} registros`;
    
    console.log(mensaje);
}

// Función para eliminar un registro archivado específico
function eliminarRegistroArchivado(index) {
    const registro = registrosArchivados[index];
    if (!registro) return;
    
    // Eliminar el registro del array
    registrosArchivados.splice(index, 1);
    
    // Guardar los cambios en localStorage
    saveRegistrosArchivados();
    
    // Actualizar la visualización
    displayRegistrosArchivados();
}

// Función para exportar historial a PDF
function exportarHistorialPDF() {
    if (historialConteos.length === 0) {
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(16);
    doc.text('Historial de Conteos', 20, 20);
    
    // Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.text(`Generado el: ${fechaGeneracion}`, 20, 30);
    
    // Usar todas las cajas juntas sin separar
    const todasLasCajas = userCreatedBoxes;
    const todasLasCajasArray = todasLasCajas.map(box => box.nombre);
    
    // Mantener arrays para compatibilidad
    const cajasNormalesArray = todasLasCajasArray;
    const cajasPaletArray = [];
    
    // Preparar encabezados con orden específico: Total, caja de palet, demás cajas
    const cajaPaleMercancia = todasLasCajas.find(box => 
        box.nombre.toLowerCase().includes('palet') || 
        box.nombre.toLowerCase().includes('mercancia')
    );
    
    let headersOrdenados = ['Fecha/Hora', 'Total'];
    
    // Agregar PALE DE MERCANCIA inmediatamente después de Total
    if (cajaPaleMercancia) {
        headersOrdenados.push(cajaPaleMercancia.nombre);
    }
    
    // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
    todasLasCajas.forEach(box => {
        if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
            headersOrdenados.push(box.nombre);
        }
    });
    
    const headers = headersOrdenados;
    const data = [];
    
    // Variables para subtotales (igual que en pantalla)
    let subtotalesPorCaja = {};
    let subtotalGeneral = 0;
    let contadorFilas = 0;
    
    // Variables para total general (solo cajas normales)
    let totalesPorCaja = {};
    let totalGeneral = 0;
    
    // Variables para palets (separados)
    let subtotalesPalets = {};
    let totalesPalets = {};
    
    // Inicializar subtotales y totales
    cajasNormalesArray.forEach(nombreCaja => {
        subtotalesPorCaja[nombreCaja] = 0;
        totalesPorCaja[nombreCaja] = 0;
    });
    
    cajasPaletArray.forEach(nombreCaja => {
        subtotalesPalets[nombreCaja] = 0;
        totalesPalets[nombreCaja] = 0;
    });
    
    // Agregar filas de datos con subtotales cada 4 filas
    historialConteos.forEach((conteo, index) => {
        const fila = [conteo.fecha];
        
        // Calcular total solo de cajas normales
        let totalCajasNormales = 0;
        
        // Primero calcular el total
        cajasNormalesArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            totalCajasNormales += cantidad;
        });
        
        // Agregar columna Total después de Fecha
        fila.push(totalCajasNormales.toString());
        
        // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
        const cajaPaleMercancia = todasLasCajas.find(box => 
            box.nombre.toLowerCase().includes('palet') || 
            box.nombre.toLowerCase().includes('mercancia')
        );
        
        // Agregar PALE DE MERCANCIA inmediatamente después de Total
        if (cajaPaleMercancia) {
            const cantidad = (conteo.cajas && conteo.cajas[cajaPaleMercancia.nombre]) || 0;
            fila.push(cantidad.toString());
            
            // Acumular en subtotales y totales
            subtotalesPorCaja[cajaPaleMercancia.nombre] += cantidad;
            totalesPorCaja[cajaPaleMercancia.nombre] += cantidad;
        }
        
        // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
        todasLasCajas.forEach(box => {
            if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
                const cantidad = (conteo.cajas && conteo.cajas[box.nombre]) || 0;
                fila.push(cantidad.toString());
                
                // Acumular en subtotales y totales
                subtotalesPorCaja[box.nombre] += cantidad;
                totalesPorCaja[box.nombre] += cantidad;
            }
        });
        
        // Acumular totales generales (solo cajas normales)
        subtotalGeneral += totalCajasNormales;
        totalGeneral += totalCajasNormales;
        
        data.push(fila);
        
        contadorFilas++;
        
        // Agregar fila de subtotal cada 4 conteos o al final
        if (contadorFilas % 4 === 0 || index === historialConteos.length - 1) {
            const filaSubtotal = ['SUBTOTAL'];
            
            // Agregar subtotal general en segunda posición
            filaSubtotal.push(subtotalGeneral.toString());
            
            // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
            const cajaPaleMercancia = todasLasCajas.find(box => 
                box.nombre.toLowerCase().includes('palet') || 
                box.nombre.toLowerCase().includes('mercancia')
            );
            
            // Agregar PALE DE MERCANCIA inmediatamente después de Total
            if (cajaPaleMercancia) {
                filaSubtotal.push((subtotalesPorCaja[cajaPaleMercancia.nombre] || 0).toString());
            }
            
            // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
            todasLasCajas.forEach(box => {
                if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
                    filaSubtotal.push((subtotalesPorCaja[box.nombre] || 0).toString());
                }
            });
            
            data.push(filaSubtotal);
            
            // Reiniciar subtotales
            cajasNormalesArray.forEach(nombreCaja => {
                subtotalesPorCaja[nombreCaja] = 0;
            });
            cajasPaletArray.forEach(nombreCaja => {
                subtotalesPalets[nombreCaja] = 0;
            });
            subtotalGeneral = 0;
        }
    });
    
    // Agregar fila de total general
    const filaTotalGeneral = ['TOTAL GENERAL'];
    
    // Agregar total general en segunda posición
    filaTotalGeneral.push(totalGeneral.toString());
    
    // Buscar la caja de palet (cualquier caja que contenga 'palet' o 'mercancia')
        const cajaPaleMercancia = todasLasCajas.find(box => 
            box.nombre.toLowerCase().includes('palet') || 
            box.nombre.toLowerCase().includes('mercancia')
        );
    
    // Agregar PALE DE MERCANCIA inmediatamente después de Total
    if (cajaPaleMercancia) {
        filaTotalGeneral.push((totalesPorCaja[cajaPaleMercancia.nombre] || 0).toString());
    }
    
    // Agregar las demás cajas (excluyendo PALE DE MERCANCIA)
    todasLasCajas.forEach(box => {
        if (!cajaPaleMercancia || box.nombre !== cajaPaleMercancia.nombre) {
            filaTotalGeneral.push((totalesPorCaja[box.nombre] || 0).toString());
        }
    });
    
    data.push(filaTotalGeneral);
    
    // Crear tabla usando autoTable
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        didParseCell: function(data) {
            const cellText = data.cell.text[0];
            
            // Resaltar filas de subtotal
            if (cellText === 'SUBTOTAL') {
                data.cell.styles.fillColor = [255, 235, 59];
                data.cell.styles.textColor = 0;
                data.cell.styles.fontStyle = 'bold';
            }
            
            // Resaltar fila de total general
            if (cellText === 'TOTAL GENERAL') {
                data.cell.styles.fillColor = [52, 152, 219];
                data.cell.styles.textColor = 255;
                data.cell.styles.fontStyle = 'bold';
            }
            
            // Resaltar columnas de palets en encabezados
            if (data.section === 'head') {
                const columnIndex = data.column.index;
                const headerText = headers[columnIndex];
                if (cajasPaletArray.includes(headerText)) {
                    data.cell.styles.fillColor = [240, 248, 255];
                    data.cell.styles.textColor = 0;
                }
            }
        }
    });
    
    // Guardar el PDF
    doc.save(`historial-conteos-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Función para exportar registros archivados a PDF
function exportarRegistrosPDF() {
    if (registrosArchivados.length === 0) {
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(16);
    doc.text('Registros Archivados', 20, 20);
    
    // Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.text(`Generado el: ${fechaGeneracion}`, 20, 30);
    
    // Obtener todas las cajas únicas de los registros
    const todasLasCajas = new Set();
    registrosArchivados.forEach(registro => {
        if (registro.totales) {
            Object.keys(registro.totales).forEach(caja => todasLasCajas.add(caja));
        }
    });
    
    const cajasArray = Array.from(todasLasCajas);
    
    // Preparar datos para la tabla
    const headers = ['Fecha Archivo', ...cajasArray, 'Total General'];
    const data = [];
    
    // Agregar filas de datos
    registrosArchivados.forEach(registro => {
        const fila = [registro.fechaArchivo];
        
        // Agregar totales por cada tipo de caja
        cajasArray.forEach(nombreCaja => {
            const cantidad = (registro.totales && registro.totales[nombreCaja]) || 0;
            fila.push(cantidad.toString());
        });
        
        // Agregar total general
        fila.push(registro.totalGeneral.toString());
        
        data.push(fila);
    });
    
    // Crear tabla usando autoTable
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });
    
    // Guardar el PDF
    doc.save(`registros-archivados-${new Date().toISOString().split('T')[0]}.pdf`);
}
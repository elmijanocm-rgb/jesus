// Configuración de cajas disponibles
const cajasDisponibles = {
    'Caja 59': { precio: 59, color: '#FFE5B4' },
    'Caja 56': { precio: 56, color: '#E5F3FF' },
    'Caja 64': { precio: 64, color: '#E5FFE5' },
    'Caja 63': { precio: 63, color: '#FFE5E5' },
    'Caja 60': { precio: 60, color: '#F0E5FF' },
    'Caja 53': { precio: 53, color: '#FFFACD' },
    'Caja 80': { precio: 80, color: '#F5F5DC' },
    'Caja 67': { precio: 67, color: '#E0FFFF' },
    'Caja 74': { precio: 74, color: '#FFF0F5' },
    'Caja 61': { precio: 61, color: '#F0FFF0' },
    'Palet 59': { precio: 59, color: '#FFE5B4', esPalet: true },
    'Palet 56': { precio: 56, color: '#E5F3FF', esPalet: true },
    'Palet 64': { precio: 64, color: '#E5FFE5', esPalet: true },
    'Palet 63': { precio: 63, color: '#FFE5E5', esPalet: true },
    'Palet 60': { precio: 60, color: '#F0E5FF', esPalet: true },
    'Palet 53': { precio: 53, color: '#FFFACD', esPalet: true },
    'Palet 80': { precio: 80, color: '#F5F5DC', esPalet: true },
    'Palet 67': { precio: 67, color: '#E0FFFF', esPalet: true },
    'Palet 74': { precio: 74, color: '#FFF0F5', esPalet: true },
    'Palet 61': { precio: 61, color: '#F0FFF0', esPalet: true }
};

// Separar cajas normales y palets
const cajasNormalesArray = Object.keys(cajasDisponibles).filter(nombre => !cajasDisponibles[nombre].esPalet);
const cajasPaletArray = Object.keys(cajasDisponibles).filter(nombre => cajasDisponibles[nombre].esPalet);

// Orden específico para mostrar las columnas (primero cajas normales, luego palets)
const ordenColumnasData = [...cajasNormalesArray, ...cajasPaletArray];

// Colores para los bloques
const coloresBloques = [
    '#E8F5E8', // Verde claro para bloque activo
    '#FFF2E8', // Naranja claro
    '#E8F2FF', // Azul claro
    '#F8E8FF', // Morado claro
    '#FFE8F2', // Rosa claro
    '#E8FFF2'  // Verde agua claro
];

// Variables globales
let historialConteos = JSON.parse(localStorage.getItem('historialConteos')) || [];
let cajasCreadas = JSON.parse(localStorage.getItem('cajasCreadas')) || {};
let userCreatedBoxes = JSON.parse(localStorage.getItem('userCreatedBoxes')) || [];
let contadorBloques = parseInt(localStorage.getItem('contadorBloques')) || 1;
let filasEnBloqueActual = parseInt(localStorage.getItem('filasEnBloqueActual')) || 0;

// Función para obtener fecha y hora actual
function obtenerFechaHoraActual() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const año = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
}

// Función para guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('historialConteos', JSON.stringify(historialConteos));
    localStorage.setItem('cajasCreadas', JSON.stringify(cajasCreadas));
    localStorage.setItem('userCreatedBoxes', JSON.stringify(userCreatedBoxes));
    localStorage.setItem('contadorBloques', contadorBloques.toString());
    localStorage.setItem('filasEnBloqueActual', filasEnBloqueActual.toString());
}

// Función para crear una nueva caja personalizada
function crearNuevaCaja() {
    const modal = document.getElementById('modalNuevaCaja');
    modal.style.display = 'block';
    
    // Limpiar campos
    document.getElementById('nombreCaja').value = '';
    document.getElementById('precioCaja').value = '';
    document.getElementById('colorCaja').value = '#FFE5B4';
    document.getElementById('esPalet').checked = false;
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modalNuevaCaja');
    modal.style.display = 'none';
}

// Función para confirmar la creación de una nueva caja
function confirmarNuevaCaja() {
    const nombre = document.getElementById('nombreCaja').value.trim();
    const precio = parseFloat(document.getElementById('precioCaja').value);
    const color = document.getElementById('colorCaja').value;
    const esPalet = document.getElementById('esPalet').checked;
    
    if (!nombre || isNaN(precio) || precio <= 0) {
        alert('Por favor, ingresa un nombre válido y un precio mayor a 0.');
        return;
    }
    
    // Verificar si ya existe una caja con ese nombre
    if (cajasDisponibles[nombre] || cajasCreadas[nombre]) {
        alert('Ya existe una caja con ese nombre.');
        return;
    }
    
    // Crear la nueva caja
    const nuevaCaja = {
        precio: precio,
        color: color,
        esPalet: esPalet,
        esPersonalizada: true
    };
    
    cajasCreadas[nombre] = nuevaCaja;
    
    // Agregar a userCreatedBoxes para el ordenamiento
    userCreatedBoxes.push({
        name: nombre,
        position: userCreatedBoxes.length
    });
    
    guardarEnLocalStorage();
    cerrarModal();
    actualizarInterfaz();
    
    alert(`Caja "${nombre}" creada exitosamente.`);
}

// Función para eliminar una caja personalizada
function eliminarCaja(nombreCaja) {
    if (!cajasCreadas[nombreCaja]) {
        alert('Esta caja no se puede eliminar.');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar la caja "${nombreCaja}"?`)) {
        delete cajasCreadas[nombreCaja];
        
        // Eliminar de userCreatedBoxes
        userCreatedBoxes = userCreatedBoxes.filter(box => box.name !== nombreCaja);
        
        // Eliminar de historial de conteos
        historialConteos.forEach(conteo => {
            if (conteo.cajas && conteo.cajas[nombreCaja]) {
                delete conteo.cajas[nombreCaja];
            }
        });
        
        guardarEnLocalStorage();
        actualizarInterfaz();
        
        alert(`Caja "${nombreCaja}" eliminada exitosamente.`);
    }
}

// Función para mover cajas personalizadas
function moverCaja(nombreCaja, direccion) {
    const index = userCreatedBoxes.findIndex(box => box.name === nombreCaja);
    if (index === -1) return;
    
    const newIndex = direccion === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < userCreatedBoxes.length) {
        // Intercambiar posiciones
        [userCreatedBoxes[index], userCreatedBoxes[newIndex]] = [userCreatedBoxes[newIndex], userCreatedBoxes[index]];
        
        // Actualizar las posiciones
        userCreatedBoxes.forEach((box, i) => {
            box.position = i;
        });
        
        guardarEnLocalStorage();
        actualizarInterfaz();
    }
}

// Función para obtener todas las cajas (predefinidas + personalizadas) en orden
function obtenerTodasLasCajas() {
    const todasLasCajas = { ...cajasDisponibles };
    
    // Agregar cajas personalizadas
    Object.keys(cajasCreadas).forEach(nombre => {
        todasLasCajas[nombre] = cajasCreadas[nombre];
    });
    
    return todasLasCajas;
}

// Función para obtener el orden de las columnas
function obtenerOrdenColumnas() {
    const todasLasCajas = obtenerTodasLasCajas();
    
    // Separar cajas normales y palets (incluyendo personalizadas)
    const cajasNormales = Object.keys(todasLasCajas).filter(nombre => !todasLasCajas[nombre].esPalet);
    const cajasPalet = Object.keys(todasLasCajas).filter(nombre => todasLasCajas[nombre].esPalet);
    
    // Ordenar cajas personalizadas según userCreatedBoxes
    const sortedBoxes = [...userCreatedBoxes].sort((a, b) => (a.position || 0) - (b.position || 0));
    const cajasPersonalizadasOrdenadas = sortedBoxes.map(box => box.name);
    
    // Combinar: predefinidas + personalizadas ordenadas
    const cajasNormalesOrdenadas = [
        ...cajasNormalesArray.filter(nombre => cajasNormales.includes(nombre)),
        ...cajasPersonalizadasOrdenadas.filter(nombre => cajasNormales.includes(nombre))
    ];
    
    const cajasPaletOrdenadas = [
        ...cajasPaletArray.filter(nombre => cajasPalet.includes(nombre)),
        ...cajasPersonalizadasOrdenadas.filter(nombre => cajasPalet.includes(nombre))
    ];
    
    return [...cajasNormalesOrdenadas, ...cajasPaletOrdenadas];
}

// Función para crear los inputs de conteo
function crearInputsConteo() {
    const container = document.getElementById('inputsContainer');
    container.innerHTML = '';
    
    const todasLasCajas = obtenerTodasLasCajas();
    const ordenColumnas = obtenerOrdenColumnas();
    
    // Crear sección de cajas normales
    const seccionNormales = document.createElement('div');
    seccionNormales.className = 'seccion-cajas';
    seccionNormales.innerHTML = '<h3>Cajas Normales</h3>';
    
    const gridNormales = document.createElement('div');
    gridNormales.className = 'grid-cajas';
    
    // Crear sección de palets
    const seccionPalets = document.createElement('div');
    seccionPalets.className = 'seccion-cajas';
    seccionPalets.innerHTML = '<h3>Palets</h3>';
    
    const gridPalets = document.createElement('div');
    gridPalets.className = 'grid-cajas';
    
    ordenColumnas.forEach(nombreCaja => {
        const caja = todasLasCajas[nombreCaja];
        if (!caja) return;
        
        const cajaDiv = document.createElement('div');
        cajaDiv.className = 'caja-input';
        cajaDiv.style.backgroundColor = caja.color;
        
        const esPersonalizada = caja.esPersonalizada;
        const controlesHTML = esPersonalizada ? `
            <div class="controles-caja">
                <button type="button" onclick="moverCaja('${nombreCaja}', 'up')" title="Mover arriba">↑</button>
                <button type="button" onclick="moverCaja('${nombreCaja}', 'down')" title="Mover abajo">↓</button>
                <button type="button" onclick="eliminarCaja('${nombreCaja}')" title="Eliminar" class="btn-eliminar">×</button>
            </div>
        ` : '';
        
        cajaDiv.innerHTML = `
            <label for="${nombreCaja}">${nombreCaja}</label>
            <input type="number" id="${nombreCaja}" name="${nombreCaja}" min="0" value="0">
            ${controlesHTML}
        `;
        
        if (caja.esPalet) {
            gridPalets.appendChild(cajaDiv);
        } else {
            gridNormales.appendChild(cajaDiv);
        }
    });
    
    seccionNormales.appendChild(gridNormales);
    seccionPalets.appendChild(gridPalets);
    
    container.appendChild(seccionNormales);
    container.appendChild(seccionPalets);
}

// Función para agregar un nuevo conteo
function agregarConteo() {
    const todasLasCajas = obtenerTodasLasCajas();
    const ordenColumnas = obtenerOrdenColumnas();
    
    const nuevoConteo = {
        fecha: obtenerFechaHoraActual(),
        cajas: {}
    };
    
    let hayDatos = false;
    
    ordenColumnas.forEach(nombreCaja => {
        const input = document.getElementById(nombreCaja);
        if (input) {
            const cantidad = parseInt(input.value) || 0;
            nuevoConteo.cajas[nombreCaja] = cantidad;
            if (cantidad > 0) {
                hayDatos = true;
            }
        }
    });
    
    if (!hayDatos) {
        alert('Por favor, ingresa al menos una cantidad mayor a 0.');
        return;
    }
    
    historialConteos.push(nuevoConteo); // Agregar al final para que slice(-n) tome los más recientes
    filasEnBloqueActual++;
    
    // Limpiar inputs
    ordenColumnas.forEach(nombreCaja => {
        const input = document.getElementById(nombreCaja);
        if (input) {
            input.value = '0';
        }
    });
    
    guardarEnLocalStorage();
    actualizarTabla();
}

// Función para cerrar el bloque actual
function cerrarBloque() {
    if (filasEnBloqueActual === 0) {
        alert('No hay filas en el bloque actual para cerrar.');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres cerrar el bloque ${contadorBloques}?`)) {
        contadorBloques++;
        filasEnBloqueActual = 0;
        guardarEnLocalStorage();
        actualizarTabla();
        alert(`Bloque cerrado. Ahora estás en el Bloque ${contadorBloques}.`);
    }
}

// Función para eliminar una fila del historial
function eliminarFila(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        historialConteos.splice(index, 1);
        
        // Ajustar filasEnBloqueActual si la fila eliminada pertenecía al bloque actual
        const totalFilas = historialConteos.length;
        const bloquesCompletos = Math.floor(totalFilas / 4);
        const filasEnUltimoBloque = totalFilas % 4;
        
        if (filasEnUltimoBloque < filasEnBloqueActual) {
            filasEnBloqueActual = filasEnUltimoBloque;
        }
        
        guardarEnLocalStorage();
        actualizarTabla();
    }
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.querySelector('#tablaConteos tbody');
    tbody.innerHTML = '';
    
    if (historialConteos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="100%" style="text-align: center; color: #666;">No hay conteos registrados</td>';
        tbody.appendChild(row);
        actualizarTotales();
        return;
    }
    
    const todasLasCajas = obtenerTodasLasCajas();
    const ordenColumnas = obtenerOrdenColumnas();
    
    // Calcular bloques
    const totalFilas = historialConteos.length;
    const bloquesCompletos = Math.floor(totalFilas / 4);
    
    // Variables para totales generales
    let totalesPorCaja = {};
    let totalesPalets = {};
    let totalGeneral = 0;
    
    // Inicializar totales
    ordenColumnas.forEach(nombreCaja => {
        const caja = todasLasCajas[nombreCaja];
        if (caja && caja.esPalet) {
            totalesPalets[nombreCaja] = 0;
        } else {
            totalesPorCaja[nombreCaja] = 0;
        }
    });
    
    // PASO 1: MOSTRAR BLOQUE ACTIVO (arriba)
    if (filasEnBloqueActual > 0) {
        // Título del bloque activo
        const tituloRow = document.createElement('tr');
        tituloRow.className = 'block-title-row';
        tituloRow.style.backgroundColor = '#2196F3';
        tituloRow.style.color = 'white';
        tituloRow.style.fontWeight = 'bold';
        tituloRow.style.textAlign = 'left';
        
        const tituloCell = document.createElement('td');
        tituloCell.colSpan = ordenColumnas.length + 3; // +3 para Fecha/Hora, Total y Acciones
        tituloCell.innerHTML = `🔓 BLOQUE ${contadorBloques} (ACTIVO)`;
        tituloRow.appendChild(tituloCell);
        tbody.appendChild(tituloRow);
        
        // Variables para subtotales del bloque activo
        let subtotalesBloqueActivo = {};
        let subtotalesPaletsBloqueActivo = {};
        let subtotalGeneralBloqueActivo = 0;
        
        // Inicializar subtotales para el bloque activo
        ordenColumnas.forEach(nombreCaja => {
            const caja = todasLasCajas[nombreCaja];
            if (caja && caja.esPalet) {
                subtotalesPaletsBloqueActivo[nombreCaja] = 0;
            } else {
                subtotalesBloqueActivo[nombreCaja] = 0;
            }
        });
        
        // Obtener las filas del bloque activo (las últimas filasEnBloqueActual)
        const conteosActuales = historialConteos.slice(-filasEnBloqueActual);
        
        conteosActuales.forEach((conteo, index) => {
            const globalIndex = historialConteos.length - filasEnBloqueActual + index;
            const row = document.createElement('tr');
            
            // Color del bloque activo (primer color)
            row.style.backgroundColor = coloresBloques[0];
            
            let cellsHTML = `<td>${conteo.fecha}</td>`;
            
            // Calcular total de cajas normales
            let totalCajasNormales = 0;
            Object.keys(todasLasCajas).forEach(nombreCaja => {
                const caja = todasLasCajas[nombreCaja];
                if (caja && !caja.esPalet) {
                    const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                    totalCajasNormales += cantidad;
                }
            });
            
            cellsHTML += `<td><strong>${totalCajasNormales}</strong></td>`;
            
            // Agregar celdas en el orden específico
            ordenColumnas.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                cellsHTML += `<td>${cantidad}</td>`;
                
                // Acumular en subtotales del bloque activo y totales generales
                const caja = todasLasCajas[nombreCaja];
                if (caja && caja.esPalet) {
                    subtotalesPaletsBloqueActivo[nombreCaja] += cantidad;
                    totalesPalets[nombreCaja] += cantidad;
                } else {
                    subtotalesBloqueActivo[nombreCaja] += cantidad;
                    totalesPorCaja[nombreCaja] += cantidad;
                }
            });
            
            subtotalGeneralBloqueActivo += totalCajasNormales;
            totalGeneral += totalCajasNormales;
            
            // Agregar botón de eliminar
            cellsHTML += `<td><button onclick="eliminarFila(${globalIndex})" class="btn-eliminar">Eliminar</button></td>`;
            
            row.innerHTML = cellsHTML;
            
            // Agregar clase para resaltar si tiene cantidades
            if (totalCajasNormales > 0 || Object.keys(todasLasCajas).some(nombreCaja => {
                const caja = todasLasCajas[nombreCaja];
                return caja && caja.esPalet && (conteo.cajas && conteo.cajas[nombreCaja]) > 0;
            })) {
                row.classList.add('has-quantities');
            }
            
            // Agregar clase a las celdas de palets
            const paletCells = row.querySelectorAll('td');
            const cajasNormalesCount = Object.keys(todasLasCajas).filter(nombre => !todasLasCajas[nombre].esPalet).length;
            const startPaletIndex = 1 + cajasNormalesCount;
            const cajasPaletCount = Object.keys(todasLasCajas).filter(nombre => todasLasCajas[nombre].esPalet).length;
            for (let i = 0; i < cajasPaletCount; i++) {
                if (paletCells[startPaletIndex + i]) {
                    paletCells[startPaletIndex + i].classList.add('palet-column');
                }
            }
            
            tbody.appendChild(row);
        });
        
        // Fila de subtotal del bloque activo
        const subtotalRow = document.createElement('tr');
        subtotalRow.className = 'subtotal-row';
        subtotalRow.style.backgroundColor = '#E3F2FD';
        subtotalRow.style.fontWeight = 'bold';
        
        let subtotalHTML = `<td>Subtotal Bloque ${contadorBloques}</td>`;
        subtotalHTML += `<td><strong>${subtotalGeneralBloqueActivo}</strong></td>`;
        
        ordenColumnas.forEach(nombreCaja => {
            const caja = todasLasCajas[nombreCaja];
            if (caja && caja.esPalet) {
                subtotalHTML += `<td>${subtotalesPaletsBloqueActivo[nombreCaja]}</td>`;
            } else {
                subtotalHTML += `<td>${subtotalesBloqueActivo[nombreCaja]}</td>`;
            }
        });
        
        subtotalHTML += `<td></td>`; // Celda vacía para la columna de acciones
        subtotalRow.innerHTML = subtotalHTML;
        tbody.appendChild(subtotalRow);
        
        // Separador si hay bloques cerrados
        if (bloquesCompletos > 0) {
            const separatorRow = document.createElement('tr');
            separatorRow.className = 'separator-row';
            
            const separatorCell = document.createElement('td');
            separatorCell.colSpan = ordenColumnas.length + 3;
            separatorCell.style.textAlign = 'center';
            separatorCell.style.padding = '15px';
            separatorCell.style.fontSize = '14px';
            separatorCell.style.fontWeight = 'bold';
            separatorCell.style.backgroundColor = '#f5f5f5';
            separatorCell.style.color = '#666';
            separatorCell.innerHTML = '═══ BLOQUES CERRADOS ═══';
            
            separatorRow.appendChild(separatorCell);
            tbody.appendChild(separatorRow);
        }
    }
    
    // PASO 2: MOSTRAR BLOQUES CERRADOS (abajo) - Del más reciente al más antiguo
    for (let bloqueIndex = bloquesCompletos - 1; bloqueIndex >= 0; bloqueIndex--) {
        const numeroBloque = bloqueIndex + 1; // El bloque más reciente será el número más bajo
        // Calcular desde el final del array, excluyendo el bloque activo
        const inicioBloque = historialConteos.length - filasEnBloqueActual - (bloqueIndex + 1) * 4;
        const finBloque = inicioBloque + 4;
        const conteosBloque = historialConteos.slice(inicioBloque, finBloque).reverse();
        
        // Título del bloque cerrado
        const tituloRow = document.createElement('tr');
        tituloRow.className = 'block-title-row';
        tituloRow.style.backgroundColor = '#4CAF50';
        tituloRow.style.color = 'white';
        tituloRow.style.fontWeight = 'bold';
        tituloRow.style.textAlign = 'left';
        
        const tituloCell = document.createElement('td');
        tituloCell.colSpan = ordenColumnas.length + 3; // +3 para Fecha/Hora, Total y Acciones
        tituloCell.innerHTML = `🔒 BLOQUE ${numeroBloque} (CERRADO)`;
        tituloRow.appendChild(tituloCell);
        tbody.appendChild(tituloRow);
        
        // Variables para subtotales de este bloque específico
        let subtotalesBloqueCompleto = {};
        let subtotalesPaletsBloqueCompleto = {};
        let subtotalGeneralBloque = 0;
        
        // Inicializar subtotales para este bloque
        ordenColumnas.forEach(nombreCaja => {
            const caja = todasLasCajas[nombreCaja];
            if (caja && caja.esPalet) {
                subtotalesPaletsBloqueCompleto[nombreCaja] = 0;
            } else {
                subtotalesBloqueCompleto[nombreCaja] = 0;
            }
        });
        
        // Mostrar filas del bloque cerrado
        conteosBloque.forEach((conteo, indexEnBloque) => {
            const row = document.createElement('tr');
            
            // Color del bloque (ciclar colores empezando desde el segundo)
            const colorBloque = coloresBloques[(bloqueIndex + 1) % coloresBloques.length];
            row.style.backgroundColor = colorBloque;
            
            let cellsHTML = `<td>${conteo.fecha}</td>`;
            
            // Calcular total de cajas normales
            let totalCajasNormales = 0;
            Object.keys(todasLasCajas).forEach(nombreCaja => {
                const caja = todasLasCajas[nombreCaja];
                if (caja && !caja.esPalet) {
                    const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                    totalCajasNormales += cantidad;
                }
            });
            
            cellsHTML += `<td><strong>${totalCajasNormales}</strong></td>`;
            
            // Agregar celdas en el orden específico
            ordenColumnas.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                cellsHTML += `<td>${cantidad}</td>`;
                
                // Acumular en subtotales de este bloque específico y totales generales
                const caja = todasLasCajas[nombreCaja];
                if (caja && caja.esPalet) {
                    subtotalesPaletsBloqueCompleto[nombreCaja] += cantidad;
                    totalesPalets[nombreCaja] += cantidad;
                } else {
                    subtotalesBloqueCompleto[nombreCaja] += cantidad;
                    totalesPorCaja[nombreCaja] += cantidad;
                }
            });
            
            subtotalGeneralBloque += totalCajasNormales;
            totalGeneral += totalCajasNormales;
            
            // Agregar celda vacía de acciones para bloques cerrados
            cellsHTML += `<td></td>`;
            
            row.innerHTML = cellsHTML;
            
            // Agregar clase para resaltar si tiene cantidades
            if (totalCajasNormales > 0 || Object.keys(todasLasCajas).some(nombreCaja => {
                const caja = todasLasCajas[nombreCaja];
                return caja && caja.esPalet && (conteo.cajas && conteo.cajas[nombreCaja]) > 0;
            })) {
                row.classList.add('has-quantities');
            }
            
            // Agregar clase a las celdas de palets
            const paletCells = row.querySelectorAll('td');
            const cajasNormalesCount = Object.keys(todasLasCajas).filter(nombre => !todasLasCajas[nombre].esPalet).length;
            const startPaletIndex = 1 + cajasNormalesCount;
            const cajasPaletCount = Object.keys(todasLasCajas).filter(nombre => todasLasCajas[nombre].esPalet).length;
            for (let i = 0; i < cajasPaletCount; i++) {
                if (paletCells[startPaletIndex + i]) {
                    paletCells[startPaletIndex + i].classList.add('palet-column');
                }
            }
            
            tbody.appendChild(row);
        });
        
        // Fila de subtotal del bloque cerrado
        const subtotalRow = document.createElement('tr');
        subtotalRow.className = 'subtotal-row';
        subtotalRow.style.backgroundColor = '#E8F5E8';
        subtotalRow.style.fontWeight = 'bold';
        
        let subtotalHTML = `<td>Subtotal Bloque ${numeroBloque}</td>`;
        subtotalHTML += `<td><strong>${subtotalGeneralBloque}</strong></td>`;
        
        ordenColumnas.forEach(nombreCaja => {
            const caja = todasLasCajas[nombreCaja];
            if (caja && caja.esPalet) {
                subtotalHTML += `<td>${subtotalesPaletsBloqueCompleto[nombreCaja]}</td>`;
            } else {
                subtotalHTML += `<td>${subtotalesBloqueCompleto[nombreCaja]}</td>`;
            }
        });
        
        subtotalHTML += `<td></td>`; // Celda vacía para la columna de acciones
        subtotalRow.innerHTML = subtotalHTML;
        tbody.appendChild(subtotalRow);
    }
    
    // Actualizar totales en la interfaz
    actualizarTotales(totalesPorCaja, totalesPalets, totalGeneral);
}

// Función para actualizar los totales en la interfaz
function actualizarTotales(totalesPorCaja = {}, totalesPalets = {}, totalGeneral = 0) {
    const todasLasCajas = obtenerTodasLasCajas();
    const ordenColumnas = obtenerOrdenColumnas();
    
    // Si no se proporcionan totales, calcularlos
    if (Object.keys(totalesPorCaja).length === 0) {
        ordenColumnas.forEach(nombreCaja => {
            const caja = todasLasCajas[nombreCaja];
            if (caja && caja.esPalet) {
                totalesPalets[nombreCaja] = 0;
            } else {
                totalesPorCaja[nombreCaja] = 0;
            }
        });
        
        historialConteos.forEach(conteo => {
            ordenColumnas.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                const caja = todasLasCajas[nombreCaja];
                if (caja && caja.esPalet) {
                    totalesPalets[nombreCaja] += cantidad;
                } else {
                    totalesPorCaja[nombreCaja] += cantidad;
                    totalGeneral += cantidad;
                }
            });
        });
    }
    
    // Actualizar encabezados de la tabla con totales
    const thead = document.querySelector('#tablaConteos thead tr');
    if (thead) {
        thead.innerHTML = '';
        
        // Columna de fecha/hora
        const fechaHeader = document.createElement('th');
        fechaHeader.textContent = 'Fecha/Hora';
        thead.appendChild(fechaHeader);
        
        // Columna de total
        const totalHeader = document.createElement('th');
        totalHeader.innerHTML = `Total<br><small>(${totalGeneral})</small>`;
        totalHeader.style.backgroundColor = '#f0f0f0';
        thead.appendChild(totalHeader);
        
        // Columnas de cajas en orden específico
        ordenColumnas.forEach(nombreCaja => {
            const th = document.createElement('th');
            const caja = todasLasCajas[nombreCaja];
            const total = caja && caja.esPalet ? totalesPalets[nombreCaja] : totalesPorCaja[nombreCaja];
            
            th.innerHTML = `${nombreCaja}<br><small>(${total || 0})</small>`;
            
            if (caja) {
                th.style.backgroundColor = caja.color;
                if (caja.esPalet) {
                    th.classList.add('palet-column');
                }
            }
            
            thead.appendChild(th);
        });
        
        // Columna de acciones
        const accionesHeader = document.createElement('th');
        accionesHeader.textContent = 'Acciones';
        thead.appendChild(accionesHeader);
    }
    
    // Actualizar cajas de resumen
    actualizarCajasResumen(totalesPorCaja, totalesPalets, totalGeneral);
}

// Función para actualizar las cajas de resumen
function actualizarCajasResumen(totalesPorCaja, totalesPalets, totalGeneral) {
    // Actualizar TOTAL GENERAL
    const totalGeneralElement = document.getElementById('totalGeneral');
    if (totalGeneralElement) {
        totalGeneralElement.textContent = totalGeneral;
    }
    
    // Calcular total de palets
    const totalPalets = Object.values(totalesPalets).reduce((sum, cantidad) => sum + cantidad, 0);
    
    // Actualizar TOTAL PALETS
    const totalPaletsElement = document.getElementById('totalPalets');
    if (totalPaletsElement) {
        totalPaletsElement.textContent = totalPalets;
    }
}

// Función para crear la estructura de la tabla
function crearEstructuraTabla() {
    const tabla = document.getElementById('tablaConteos');
    if (!tabla.querySelector('thead')) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        thead.appendChild(headerRow);
        tabla.appendChild(thead);
    }
    
    if (!tabla.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
    }
}

// Función para limpiar todos los datos
function limpiarTodo() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        historialConteos = [];
        cajasCreadas = {};
        userCreatedBoxes = [];
        contadorBloques = 1;
        filasEnBloqueActual = 0;
        
        localStorage.removeItem('historialConteos');
        localStorage.removeItem('cajasCreadas');
        localStorage.removeItem('userCreatedBoxes');
        localStorage.removeItem('contadorBloques');
        localStorage.removeItem('filasEnBloqueActual');
        
        actualizarInterfaz();
        alert('Todos los datos han sido eliminados.');
    }
}

// Función para exportar datos
function exportarDatos() {
    const datos = {
        historialConteos,
        cajasCreadas,
        userCreatedBoxes,
        contadorBloques,
        filasEnBloqueActual,
        fechaExportacion: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `conteos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Función para importar datos
function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                
                if (confirm('¿Estás seguro de que quieres importar estos datos? Esto reemplazará todos los datos actuales.')) {
                    historialConteos = datos.historialConteos || [];
                    cajasCreadas = datos.cajasCreadas || {};
                    userCreatedBoxes = datos.userCreatedBoxes || [];
                    contadorBloques = datos.contadorBloques || 1;
                    filasEnBloqueActual = datos.filasEnBloqueActual || 0;
                    
                    guardarEnLocalStorage();
                    actualizarInterfaz();
                    alert('Datos importados exitosamente.');
                }
            } catch (error) {
                alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Función para actualizar toda la interfaz
function actualizarInterfaz() {
    crearInputsConteo();
    crearEstructuraTabla();
    actualizarTabla();
}

// Función para mostrar/ocultar el menú de configuración
function toggleConfigMenu() {
    const menu = document.getElementById('configMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const menu = document.getElementById('configMenu');
    const button = document.querySelector('.config-button');
    
    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// Cerrar modal si se hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalNuevaCaja');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarInterfaz();
    
    // Actualizar el número del bloque actual en la interfaz
    const bloqueActualElement = document.getElementById('bloqueActual');
    if (bloqueActualElement) {
        bloqueActualElement.textContent = contadorBloques;
    }
});

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado exitosamente:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar ServiceWorker:', error);
            });
    });
}

// Función para mostrar información de la aplicación
function mostrarInfo() {
    alert(`Aplicación de Conteo de Cajas\nVersión: 2.0\nDesarrollada para gestión de inventarios\n\nCaracterísticas:\n- Conteo por bloques\n- Cajas personalizadas\n- Exportar/Importar datos\n- Funciona sin conexión`);
}
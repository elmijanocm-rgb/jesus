// Array para almacenar las cajas creadas por el usuario
let userCreatedBoxes = [];

// Función para guardar las cajas creadas por el usuario en localStorage
function saveUserBoxes() {
    localStorage.setItem('userCreatedBoxes', JSON.stringify(userCreatedBoxes));
}

// Función para cargar las cajas creadas por el usuario desde localStorage
function loadUserBoxes() {
    const saved = localStorage.getItem('userCreatedBoxes');
    if (saved) {
        userCreatedBoxes = JSON.parse(saved);
    }
}

// Cargar las cajas al iniciar
loadUserBoxes();

// Agregar una caja de prueba si no hay cajas (solo para demostración)
if (userCreatedBoxes.length === 0) {
    userCreatedBoxes.push({
        nombre: "Caja de Prueba",
        tipo: "Ejemplo",
        descripcion: "Esta es una caja de prueba",
        pesoTara: "1.0",
        color: "#4CAF50",
        cantidad: 5
    });
    saveUserBoxes();
}

// Función para actualizar el total de cajas
function updateTotalBoxes() {
    let total = 0;
    
    // Solo contar las cantidades de las cajas creadas por el usuario
    userCreatedBoxes.forEach(box => {
        total += parseInt(box.cantidad) || 0;
    });
    
    const totalElement = document.getElementById('total-cajas');
    if (totalElement) {
        totalElement.textContent = total;
    }
    
    // Remover el elemento de total de palets si existe
    const paletElement = document.getElementById('total-palets');
    if (paletElement) {
        paletElement.parentElement.remove();
    }
}

// Función para actualizar el estado del bloque
function updateBloqueEstado() {
    const bloqueEstadoElement = document.getElementById('bloque-estado');
    if (!bloqueEstadoElement) return;
    
    const filasEnBloqueActual = historialConteos.length % 4;
    const bloqueNumero = Math.floor(historialConteos.length / 4) + 1;
    bloqueEstadoElement.textContent = `Bloque ${bloqueNumero}: ${filasEnBloqueActual}/4 filas`;
}

// Función para actualizar la pantalla de inicio
function updateHomeScreen() {
    updateTotalBoxes();
    displayUserBoxesInAdmin();
    displayUserBoxesInHome();
    updateBloqueEstado();
}

// Función para mostrar las cajas creadas por el usuario en la sección de administración
function displayUserBoxesInAdmin() {
    const adminSection = document.getElementById('administrar');
    if (!adminSection) return;
    
    // Buscar o crear el contenedor de cajas de usuario
    let userBoxesContainer = adminSection.querySelector('.user-boxes-container');
    if (!userBoxesContainer) {
        // Crear el contenedor si no existe
        userBoxesContainer = document.createElement('div');
        userBoxesContainer.className = 'user-boxes-container';
        adminSection.appendChild(userBoxesContainer);
    }
    
    // Limpiar contenido existente
    userBoxesContainer.innerHTML = '';
    

    
    // Si no hay cajas creadas por el usuario, mostrar mensaje
    if (userCreatedBoxes.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'admin-empty-message';
        emptyMessage.innerHTML = '<p>No hay cajas personalizadas creadas.</p>';
        userBoxesContainer.appendChild(emptyMessage);
        return;
    }
    
    // Mostrar cada caja creada por el usuario
    userCreatedBoxes.forEach((box, index) => {
        const boxElement = document.createElement('div');
        boxElement.className = 'box-detail';
        boxElement.setAttribute('data-box-name', box.nombre);
        boxElement.setAttribute('data-box-index', index);
        
        let imageContent = '';
        if (box.imagen) {
            imageContent = `<img src="${box.imagen}" alt="${box.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else if (box.color) {
            imageContent = `<div style="width: 100%; height: 100%; background-color: ${box.color};"></div>`;
        } else {
            imageContent = `<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">Sin imagen</div>`;
        }
        
        boxElement.innerHTML = `
            <div class="box-list-item">
                <div class="box-mini-image">
                    ${imageContent}
                </div>
                <div class="box-info">
                    <h3>${box.nombre}</h3>
                    <p class="box-type">${box.tipo || 'Sin tipo'}</p>
                </div>
                <div class="box-actions">
                    <button class="btn position-btn move-up-btn" title="Mover arriba" data-box-name="${box.nombre}">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn position-btn move-down-btn" title="Mover abajo" data-box-name="${box.nombre}">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn secondary-btn edit-box-btn" title="Editar caja" data-box-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn danger-btn delete-box-btn" title="Eliminar caja" data-box-index="${index}" data-box-name="${box.nombre}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        userBoxesContainer.appendChild(boxElement);
        
        // Agregar event listener al botón de editar
        const editBtn = boxElement.querySelector('.edit-box-btn');
        editBtn.addEventListener('click', function() {
            const boxIndex = parseInt(this.getAttribute('data-box-index'));
            const boxToEdit = userCreatedBoxes[boxIndex];
            if (boxToEdit) {
                editUserBox(boxToEdit);
            }
        });
        
        // Agregar event listener al botón de eliminar
        const deleteBtn = boxElement.querySelector('.delete-box-btn');
        deleteBtn.addEventListener('click', function() {
            const boxName = this.getAttribute('data-box-name');
            const boxIndex = parseInt(this.getAttribute('data-box-index'));
            
            if (confirm(`¿Estás seguro de que quieres eliminar la caja "${boxName}"? Esta acción no se puede deshacer.`)) {
                userCreatedBoxes.splice(boxIndex, 1);
                saveUserBoxes();
                displayUserBoxesInAdmin();
                displayUserBoxesInHome();
                updateTotalBoxes();
                alert('Caja eliminada exitosamente');
            }
        });
        
        // Event listeners para los botones de mover separados
        const moveUpBtn = boxElement.querySelector('.move-up-btn');
        const moveDownBtn = boxElement.querySelector('.move-down-btn');
        
        console.log('Buscando botón .move-up-btn:', moveUpBtn);
        console.log('Buscando botón .move-down-btn:', moveDownBtn);
        
        if (moveUpBtn) {
            console.log('Botón mover arriba encontrado, agregando event listener');
            moveUpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('=== CLIC EN MOVER ARRIBA ===');
                const boxName = this.getAttribute('data-box-name');
                console.log('Nombre de caja obtenido:', boxName);
                console.log('Llamando moveBoxUp con:', boxName);
                moveBoxUp(boxName);
            });
        } else {
            console.error('ERROR: No se encontró el botón .move-up-btn');
        }
        
        if (moveDownBtn) {
            console.log('Botón mover abajo encontrado, agregando event listener');
            moveDownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('=== CLIC EN MOVER ABAJO ===');
                const boxName = this.getAttribute('data-box-name');
                console.log('Nombre de caja obtenido:', boxName);
                console.log('Llamando moveBoxDown con:', boxName);
                moveBoxDown(boxName);
            });
        } else {
            console.error('ERROR: No se encontró el botón .move-down-btn');
        }
    });
    
    // Los botones ahora usan onclick directo - más simple y confiable
}

// Función para editar una caja creada por el usuario
function editUserBox(box) {
    // Encontrar el elemento de la caja
    const boxElement = document.querySelector(`[data-box-name="${box.nombre}"]`);
    if (!boxElement) return;
    
    // Verificar si ya hay un editor abierto en esta caja
    let existingEditor = boxElement.querySelector('.box-editor');
    if (existingEditor) {
        existingEditor.remove();
        return;
    }
    
    // Cerrar cualquier otro editor abierto
    document.querySelectorAll('.box-editor').forEach(editor => editor.remove());
    
    let selectedImage = box.imagen || null;
    let selectedColor = box.color || null;
    
    // Crear el editor desplegable
    const editor = document.createElement('div');
    editor.className = 'box-editor';
    editor.innerHTML = `
        <div class="editor-content">
            <div class="editor-header">
                <h4>Editar Caja</h4>
                <button class="close-editor">&times;</button>
            </div>
            <div class="editor-body">
                <div class="form-group">
                    <label>Nombre:</label>
                    <input type="text" class="edit-name-input" value="${box.nombre}" required>
                </div>
                <div class="form-group">
                    <label>Tipo de caja:</label>
                    <input type="text" class="edit-type-input" value="${box.tipo || ''}" placeholder="Ej: Juego, Película, Libro...">
                </div>
                <div class="form-group">
                    <label>Imagen/Color:</label>
                    <div class="current-preview">
                        ${box.imagen ? `<img src="${box.imagen}" alt="${box.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px;">` : 
                          box.color ? `<div style="width: 40px; height: 40px; background-color: ${box.color}; border-radius: 3px;"></div>` :
                          '<div style="width: 40px; height: 40px; background-color: #f0f0f0; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666;">Sin</div>'}
                    </div>
                </div>
                <div class="form-group">
                    <label>Subir imagen:</label>
                    <input type="file" class="image-upload" accept="image/*">
                </div>
                <div class="form-group">
                    <label>O seleccionar color:</label>
                    <div class="color-options">
                        <div class="color-option" style="background-color: #4CAF50;" data-color="#4CAF50"></div>
                        <div class="color-option" style="background-color: #F44336;" data-color="#F44336"></div>
                        <div class="color-option" style="background-color: #2196F3;" data-color="#2196F3"></div>
                        <div class="color-option" style="background-color: #FF9800;" data-color="#FF9800"></div>
                        <div class="color-option" style="background-color: #9C27B0;" data-color="#9C27B0"></div>
                        <div class="color-option" style="background-color: #607D8B;" data-color="#607D8B"></div>
                    </div>
                </div>
            </div>
            <div class="editor-actions">
                <button class="btn-small primary-btn save-changes">Guardar</button>
                <button class="btn-small danger-btn delete-box">Eliminar</button>
                <button class="btn-small secondary-btn cancel-edit">Cancelar</button>
            </div>
        </div>
    `;
    
    // Insertar el editor después del elemento de lista de la caja
    const boxListItem = boxElement.querySelector('.box-list-item');
    boxListItem.insertAdjacentElement('afterend', editor);
    
    // Event listeners
    const closeEditor = () => {
        editor.remove();
    };
    
    editor.querySelector('.close-editor').addEventListener('click', closeEditor);
    editor.querySelector('.cancel-edit').addEventListener('click', closeEditor);
    
    // Subir imagen
    editor.querySelector('.image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                selectedImage = e.target.result;
                selectedColor = null;
                
                // Actualizar preview
                const preview = editor.querySelector('.current-preview');
                preview.innerHTML = `<img src="${selectedImage}" alt="Preview" style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Seleccionar color
    editor.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            selectedColor = this.getAttribute('data-color');
            selectedImage = null;
            
            // Actualizar preview
            const preview = editor.querySelector('.current-preview');
            preview.innerHTML = `<div style="width: 40px; height: 40px; background-color: ${selectedColor}; border-radius: 3px;"></div>`;
            
            // Marcar como seleccionado
            editor.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Guardar cambios
    editor.querySelector('.save-changes').addEventListener('click', function() {
        const newName = editor.querySelector('.edit-name-input').value.trim();
        const newType = editor.querySelector('.edit-type-input').value.trim();
        
        if (!newName) {
            alert('Por favor, ingresa un nombre para la caja.');
            return;
        }
        
        // Verificar que el nuevo nombre no exista ya (excepto si es el mismo)
        const existingBox = userCreatedBoxes.find(b => b.nombre.toLowerCase() === newName.toLowerCase() && b !== box);
        if (existingBox) {
            alert('Ya existe una caja con ese nombre. Por favor, elige otro nombre.');
            return;
        }
        
        // Actualizar la caja
        const boxIndex = userCreatedBoxes.findIndex(b => b.nombre === box.nombre);
        if (boxIndex !== -1) {
            userCreatedBoxes[boxIndex].nombre = newName;
            userCreatedBoxes[boxIndex].tipo = newType;
            userCreatedBoxes[boxIndex].imagen = selectedImage;
            userCreatedBoxes[boxIndex].color = selectedColor;
            
            saveUserBoxes();
            displayUserBoxesInAdmin();
            displayUserBoxesInHome();
            updateTotalBoxes();
        }
        
        closeEditor();
    });
    
    // Eliminar caja
    editor.querySelector('.delete-box').addEventListener('click', function() {
        if (confirm(`¿Estás seguro de que quieres eliminar la caja "${box.nombre}"? Esta acción no se puede deshacer.`)) {
            const boxIndex = userCreatedBoxes.findIndex(b => b.nombre === box.nombre);
            
            if (boxIndex !== -1) {
                userCreatedBoxes.splice(boxIndex, 1);
                saveUserBoxes();
                displayUserBoxesInAdmin();
                displayUserBoxesInHome();
                updateTotalBoxes();
                alert('Caja eliminada exitosamente');
            }
            
            closeEditor();
        }
    });
}

// Función para eliminar una caja creada por el usuario
function deleteUserBox(box) {
    if (confirm(`¿Estás seguro de que quieres eliminar la caja "${box.nombre}"?`)) {
        const boxIndex = userCreatedBoxes.findIndex(b => b.nombre === box.nombre);
        
        if (boxIndex !== -1) {
            userCreatedBoxes.splice(boxIndex, 1);
            saveUserBoxes();
            displayUserBoxesInAdmin();
            displayUserBoxesInHome();
            updateTotalBoxes();
            alert('Caja eliminada exitosamente');
        }
    }
}

// Función ULTRA SIMPLE para eliminar caja - GARANTIZADA
function eliminarCaja(nombreCaja) {
    console.log('eliminarCaja llamada con:', nombreCaja);
    console.log('Cajas antes:', userCreatedBoxes.length);
    
    if (confirm('¿Eliminar la caja "' + nombreCaja + '"?')) {
        // Buscar y eliminar la caja
        for (let i = 0; i < userCreatedBoxes.length; i++) {
            if (userCreatedBoxes[i].nombre === nombreCaja) {
                console.log('Caja encontrada en índice:', i);
                userCreatedBoxes.splice(i, 1);
                break;
            }
        }
        
        console.log('Cajas después:', userCreatedBoxes.length);
        
        // Guardar y actualizar
        localStorage.setItem('userCreatedBoxes', JSON.stringify(userCreatedBoxes));
        displayUserBoxesInAdmin();
        displayUserBoxesInHome();
        updateTotalBoxes();
        
        alert('¡Caja eliminada!');
    }
}

// Función para borrar TODAS las cajas creadas
function borrarTodasLasCajas() {
    if (confirm('¿Estás seguro de que quieres BORRAR TODAS las cajas creadas? Esta acción no se puede deshacer.')) {
        userCreatedBoxes = [];
        localStorage.setItem('userCreatedBoxes', JSON.stringify(userCreatedBoxes));
        displayUserBoxesInAdmin();
        displayUserBoxesInHome();
        updateTotalBoxes();
        alert('¡Todas las cajas han sido eliminadas!');
    }
}

// Función para mostrar las cajas creadas por el usuario en la pantalla de inicio
function displayUserBoxesInHome() {
    const boxTypesContainer = document.querySelector('.box-types');
    if (!boxTypesContainer) return;
    
    // Inicializar posiciones si no existen
    initializeBoxPositions();
    
    // Eliminar cajas de usuario existentes para evitar duplicados
    const existingUserBoxes = boxTypesContainer.querySelectorAll('.user-created-box-type');
    existingUserBoxes.forEach(box => box.remove());
    
    // Eliminar mensaje de "no hay cajas" si existe
    const existingMessage = boxTypesContainer.querySelector('.no-boxes-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Si no hay cajas creadas por el usuario, mostrar mensaje
    if (userCreatedBoxes.length === 0) {
        const messageElement = document.createElement('div');
        messageElement.className = 'no-boxes-message';
        messageElement.style.cssText = 'text-align: center; padding: 40px; color: #666; font-size: 16px;';
        messageElement.innerHTML = '<p>No hay cajas personalizadas creadas.</p><p>Ve a la sección "Crear Caja" para crear tus propias cajas.</p>';
        boxTypesContainer.appendChild(messageElement);
        return;
    }
    
    // Ordenar cajas por posición antes de mostrarlas
    const sortedBoxes = [...userCreatedBoxes].sort((a, b) => (a.position || 0) - (b.position || 0));
    
    // Agregar cada caja creada por el usuario
    sortedBoxes.forEach(box => {
        const boxTypeElement = document.createElement('div');
        boxTypeElement.className = 'box-type user-created-box-type';
        
        let imageContent = '';
        if (box.imagen) {
            imageContent = `<div class="box-image" style="background-image: url('${box.imagen}'); background-size: cover; background-position: center;"></div>`;
        } else if (box.color) {
            imageContent = `<div class="box-image" style="background-color: ${box.color};"></div>`;
        } else {
            imageContent = `<div class="box-image" style="background-color: #f0f0f0;"></div>`;
        }
        
        boxTypeElement.innerHTML = `
            <div class="box-image-container">
                ${imageContent}
                <div class="box-total-overlay">${box.cantidad || 0}</div>
            </div>
            <div class="box-info">
                <span class="box-name">${box.nombre}</span>
                <span class="box-code">${box.tipo || 'Sin tipo'}</span>
            </div>
            <div class="box-controls">
                <button class="btn primary-btn count-btn">Conteo: <span class="box-count">${box.cantidad || 0}</span></button>
            </div>

        `;
        
        boxTypesContainer.appendChild(boxTypeElement);
        
        // Agregar event listener para el botón de conteo
        const countBtn = boxTypeElement.querySelector('.count-btn');
        const counterValue = boxTypeElement.querySelector('.box-count');
        const totalOverlay = boxTypeElement.querySelector('.box-total-overlay');
        
        countBtn.addEventListener('click', function() {
            const currentValue = parseInt(counterValue.textContent);
            showNumericKeypad(box.nombre, currentValue, function(newValue) {
                if (newValue !== null && !isNaN(newValue) && parseInt(newValue) >= 0) {
                    const finalValue = parseInt(newValue);
                    counterValue.textContent = finalValue;
                    totalOverlay.textContent = finalValue; // Actualizar el total superpuesto
                    
                    // Actualizar en el array
                    const boxIndex = userCreatedBoxes.findIndex(b => b.nombre === box.nombre);
                    if (boxIndex !== -1) {
                        userCreatedBoxes[boxIndex].cantidad = finalValue;
                        saveUserBoxes();
                    }
                    updateTotalBoxes();
                }
            });
        });
        

    });
}

// Función para la navegación
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(nav => {
        nav.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Remover clase activa de TODOS los elementos de navegación en TODAS las páginas
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Agregar clase activa a TODOS los elementos con el mismo data-page
            document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(navItem => {
                navItem.classList.add('active');
            });
            
            // Ocultar todas las páginas
            pages.forEach(page => page.classList.remove('active'));
            
            // Mostrar la página objetivo
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
                
                // Si es la página de administración, actualizar la visualización
                if (targetPage === 'administrar') {
                    displayUserBoxesInAdmin();
                }
            }
        });
    });
}

// Función para calcular el total de cajas
function calculateTotalBoxes() {
    const defaultBoxes = 6;
    const userBoxes = userCreatedBoxes.length;
    return defaultBoxes + userBoxes;
}

// Función simulada para exportar PDF
function exportToPDF() {
    alert('Funcionalidad de exportación a PDF - En desarrollo');
}

// Función para archivar y limpiar
function archiveAndClean() {
    if (confirm('¿Estás seguro de que deseas archivar y limpiar los conteos actuales?')) {
        // Aquí iría la lógica para archivar
        alert('Conteos archivados y limpiados correctamente.');
    }
}

// Función para inicializar posiciones en cajas existentes
function initializeBoxPositions() {
    console.log('initializeBoxPositions ejecutándose');
    console.log('Cajas antes de inicializar:', userCreatedBoxes.map(box => ({nombre: box.nombre, position: box.position})));
    
    let hasChanges = false;
    userCreatedBoxes.forEach((box, index) => {
        if (box.position === undefined) {
            box.position = index;
            hasChanges = true;
            console.log(`Asignando posición ${index} a caja ${box.nombre}`);
        }
    });
    
    if (hasChanges) {
        saveUserBoxes();
        console.log('Posiciones guardadas');
    }
    
    console.log('Cajas después de inicializar:', userCreatedBoxes.map(box => ({nombre: box.nombre, position: box.position})));
}

// Función para agregar nueva caja
function addNewBox() {
    const boxName = prompt('Ingresa el nombre de la nueva caja:');
    if (boxName && boxName.trim() !== '') {
        const newBox = {
            nombre: boxName.trim(),
            cantidad: 0,
            imagen: null,
            color: '#f0f0f0',
            position: userCreatedBoxes.length
        };
        
        userCreatedBoxes.push(newBox);
        saveUserBoxes();
        updateHomeScreen();
        displayUserBoxesInHome();
        displayUserBoxesInAdmin();
        
        alert('Caja agregada correctamente.');
    }
}

// Función para mover una caja hacia arriba en la posición
function moveBoxUp(boxName) {
    console.log('moveBoxUp llamada con:', boxName);
    const boxIndex = userCreatedBoxes.findIndex(box => box.nombre === boxName);
    if (boxIndex === -1) {
        console.log('Caja no encontrada');
        return;
    }
    
    const currentBox = userCreatedBoxes[boxIndex];
    const currentPosition = currentBox.position || 0;
    console.log('Posición actual:', currentPosition);
    
    // Si ya está en la primera posición, no se puede mover más arriba
    if (currentPosition === 0) {
        console.log('Ya está en la primera posición');
        return;
    }
    
    // Buscar la caja que está inmediatamente arriba
    const boxAbove = userCreatedBoxes.find(box => 
        box.nombre !== boxName && (box.position || 0) === currentPosition - 1
    );
    
    console.log('Caja arriba encontrada:', boxAbove ? boxAbove.nombre : 'ninguna');
    
    if (boxAbove) {
        // Intercambiar posiciones
        boxAbove.position = currentPosition;
        currentBox.position = currentPosition - 1;
        
        console.log('Posiciones intercambiadas');
        saveUserBoxes();
        displayUserBoxesInHome();
        displayUserBoxesInAdmin();
    }
}

// Función para mover una caja hacia abajo en la posición
function moveBoxDown(boxName) {
    console.log('moveBoxDown llamada con:', boxName);
    const boxIndex = userCreatedBoxes.findIndex(box => box.nombre === boxName);
    if (boxIndex === -1) {
        console.log('Caja no encontrada');
        return;
    }
    
    const currentBox = userCreatedBoxes[boxIndex];
    const currentPosition = currentBox.position || 0;
    console.log('Posición actual:', currentPosition);
    
    // Verificar si ya está en la última posición
    const maxPosition = userCreatedBoxes.length - 1;
    if (currentPosition >= maxPosition) {
        console.log('Ya está en la última posición');
        return;
    }
    
    // Buscar la caja que está inmediatamente abajo
    const boxBelow = userCreatedBoxes.find(box => 
        box.nombre !== boxName && (box.position || 0) === currentPosition + 1
    );
    
    console.log('Caja abajo encontrada:', boxBelow ? boxBelow.nombre : 'ninguna');
    
    if (boxBelow) {
        // Intercambiar posiciones
        boxBelow.position = currentPosition;
        currentBox.position = currentPosition + 1;
        
        console.log('Posiciones intercambiadas');
        saveUserBoxes();
        displayUserBoxesInHome();
        displayUserBoxesInAdmin();
    }
}

// Event listener para el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    setupNavigation();
    
    // Cargar y mostrar historial
    loadHistorialConteos();
    
    // Mostrar cajas existentes
    displayUserBoxesInAdmin();
    displayUserBoxesInHome();
    
    // Configurar botón de agregar contenedor
    const agregarContenedorBtn = document.getElementById('agregar-contenedor-btn');
    const nuevoContenedorForm = document.getElementById('nuevo-contenedor-form');
    const cancelarContenedorBtn = document.getElementById('cancelar-contenedor');
    const guardarContenedorBtn = document.getElementById('guardar-contenedor');
    
    if (agregarContenedorBtn && nuevoContenedorForm) {
        agregarContenedorBtn.addEventListener('click', function() {
            nuevoContenedorForm.style.display = 'block';
        });
    }
    
    if (cancelarContenedorBtn && nuevoContenedorForm) {
        cancelarContenedorBtn.addEventListener('click', function() {
            nuevoContenedorForm.style.display = 'none';
            // Limpiar formulario
            document.getElementById('nombre-contenedor').value = '';
            document.getElementById('color-contenedor').value = 'green-box';
            document.getElementById('imagen-contenedor').value = '';
            document.getElementById('use-color').checked = true;
            document.getElementById('use-image').checked = false;
            document.getElementById('imagen-contenedor').disabled = true;
        });
    }
    
    if (guardarContenedorBtn) {
        guardarContenedorBtn.addEventListener('click', function() {
            const nombre = document.getElementById('nombre-contenedor').value.trim();
            const tipo = document.getElementById('tipo-contenedor').value.trim();
            const useImage = document.getElementById('use-image').checked;
            const imageFile = document.getElementById('imagen-contenedor').files[0];
            const colorValue = document.getElementById('color-contenedor').value;
            
            if (!nombre) {
                alert('Por favor ingresa un nombre para el contenedor.');
                return;
            }
            
            const newBox = {
                nombre: nombre,
                tipo: tipo,
                cantidad: 0,
                imagen: null,
                color: null
            };
            
            if (useImage && imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    newBox.imagen = e.target.result;
                    userCreatedBoxes.push(newBox);
                    saveUserBoxes();
                    displayUserBoxesInAdmin();
                    displayUserBoxesInHome();
                    updateTotalBoxes();
                    
                    // Ocultar formulario y limpiar
                    nuevoContenedorForm.style.display = 'none';
                    document.getElementById('nombre-contenedor').value = '';
                    document.getElementById('tipo-contenedor').value = '';
                    document.getElementById('color-contenedor').value = 'green-box';
                    document.getElementById('imagen-contenedor').value = '';
                    document.getElementById('use-color').checked = true;
                    document.getElementById('use-image').checked = false;
                    document.getElementById('imagen-contenedor').disabled = true;
                    
                    alert('Contenedor creado exitosamente!');
                };
                reader.readAsDataURL(imageFile);
            } else {
                // Usar color predeterminado
                const colorMap = {
                    'green-box': '#4CAF50',
                    'green-small-box': '#8BC34A',
                    'red-box': '#F44336',
                    'red-small-box': '#FF5722',
                    'blue-box': '#2196F3',
                    'ifco-box': '#9E9E9E'
                };
                
                newBox.color = colorMap[colorValue] || '#4CAF50';
                userCreatedBoxes.push(newBox);
                saveUserBoxes();
                displayUserBoxesInAdmin();
                displayUserBoxesInHome();
                updateTotalBoxes();
                
                // Ocultar formulario y limpiar
                nuevoContenedorForm.style.display = 'none';
                document.getElementById('nombre-contenedor').value = '';
                document.getElementById('tipo-contenedor').value = '';
                document.getElementById('color-contenedor').value = 'green-box';
                document.getElementById('imagen-contenedor').value = '';
                document.getElementById('use-color').checked = true;
                document.getElementById('use-image').checked = false;
                document.getElementById('imagen-contenedor').disabled = true;
                
                alert('Contenedor creado exitosamente!');
            }
        });
    }
    
    // Configurar radio buttons para tipo de imagen
    const useColorRadio = document.getElementById('use-color');
    const useImageRadio = document.getElementById('use-image');
    const imageInput = document.getElementById('imagen-contenedor');
    
    if (useColorRadio && useImageRadio && imageInput) {
        useColorRadio.addEventListener('change', function() {
            if (this.checked) {
                imageInput.disabled = true;
            }
        });
        
        useImageRadio.addEventListener('change', function() {
            if (this.checked) {
                imageInput.disabled = false;
            }
        });
    }
    
    // Configurar botón de agregar nueva caja
    const addBoxBtn = document.getElementById('add-box-btn');
    if (addBoxBtn) {
        addBoxBtn.addEventListener('click', addNewBox);
    }
    
    // Configurar botón de exportar PDF
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToPDF);
    }
    
    // Configurar botón de archivar y limpiar
    const archivarLimpiarBtn = document.getElementById('archivar-limpiar-btn');
    if (archivarLimpiarBtn) {
        archivarLimpiarBtn.addEventListener('click', archivarYLimpiarHistorial);
    }
    
    // Event listeners para los botones de exportar a PDF
    const exportarHistorialBtn = document.getElementById('exportar-historial-pdf-btn');
    const exportarRegistrosBtn = document.getElementById('exportar-registros-pdf-btn');
    
    if (exportarHistorialBtn) {
        exportarHistorialBtn.addEventListener('click', exportarHistorialPDF);
    }
    
    if (exportarRegistrosBtn) {
        exportarRegistrosBtn.addEventListener('click', exportarRegistrosPDF);
    }
    
    // Configurar botón de agregar conteo
    const agregarConteoBtn = document.getElementById('agregar-conteo-btn');
    if (agregarConteoBtn) {
        agregarConteoBtn.addEventListener('click', agregarConteoAlHistorial);
    }
    
    // Actualizar total de cajas al cargar
    updateTotalBoxes();
    
    // Cargar historial de conteos
    loadHistorialConteos();
    
    // Cargar registros archivados
    loadRegistrosArchivados();
    
    // Funcionalidad para cambiar imagen de caja
    function initializeImageChangeButtons() {
        const imageButtons = document.querySelectorAll('.btn.secondary-btn');
        
        imageButtons.forEach(button => {
            if (button.querySelector('.fa-image')) {
                button.addEventListener('click', function() {
                    const boxDetail = this.closest('.box-detail');
                    const boxName = boxDetail.querySelector('.box-header h3').textContent;
                    
                    // Crear modal para selección de imagen
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.innerHTML = `
                        <div class="modal-content">
                            <h3>Cambiar imagen de ${boxName}</h3>
                            <div class="image-options">
                                <div class="option">
                                    <label>Subir imagen:</label>
                                    <input type="file" accept="image/*" class="image-upload">
                                </div>
                                <div class="option">
                                    <label>Seleccionar color:</label>
                                    <div class="color-options">
                                        <div class="color-option" style="background-color: #ff6b6b;" data-color="#ff6b6b"></div>
                                        <div class="color-option" style="background-color: #4ecdc4;" data-color="#4ecdc4"></div>
                                        <div class="color-option" style="background-color: #45b7d1;" data-color="#45b7d1"></div>
                                        <div class="color-option" style="background-color: #96ceb4;" data-color="#96ceb4"></div>
                                        <div class="color-option" style="background-color: #feca57;" data-color="#feca57"></div>
                                        <div class="color-option" style="background-color: #ff9ff3;" data-color="#ff9ff3"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-actions">
                                <button class="btn secondary-btn modal-cancel">Cancelar</button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    // Event listener para subir imagen
                    const fileInput = modal.querySelector('.image-upload');
                    fileInput.addEventListener('change', function(e) {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const imageData = e.target.result;
                                
                                // Actualizar la caja en el array
                                const boxIndex = userCreatedBoxes.findIndex(box => box.nombre === boxName);
                                if (boxIndex !== -1) {
                                    userCreatedBoxes[boxIndex].imagen = imageData;
                                    userCreatedBoxes[boxIndex].color = null;
                                    saveUserBoxes();
                                }
                                
                                // Actualizar la visualización
                                const imageContainer = boxDetail.querySelector('.box-image-container');
                                imageContainer.innerHTML = `<img src="${imageData}" alt="${boxName}" style="width: 100%; height: 100%; object-fit: cover;">`;
                                
                                document.body.removeChild(modal);
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                    
                    // Event listeners para opciones de color
                    const colorOptions = modal.querySelectorAll('.color-option');
                    colorOptions.forEach(option => {
                        option.addEventListener('click', function() {
                            const selectedColor = this.getAttribute('data-color');
                            
                            // Actualizar la caja en el array
                            const boxIndex = userCreatedBoxes.findIndex(box => box.nombre === boxName);
                            if (boxIndex !== -1) {
                                userCreatedBoxes[boxIndex].color = selectedColor;
                                userCreatedBoxes[boxIndex].imagen = null;
                                saveUserBoxes();
                            }
                            
                            // Actualizar la visualización
                            const imageContainer = boxDetail.querySelector('.box-image-container');
                            imageContainer.innerHTML = `<div style="width: 100%; height: 100%; background-color: ${selectedColor};"></div>`;
                            
                            document.body.removeChild(modal);
                        });
                    });
                    
                    // Event listener para cancelar
                    const cancelButton = modal.querySelector('.modal-cancel');
                    cancelButton.addEventListener('click', function() {
                        document.body.removeChild(modal);
                    });
                });
            }
        });
    }
    
    // Funcionalidad para eliminar caja
    function initializeDeleteButtons() {
        const deleteBoxButtons = document.querySelectorAll('.btn.danger-btn');
        
        deleteBoxButtons.forEach(button => {
            if (button.querySelector('.fa-trash')) {
                button.addEventListener('click', function() {
                    if (confirm('¿Estás seguro de que deseas eliminar esta caja?')) {
                        const boxDetail = this.closest('.box-detail');
                        const boxName = boxDetail.querySelector('.box-header h3').textContent;
                        
                        // Eliminar la caja del array
                        userCreatedBoxes = userCreatedBoxes.filter(box => box.nombre !== boxName);
                        saveUserBoxes();
                        
                        boxDetail.remove();
                        displayUserBoxesInHome();
                        updateTotalBoxes();
                        
                        alert('Caja eliminada correctamente.');
                    }
                });
            }
        });
    }
    
    // Inicializar el total de cajas
    updateTotalBoxes();
    
    // Inicializar funcionalidades
    initializeImageChangeButtons();
    initializeDeleteButtons();
});

// Array para almacenar el historial de conteos
let historialConteos = [];

// Función para cargar el historial desde localStorage
function loadHistorialConteos() {
    const saved = localStorage.getItem('historialConteos');
    if (saved) {
        historialConteos = JSON.parse(saved);
    }
    // Asegurar que los encabezados se inicialicen correctamente
    updateHistorialHeaders();
    displayHistorialConteos();
}

// Función para guardar el historial en localStorage
function saveHistorialConteos() {
    localStorage.setItem('historialConteos', JSON.stringify(historialConteos));
}

// Función para agregar el conteo actual al historial
function agregarConteoAlHistorial() {
    if (userCreatedBoxes.length === 0) {
        alert('No hay cajas creadas para agregar al conteo.');
        return;
    }
    
    // Verificar si hay cantidades para contar
    const totalCantidad = userCreatedBoxes.reduce((total, box) => total + (box.cantidad || 0), 0);
    if (totalCantidad === 0) {
        alert('No hay cantidades para agregar al historial.');
        return;
    }
    

    
    // Calcular total solo de cajas normales (excluyendo palets)
    const cajasNormales = userCreatedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    const totalCajasNormales = cajasNormales.reduce((total, box) => total + (box.cantidad || 0), 0);
    
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
        total: totalCajasNormales
    };
    
    // Agregar las cantidades de cada caja
    userCreatedBoxes.forEach(box => {
        if (box.cantidad && box.cantidad > 0) {
            nuevoConteo.cajas[box.nombre] = box.cantidad;
        }
    });
    
    // Agregar al historial
    historialConteos.push(nuevoConteo); // Agregar al final para que slice(-n) tome los más recientes
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
    
    alert('Conteo agregado al historial y cantidades reseteadas.');
}

// Función para mostrar las cajas individuales con totales
function displayIndividualBoxesTotals() {
    const container = document.getElementById('individual-boxes-display');
    if (!container) return;
    
    // Limpiar contenido existente
    container.innerHTML = '';
    
    if (historialConteos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; margin: 0;">No hay conteos para mostrar</p>';
        return;
    }
    
    // Calcular totales por caja de todo el historial
    const totalesPorCaja = {};
    
    // Inicializar totales
    userCreatedBoxes.forEach(box => {
        totalesPorCaja[box.nombre] = 0;
    });
    
    // Sumar todas las cantidades del historial
    historialConteos.forEach(conteo => {
        if (conteo.cajas) {
            Object.keys(conteo.cajas).forEach(nombreCaja => {
                if (totalesPorCaja.hasOwnProperty(nombreCaja)) {
                    totalesPorCaja[nombreCaja] += conteo.cajas[nombreCaja] || 0;
                }
            });
        }
    });
    
    // Crear elementos para cada caja
    userCreatedBoxes.forEach(box => {
        const total = totalesPorCaja[box.nombre] || 0;
        
        const boxItem = document.createElement('div');
        boxItem.className = 'individual-box-item';
        
        // Crear imagen de la caja
        const boxImage = document.createElement('div');
        boxImage.className = 'individual-box-image';
        
        if (box.imagen) {
            boxImage.style.backgroundImage = `url('${box.imagen}')`;
        } else if (box.color) {
            boxImage.style.backgroundColor = box.color;
        } else {
            boxImage.style.backgroundColor = '#f0f0f0';
        }
        
        // Crear elemento del total
        const boxTotal = document.createElement('div');
        boxTotal.className = 'individual-box-total';
        boxTotal.textContent = total;
        
        boxItem.appendChild(boxImage);
        boxItem.appendChild(boxTotal);
        container.appendChild(boxItem);
    });
}

// Función para mostrar el historial de conteos
function displayHistorialConteos() {
    const tbody = document.querySelector('#conteos .data-table tbody');
    if (!tbody) return;
    
    // Limpiar contenido existente
    tbody.innerHTML = '';
    
    // Mostrar cajas individuales con totales
    displayIndividualBoxesTotals();
    
    if (historialConteos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No hay conteos guardados</td></tr>';
        return;
    }
    
    // Ordenar cajas por posición antes de crear el orden de columnas
    const sortedBoxes = [...userCreatedBoxes].sort((a, b) => (a.position || 0) - (b.position || 0));
    
    // Crear orden dinámico basado en las cajas existentes ordenadas por posición
    // Primero los palets, luego las cajas normales
    const cajasPalet = sortedBoxes.filter(box => box.nombre.toLowerCase().includes('palet'));
    const cajasNormales = sortedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    
    const ordenColumnasData = [
        ...cajasPalet.map(box => box.nombre),
        ...cajasNormales.map(box => box.nombre)
    ];
    
    const cajasNormalesArray = cajasNormales.map(box => box.nombre);
    const cajasPaletArray = cajasPalet.map(box => box.nombre);
    
    // Variables para total general
    let totalesPorCaja = {};
    let totalGeneral = 0;
    let totalesPalets = {};
    
    // Inicializar totales usando el orden específico
    ordenColumnasData.forEach(nombreCaja => {
        if (nombreCaja.toLowerCase().includes('palet')) {
            totalesPalets[nombreCaja] = 0;
        } else {
            totalesPorCaja[nombreCaja] = 0;
        }
    });
    
    // Definir colores para bloques
    const coloresBloques = ['#e3f2fd', '#e8f5e8', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
    
    // Calcular bloques: cada 4 filas forman un bloque completo
    const totalConteos = historialConteos.length;
    const filasEnBloqueActual = totalConteos % 4;
    const bloquesCompletos = Math.floor(totalConteos / 4);
    
    // PASO 1: MOSTRAR BLOQUE ACTIVO (arriba) - Las cantidades más recientes
    if (filasEnBloqueActual > 0) {
        // Título del bloque activo
        const tituloRow = document.createElement('tr');
        tituloRow.className = 'block-title-row';
        tituloRow.style.backgroundColor = '#2196F3';
        tituloRow.style.color = 'white';
        tituloRow.style.fontWeight = 'bold';
        tituloRow.style.textAlign = 'left';
        
        const tituloCell = document.createElement('td');
        tituloCell.colSpan = ordenColumnasData.length + 3; // +3 para Fecha/Hora, Total y Acciones
        tituloCell.innerHTML = `🔄 BLOQUE ACTIVO (${filasEnBloqueActual}/4 filas)`;
        tituloRow.appendChild(tituloCell);
        tbody.appendChild(tituloRow);
        
        // Obtener las filas más recientes para el bloque activo
        const conteosActuales = historialConteos.slice(-filasEnBloqueActual);
        
        // Variables para subtotales del bloque activo
        let subtotalesBloqueActual = {};
        let subtotalesPaletsBloqueActual = {};
        let subtotalGeneralBloqueActual = 0;
        
        // Inicializar subtotales del bloque activo
        ordenColumnasData.forEach(nombreCaja => {
            if (nombreCaja.toLowerCase().includes('palet')) {
                subtotalesPaletsBloqueActual[nombreCaja] = 0;
            } else {
                subtotalesBloqueActual[nombreCaja] = 0;
            }
        });
        
        // Mostrar filas del bloque activo
        conteosActuales.forEach((conteo, index) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = coloresBloques[0]; // Color azul claro para bloque activo
            
            let cellsHTML = `<td>${conteo.fecha}</td>`;
            
            // Calcular total de cajas normales
            let totalCajasNormales = 0;
            cajasNormalesArray.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                totalCajasNormales += cantidad;
            });
            
            cellsHTML += `<td><strong>${totalCajasNormales}</strong></td>`;
            
            // Calcular índice del conteo una sola vez
            const conteoIndex = historialConteos.length - filasEnBloqueActual + index;
            
            // Agregar celdas en el orden específico
            ordenColumnasData.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                // Hacer las celdas editables en el bloque activo
                cellsHTML += `<td class="editable-cell" data-conteo-index="${conteoIndex}" data-caja-nombre="${nombreCaja}" onclick="editarCantidad(this)">${cantidad}</td>`;
                
                // Acumular en subtotales del bloque activo y totales generales
                if (nombreCaja.toLowerCase().includes('palet')) {
                    subtotalesPaletsBloqueActual[nombreCaja] += cantidad;
                    totalesPalets[nombreCaja] += cantidad;
                } else {
                    subtotalesBloqueActual[nombreCaja] += cantidad;
                    totalesPorCaja[nombreCaja] += cantidad;
                }
            });
            
            subtotalGeneralBloqueActual += totalCajasNormales;
            totalGeneral += totalCajasNormales;
            
            // Agregar botón de eliminación para filas del bloque activo
            cellsHTML += `<td><button class="delete-btn" onclick="window.eliminarConteoSimple(${conteoIndex})" title="Eliminar este conteo">❌</button></td>`;
            
            row.innerHTML = cellsHTML;
            
            // Agregar clase para resaltar si tiene cantidades
            if (totalCajasNormales > 0 || cajasPaletArray.some(nombreCaja => (conteo.cajas && conteo.cajas[nombreCaja]) > 0)) {
                row.classList.add('has-quantities');
            }
            
            // Agregar clase a las celdas de palets
            const paletCells = row.querySelectorAll('td');
            const startPaletIndex = 1 + cajasNormalesArray.length;
            for (let i = 0; i < cajasPaletArray.length; i++) {
                if (paletCells[startPaletIndex + i]) {
                    paletCells[startPaletIndex + i].classList.add('palet-column');
                }
            }
            
            tbody.appendChild(row);
        });
        
        // Subtotal del bloque activo
        const subtotalRow = document.createElement('tr');
        subtotalRow.className = 'subtotal-row';
        subtotalRow.style.backgroundColor = coloresBloques[0];
        subtotalRow.style.fontWeight = 'bold';
        
        let subtotalHTML = '<td><strong>Subtotal Activo</strong></td>';
        subtotalHTML += `<td><strong>${subtotalGeneralBloqueActual}</strong></td>`;
        
        ordenColumnasData.forEach(nombreCaja => {
            if (nombreCaja.toLowerCase().includes('palet')) {
                subtotalHTML += `<td><strong>${subtotalesPaletsBloqueActual[nombreCaja] || 0}</strong></td>`;
            } else {
                subtotalHTML += `<td><strong>${subtotalesBloqueActual[nombreCaja] || 0}</strong></td>`;
            }
        });
        
        // Agregar celda vacía de acciones para subtotal
        subtotalHTML += `<td></td>`;
        
        subtotalRow.innerHTML = subtotalHTML;
        tbody.appendChild(subtotalRow);
        
        // Separador después del bloque activo
        if (bloquesCompletos > 0) {
            const separatorRow = document.createElement('tr');
            separatorRow.style.height = '20px';
            separatorRow.style.backgroundColor = '#e0e0e0';
            
            const separatorCell = document.createElement('td');
            separatorCell.colSpan = ordenColumnasData.length + 3; // +3 para Fecha/Hora, Total y Acciones
            separatorCell.style.textAlign = 'center';
            separatorCell.style.fontWeight = 'bold';
            separatorCell.style.color = '#666';
            separatorCell.innerHTML = '═══ BLOQUES CERRADOS ═══';
            
            separatorRow.appendChild(separatorCell);
            tbody.appendChild(separatorRow);
        }
    }
    
    // PASO 2: MOSTRAR BLOQUES CERRADOS (abajo) - Del más reciente al más antiguo
    for (let bloqueIndex = bloquesCompletos - 1; bloqueIndex >= 0; bloqueIndex--) {
        const numeroBloque = bloquesCompletos - bloqueIndex;
        // Calcular desde el final del array, excluyendo el bloque activo
        const inicioBloque = historialConteos.length - filasEnBloqueActual - (bloqueIndex + 1) * 4;
        const finBloque = inicioBloque + 4;
        const conteosBloque = historialConteos.slice(inicioBloque, finBloque);
        
        // Título del bloque cerrado
        const tituloRow = document.createElement('tr');
        tituloRow.className = 'block-title-row';
        tituloRow.style.backgroundColor = '#4CAF50';
        tituloRow.style.color = 'white';
        tituloRow.style.fontWeight = 'bold';
        tituloRow.style.textAlign = 'left';
        
        const tituloCell = document.createElement('td');
        tituloCell.colSpan = ordenColumnasData.length + 3; // +3 para Fecha/Hora, Total y Acciones
        tituloCell.innerHTML = `🔒 BLOQUE ${numeroBloque} (CERRADO)`;
        tituloRow.appendChild(tituloCell);
        tbody.appendChild(tituloRow);
        
        // Variables para subtotales de este bloque específico
        let subtotalesBloqueCompleto = {};
        let subtotalesPaletsBloqueCompleto = {};
        let subtotalGeneralBloque = 0;
        
        // Inicializar subtotales para este bloque
        ordenColumnasData.forEach(nombreCaja => {
            if (nombreCaja.toLowerCase().includes('palet')) {
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
            cajasNormalesArray.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                totalCajasNormales += cantidad;
            });
            
            cellsHTML += `<td><strong>${totalCajasNormales}</strong></td>`;
            
            // Agregar celdas en el orden específico
            ordenColumnasData.forEach(nombreCaja => {
                const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
                cellsHTML += `<td>${cantidad}</td>`;
                
                // Acumular en subtotales de este bloque específico y totales generales
                if (nombreCaja.toLowerCase().includes('palet')) {
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
            if (totalCajasNormales > 0 || cajasPaletArray.some(nombreCaja => (conteo.cajas && conteo.cajas[nombreCaja]) > 0)) {
                row.classList.add('has-quantities');
            }
            
            // Agregar clase a las celdas de palets
            const paletCells = row.querySelectorAll('td');
            const startPaletIndex = 1 + cajasNormalesArray.length;
            for (let i = 0; i < cajasPaletArray.length; i++) {
                if (paletCells[startPaletIndex + i]) {
                    paletCells[startPaletIndex + i].classList.add('palet-column');
                }
            }
            
            tbody.appendChild(row);
        });
        
        // Subtotal del bloque cerrado
        const subtotalRow = document.createElement('tr');
        subtotalRow.className = 'subtotal-row';
        const colorBloque = coloresBloques[(bloqueIndex + 1) % coloresBloques.length];
        subtotalRow.style.backgroundColor = colorBloque;
        subtotalRow.style.fontWeight = 'bold';
        
        let subtotalHTML = `<td><strong>Subtotal Bloque ${numeroBloque}</strong></td>`;
        subtotalHTML += `<td><strong>${subtotalGeneralBloque}</strong></td>`;
        
        ordenColumnasData.forEach(nombreCaja => {
            if (nombreCaja.toLowerCase().includes('palet')) {
                subtotalHTML += `<td><strong>${subtotalesPaletsBloqueCompleto[nombreCaja] || 0}</strong></td>`;
            } else {
                subtotalHTML += `<td><strong>${subtotalesBloqueCompleto[nombreCaja] || 0}</strong></td>`;
            }
        });
        
        // Agregar celda vacía de acciones para subtotal
        subtotalHTML += `<td></td>`;
        
        subtotalRow.innerHTML = subtotalHTML;
        tbody.appendChild(subtotalRow);
        
        // Separador entre bloques cerrados (excepto después del último)
        if (bloqueIndex > 0) {
            const separatorRow = document.createElement('tr');
            separatorRow.style.height = '10px';
            separatorRow.style.backgroundColor = '#f5f5f5';
            
            const separatorCell = document.createElement('td');
            separatorCell.colSpan = ordenColumnasData.length + 2;
            separatorRow.appendChild(separatorCell);
            tbody.appendChild(separatorRow);
        }
    }
    
    // PASO 3: TOTAL GENERAL al final
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.style.backgroundColor = '#FF9800';
    totalRow.style.color = 'white';
    totalRow.style.fontWeight = 'bold';
    
    let totalHTML = '<td><strong>🏆 TOTAL GENERAL</strong></td>';
    totalHTML += `<td><strong>${totalGeneral}</strong></td>`;
    
    ordenColumnasData.forEach(nombreCaja => {
        if (nombreCaja.toLowerCase().includes('palet')) {
            totalHTML += `<td><strong>${totalesPalets[nombreCaja] || 0}</strong></td>`;
        } else {
            totalHTML += `<td><strong>${totalesPorCaja[nombreCaja] || 0}</strong></td>`;
        }
    });
    
    // Agregar celda vacía de acciones para total general
    totalHTML += `<td></td>`;
    
    totalRow.innerHTML = totalHTML;
    tbody.appendChild(totalRow);
    
    // Actualizar los recuadros de totales
    updateSummaryBoxes(totalGeneral, totalesPalets);
    
    // Actualizar encabezados de la tabla
    updateHistorialHeaders();
    
    // Actualizar estado del bloque
    updateBloqueEstado();
}

// Función para actualizar los recuadros de totales en la pantalla de conteos
function updateSummaryBoxes(totalGeneral, totalesPalets) {
    // Actualizar total general
    const totalGeneralDisplay = document.getElementById('total-general-display');
    if (totalGeneralDisplay) {
        totalGeneralDisplay.textContent = totalGeneral || 0;
    }
    
    // Calcular total de palets
    let totalPaletsValue = 0;
    if (totalesPalets) {
        Object.values(totalesPalets).forEach(cantidad => {
            totalPaletsValue += cantidad || 0;
        });
    }
    
    // Actualizar total de palets
    const totalPaletsDisplay = document.getElementById('total-palets-display');
    if (totalPaletsDisplay) {
        totalPaletsDisplay.textContent = totalPaletsValue;
    }
}

// Función simple para eliminar conteos
window.eliminarConteoSimple = function(indice) {
    if (!confirm('¿Eliminar este conteo?')) return;
    
    let historial = JSON.parse(localStorage.getItem('historialConteos')) || [];
    if (indice >= 0 && indice < historial.length) {
        historial.splice(indice, 1);
        localStorage.setItem('historialConteos', JSON.stringify(historial));
        historialConteos = historial;
        displayHistorialConteos();
        alert('Conteo eliminado');
    }
}

// Función para editar cantidades en el bloque activo
function editarCantidad(celda) {
    const conteoIndex = parseInt(celda.dataset.conteoIndex);
    const cajaNombre = celda.dataset.cajaNombre;
    const cantidadActual = parseInt(celda.textContent) || 0;
    
    // Crear input temporal para edición
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.value = cantidadActual;
    input.className = 'edit-input';
    input.style.width = '60px';
    input.style.textAlign = 'center';
    input.style.border = '2px solid #4CAF50';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    
    // Reemplazar contenido de la celda
    const contenidoOriginal = celda.innerHTML;
    celda.innerHTML = '';
    celda.appendChild(input);
    input.focus();
    input.select();
    
    // Función para guardar cambios
    function guardarCambio() {
        const nuevaCantidad = parseInt(input.value) || 0;
        
        // Actualizar el historial
        if (!historialConteos[conteoIndex].cajas) {
            historialConteos[conteoIndex].cajas = {};
        }
        
        if (nuevaCantidad > 0) {
            historialConteos[conteoIndex].cajas[cajaNombre] = nuevaCantidad;
        } else {
            delete historialConteos[conteoIndex].cajas[cajaNombre];
        }
        
        // Guardar en localStorage
        saveHistorialConteos();
        
        // Actualizar la pantalla
        displayHistorialConteos();
        
        // Mostrar mensaje de confirmación
        const mensaje = document.createElement('div');
        mensaje.textContent = '✓ Cantidad actualizada';
        mensaje.style.position = 'fixed';
        mensaje.style.top = '20px';
        mensaje.style.right = '20px';
        mensaje.style.backgroundColor = '#4CAF50';
        mensaje.style.color = 'white';
        mensaje.style.padding = '10px 15px';
        mensaje.style.borderRadius = '5px';
        mensaje.style.zIndex = '9999';
        mensaje.style.fontSize = '14px';
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            document.body.removeChild(mensaje);
        }, 2000);
    }
    
    // Función para cancelar edición
    function cancelarEdicion() {
        celda.innerHTML = contenidoOriginal;
    }
    
    // Event listeners - Mejorado para móviles
    let cambioGuardado = false;
    
    // Función para guardar una sola vez
    function guardarUnaVez() {
        if (!cambioGuardado) {
            cambioGuardado = true;
            guardarCambio();
        }
    }
    
    // Eventos para desktop
    input.addEventListener('blur', guardarUnaVez);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            guardarUnaVez();
        } else if (e.key === 'Escape') {
            cancelarEdicion();
        }
    });
    
    // Eventos táctiles para móviles
    input.addEventListener('touchend', function(e) {
        // Permitir que el input mantenga el foco
        e.stopPropagation();
    });
    
    // Agregar botón de confirmación para móviles
    if ('ontouchstart' in window) {
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '✓';
        confirmBtn.style.cssText = `
            position: absolute;
            right: -30px;
            top: 50%;
            transform: translateY(-50%);
            width: 25px;
            height: 25px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        celda.style.position = 'relative';
        celda.appendChild(confirmBtn);
        
        confirmBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            guardarUnaVez();
        });
        
        confirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            guardarUnaVez();
        });
    }
}

// Función para actualizar los encabezados de la tabla del historial
function updateHistorialHeaders() {
    const thead = document.querySelector('#conteos .data-table thead tr');
    if (!thead) return;
    
    // Ordenar cajas por posición antes de crear los encabezados
    const sortedBoxes = [...userCreatedBoxes].sort((a, b) => (a.position || 0) - (b.position || 0));
    
    // Crear orden dinámico basado en las cajas existentes ordenadas por posición
    // Primero los palets, luego las cajas normales
    const cajasPalet = sortedBoxes.filter(box => box.nombre.toLowerCase().includes('palet'));
    const cajasNormales = sortedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    
    const ordenColumnas = [
        'Fecha/Hora',
        'Total',
        ...cajasPalet.map(box => box.nombre),
        ...cajasNormales.map(box => box.nombre),
        'Acciones'
    ];
    
    // Crear encabezados con el orden dinámico
    let headersHTML = '';
    ordenColumnas.forEach(columna => {
        headersHTML += `<th>${columna}</th>`;
    });
    
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
        alert('No hay conteos en el historial para archivar.');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas archivar todos los conteos actuales y limpiar el historial? Esta acción no se puede deshacer.')) {
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
        
        alert('Historial archivado exitosamente y conteos actuales limpiados.');
    }
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
    
    alert(mensaje);
}

// Función para eliminar un registro archivado específico
function eliminarRegistroArchivado(index) {
    const registro = registrosArchivados[index];
    if (!registro) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar el registro archivado del ${registro.fechaArchivo}? Esta acción no se puede deshacer.`)) {
        // Eliminar el registro del array
        registrosArchivados.splice(index, 1);
        
        // Guardar los cambios en localStorage
        saveRegistrosArchivados();
        
        // Actualizar la visualización
        displayRegistrosArchivados();
        
        alert('Registro eliminado exitosamente.');
    }
}

// Función para exportar historial a PDF
function exportarHistorialPDF() {
    if (historialConteos.length === 0) {
        alert('No hay conteos en el historial para exportar.');
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
    
    // Separar cajas normales de palets (igual que en pantalla)
    const cajasNormales = userCreatedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    const cajasPalet = userCreatedBoxes.filter(box => box.nombre.toLowerCase().includes('palet'));
    
    const cajasNormalesArray = cajasNormales.map(box => box.nombre);
    const cajasPaletArray = cajasPalet.map(box => box.nombre);
    
    // Preparar encabezados (igual que en pantalla)
    const headers = ['Fecha/Hora', 'Total', ...cajasNormalesArray, ...cajasPaletArray];
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
        
        // Agregar celdas para cajas normales
        cajasNormalesArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            fila.push(cantidad.toString());
            
            // Acumular en subtotales y totales
            subtotalesPorCaja[nombreCaja] += cantidad;
            totalesPorCaja[nombreCaja] += cantidad;
        });
        
        // Agregar celdas para palets
        cajasPaletArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            fila.push(cantidad.toString());
            
            // Acumular solo en totales de palets
            subtotalesPalets[nombreCaja] += cantidad;
            totalesPalets[nombreCaja] += cantidad;
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
            
            // Subtotales de cajas normales
            cajasNormalesArray.forEach(nombreCaja => {
                filaSubtotal.push(subtotalesPorCaja[nombreCaja].toString());
            });
            
            // Subtotales de palets
            cajasPaletArray.forEach(nombreCaja => {
                filaSubtotal.push(subtotalesPalets[nombreCaja].toString());
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
    
    // Totales de cajas normales
    cajasNormalesArray.forEach(nombreCaja => {
        filaTotalGeneral.push(totalesPorCaja[nombreCaja].toString());
    });
    
    // Totales de palets
    cajasPaletArray.forEach(nombreCaja => {
        filaTotalGeneral.push(totalesPalets[nombreCaja].toString());
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
            const columnIndex = data.column.index;
            const isColumnTotal = columnIndex === 1; // Columna "Total" es la segunda (índice 1)
            
            // Detectar tipo de fila basándose en el contenido de la primera celda
            const isSubtotalRow = cellText && cellText.toString().includes('SUBTOTAL');
            const isTotalGeneralRow = cellText && cellText.toString().includes('TOTAL GENERAL');
            
            // Detectar si alguna celda de la fila contiene SUBTOTAL o TOTAL GENERAL
            let rowHasSubtotal = false;
            let rowHasTotalGeneral = false;
            
            if (data.row && data.row.raw) {
                const rowData = data.row.raw;
                for (let i = 0; i < rowData.length; i++) {
                    const cellContent = rowData[i];
                    if (cellContent && cellContent.toString().includes('SUBTOTAL')) {
                        rowHasSubtotal = true;
                        break;
                    }
                    if (cellContent && cellContent.toString().includes('TOTAL GENERAL')) {
                        rowHasTotalGeneral = true;
                        break;
                    }
                }
            }
            
            // Aplicar estilos según el tipo de fila
            if (isSubtotalRow || rowHasSubtotal) {
                // Fila de subtotal - toda la fila amarilla
                data.cell.styles.fillColor = [255, 235, 59]; // Amarillo
                data.cell.styles.textColor = 0; // Texto negro
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 10;
                
                if (isColumnTotal) {
                    data.cell.styles.fontSize = 12;
                }
            }
            else if (isTotalGeneralRow || rowHasTotalGeneral) {
                // Fila de total general - toda la fila roja suave
                data.cell.styles.fillColor = [255, 205, 210]; // Rojo muy suave
                data.cell.styles.textColor = 0; // Texto negro
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 11;
                
                if (isColumnTotal) {
                    data.cell.styles.fontSize = 14;
                }
            }
            else if (isColumnTotal && cellText !== 'Total') {
                // Filas normales - solo la columna Total en verde
                data.cell.styles.fillColor = [165, 214, 167]; // Verde suave
                data.cell.styles.textColor = 0; // Texto negro
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 9;
            }
            
            // Resaltar columnas de palets en encabezados
            if (data.section === 'head') {
                const headerText = headers[columnIndex];
                if (cajasPaletArray.includes(headerText)) {
                    data.cell.styles.fillColor = [240, 248, 255];
                    data.cell.styles.textColor = 0;
                }
                
                // Resaltar encabezado de columna Total
                if (headerText === 'Total') {
                    data.cell.styles.fillColor = [46, 125, 50]; // Verde oscuro
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontStyle = 'bold';
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
        alert('No hay registros archivados para exportar.');
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
        },
        didParseCell: function(data) {
            const columnIndex = data.column.index;
            const headerText = headers[columnIndex];
            const isColumnTotalGeneral = headerText === 'Total General';
            
            // Resaltar todas las cantidades en la columna Total General
            if (isColumnTotalGeneral && data.section === 'body') {
                data.cell.styles.fillColor = [0, 150, 136]; // Verde azulado (Teal)
                data.cell.styles.textColor = 255; // Texto blanco
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 10;
            }
            
            // Resaltar encabezado de columna Total General
            if (data.section === 'head' && headerText === 'Total General') {
                data.cell.styles.fillColor = [0, 77, 64]; // Verde azulado oscuro
                data.cell.styles.textColor = 255;
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });
    
    // Guardar el PDF
    doc.save(`registros-archivados-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Función para mostrar el teclado numérico modal
function showNumericKeypad(boxName, currentValue, callback) {
    const modal = document.getElementById('numeric-keypad-modal');
    const title = document.getElementById('keypad-title');
    const input = document.getElementById('keypad-input');
    const closeBtn = document.getElementById('close-keypad');
    const confirmBtn = document.getElementById('keypad-confirm');
    const cancelBtn = document.getElementById('keypad-cancel');
    const clearBtn = document.getElementById('keypad-clear');
    const backspaceBtn = document.getElementById('keypad-backspace');
    const numberBtns = document.querySelectorAll('.number-btn');
    
    // Configurar el modal
    title.textContent = `Cantidad para ${boxName}`;
    input.value = currentValue.toString();
    modal.style.display = 'flex';
    
    // Variables para manejar el estado
    let currentInput = currentValue.toString();
    
    // Función para actualizar el display
    function updateDisplay() {
        input.value = currentInput || '0';
    }
    
    // Event listeners para números
    numberBtns.forEach(btn => {
        const newHandler = function() {
            const number = this.getAttribute('data-number');
            if (currentInput === '0') {
                currentInput = number;
            } else {
                currentInput += number;
            }
            updateDisplay();
        };
        btn.removeEventListener('click', btn._keypadHandler);
        btn._keypadHandler = newHandler;
        btn.addEventListener('click', newHandler);
    });
    
    // Event listener para limpiar
    const clearHandler = function() {
        currentInput = '0';
        updateDisplay();
    };
    clearBtn.removeEventListener('click', clearBtn._keypadHandler);
    clearBtn._keypadHandler = clearHandler;
    clearBtn.addEventListener('click', clearHandler);
    
    // Event listener para backspace
    const backspaceHandler = function() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    };
    backspaceBtn.removeEventListener('click', backspaceBtn._keypadHandler);
    backspaceBtn._keypadHandler = backspaceHandler;
    backspaceBtn.addEventListener('click', backspaceHandler);
    
    // Event listener para confirmar
    const confirmHandler = function() {
        const value = parseInt(currentInput) || 0;
        modal.style.display = 'none';
        callback(value);
        cleanupEventListeners();
    };
    confirmBtn.removeEventListener('click', confirmBtn._keypadHandler);
    confirmBtn._keypadHandler = confirmHandler;
    confirmBtn.addEventListener('click', confirmHandler);
    
    // Event listener para cancelar
    const cancelHandler = function() {
        modal.style.display = 'none';
        callback(null);
        cleanupEventListeners();
    };
    cancelBtn.removeEventListener('click', cancelBtn._keypadHandler);
    cancelBtn._keypadHandler = cancelHandler;
    cancelBtn.addEventListener('click', cancelHandler);
    
    // Event listener para cerrar
    const closeHandler = function() {
        modal.style.display = 'none';
        callback(null);
        cleanupEventListeners();
    };
    closeBtn.removeEventListener('click', closeBtn._keypadHandler);
    closeBtn._keypadHandler = closeHandler;
    closeBtn.addEventListener('click', closeHandler);
    
    // Event listener para cerrar al hacer clic fuera del modal
    const modalClickHandler = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            callback(null);
            cleanupEventListeners();
        }
    };
    modal.removeEventListener('click', modal._keypadHandler);
    modal._keypadHandler = modalClickHandler;
    modal.addEventListener('click', modalClickHandler);
    
    // Función para limpiar event listeners
    function cleanupEventListeners() {
        numberBtns.forEach(btn => {
            btn.removeEventListener('click', btn._keypadHandler);
        });
        clearBtn.removeEventListener('click', clearBtn._keypadHandler);
        backspaceBtn.removeEventListener('click', backspaceBtn._keypadHandler);
        confirmBtn.removeEventListener('click', confirmBtn._keypadHandler);
        cancelBtn.removeEventListener('click', cancelBtn._keypadHandler);
        closeBtn.removeEventListener('click', closeBtn._keypadHandler);
        modal.removeEventListener('click', modal._keypadHandler);
    }
    
    // Soporte para teclado físico
    const keyboardHandler = function(e) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9') {
            const number = e.key;
            if (currentInput === '0') {
                currentInput = number;
            } else {
                currentInput += number;
            }
            updateDisplay();
        } else if (e.key === 'Backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        } else if (e.key === 'Enter') {
            const value = parseInt(currentInput) || 0;
            modal.style.display = 'none';
            callback(value);
            document.removeEventListener('keydown', keyboardHandler);
            cleanupEventListeners();
        } else if (e.key === 'Escape') {
            modal.style.display = 'none';
            callback(null);
            document.removeEventListener('keydown', keyboardHandler);
            cleanupEventListeners();
        } else if (e.key === 'Delete' || e.key === 'c' || e.key === 'C') {
            currentInput = '0';
            updateDisplay();
        }
    };
    
    document.addEventListener('keydown', keyboardHandler);
}
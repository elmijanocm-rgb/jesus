// Array para almacenar las cajas creadas por el usuario
let userCreatedBoxes = [];

// Función para guardar las cajas creadas por el usuario en localStorage
function saveUserBoxes() {
    console.log('saveUserBoxes llamada, guardando:', userCreatedBoxes);
    localStorage.setItem('userCreatedBoxes', JSON.stringify(userCreatedBoxes));
    console.log('Datos guardados en localStorage');
}

// Función para cargar las cajas creadas por el usuario desde localStorage
function loadUserBoxes() {
    console.log('loadUserBoxes llamada');
    const saved = localStorage.getItem('userCreatedBoxes');
    console.log('Datos recuperados de localStorage:', saved);
    if (saved) {
        userCreatedBoxes = JSON.parse(saved);
        console.log('userCreatedBoxes cargado:', userCreatedBoxes);
    } else {
        console.log('No hay datos guardados en localStorage');
    }
}

// Cargar las cajas al iniciar
console.log('=== INICIO DE LA APLICACIÓN ===');
console.log('localStorage disponible:', typeof(Storage) !== "undefined");
console.log('Contenido actual de localStorage:', localStorage.getItem('userCreatedBoxes'));
loadUserBoxes();
console.log('userCreatedBoxes después de cargar:', userCreatedBoxes);

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

// Función para actualizar la pantalla de inicio
function updateHomeScreen() {
    updateTotalBoxes();
    displayUserBoxesInAdmin();
    displayUserBoxesInHome();
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
                    <button class="btn secondary-btn edit-box-btn" title="Editar caja" data-box-index="${index}">
                        <i class="fas fa-edit"></i>
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
    
    // Agregar cada caja creada por el usuario
    userCreatedBoxes.forEach(box => {
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
            ${imageContent}
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
        
        countBtn.addEventListener('click', function() {
            const currentValue = parseInt(counterValue.textContent);
            const newValue = prompt(`Ingresa la cantidad para ${box.nombre}:`, currentValue);
            
            if (newValue !== null && !isNaN(newValue) && parseInt(newValue) >= 0) {
                const finalValue = parseInt(newValue);
                counterValue.textContent = finalValue;
                
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

// Función para agregar nueva caja
function addNewBox() {
    const boxName = prompt('Ingresa el nombre de la nueva caja:');
    if (boxName && boxName.trim() !== '') {
        const newBox = {
            nombre: boxName.trim(),
            cantidad: 0,
            imagen: null,
            color: '#f0f0f0'
        };
        
        userCreatedBoxes.push(newBox);
        saveUserBoxes();
        updateHomeScreen();
        displayUserBoxesInHome();
        displayUserBoxesInAdmin();
        
        alert('Caja agregada correctamente.');
    }
}

// Event listener para el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CONTENT LOADED ===');
    console.log('userCreatedBoxes al cargar DOM:', userCreatedBoxes);
    console.log('localStorage en DOM:', localStorage.getItem('userCreatedBoxes'));
    
    // Configurar navegación
    setupNavigation();
    
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
            console.log('Botón guardar contenedor clickeado');
            const nombre = document.getElementById('nombre-contenedor').value.trim();
            const tipo = document.getElementById('tipo-contenedor').value.trim();
            const useImage = document.getElementById('use-image').checked;
            const imageFile = document.getElementById('imagen-contenedor').files[0];
            const colorValue = document.getElementById('color-contenedor').value;
            console.log('Datos del formulario:', { nombre, tipo, useImage, imageFile, colorValue });
            
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
                    console.log('Nueva caja con imagen creada:', newBox);
                    userCreatedBoxes.push(newBox);
                    console.log('Array userCreatedBoxes después de agregar:', userCreatedBoxes);
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
                console.log('Nueva caja con color creada:', newBox);
                userCreatedBoxes.push(newBox);
                console.log('Array userCreatedBoxes después de agregar:', userCreatedBoxes);
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
    
    // Verificación adicional de carga de datos
    setTimeout(() => {
        console.log('=== VERIFICACIÓN POST-CARGA ===');
        console.log('userCreatedBoxes final:', userCreatedBoxes);
        console.log('localStorage final:', localStorage.getItem('userCreatedBoxes'));
        
        // Si no hay datos cargados, intentar cargar nuevamente
        if (userCreatedBoxes.length === 0) {
            console.log('Reintentando carga de datos...');
            loadUserBoxes();
            displayUserBoxesInAdmin();
            displayUserBoxesInHome();
            updateTotalBoxes();
        }
    }, 1000);
});

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
        alert('No hay cajas creadas para agregar al conteo.');
        return;
    }
    
    // Verificar si hay cantidades para contar
    const totalCantidad = userCreatedBoxes.reduce((total, box) => total + (box.cantidad || 0), 0);
    if (totalCantidad === 0) {
        alert('No hay cantidades para agregar al historial.');
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
    
    alert('Conteo agregado al historial y cantidades reseteadas.');
}

// Función para mostrar el historial de conteos
function displayHistorialConteos() {
    const tbody = document.querySelector('#conteos .data-table tbody');
    if (!tbody) return;
    
    // Limpiar contenido existente
    tbody.innerHTML = '';
    
    if (historialConteos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No hay conteos guardados</td></tr>';
        return;
    }
    
    // Separar cajas normales de palets
    const cajasNormales = userCreatedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    const cajasPalet = userCreatedBoxes.filter(box => box.nombre.toLowerCase().includes('palet'));
    
    const cajasNormalesArray = cajasNormales.map(box => box.nombre);
    const cajasPaletArray = cajasPalet.map(box => box.nombre);
    
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
        
        // Agregar celdas para cada tipo de caja normal
        cajasNormalesArray.forEach(nombreCaja => {
            const cantidad = (conteo.cajas && conteo.cajas[nombreCaja]) || 0;
            cellsHTML += `<td>${cantidad}</td>`;
            
            // Acumular en subtotales y totales (solo cajas normales)
            subtotalesPorCaja[nombreCaja] += cantidad;
            totalesPorCaja[nombreCaja] += cantidad;
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
            
            // Subtotales para cajas normales
            cajasNormalesArray.forEach(nombreCaja => {
                subtotalHTML += `<td><strong>${subtotalesPorCaja[nombreCaja]}</strong></td>`;
            });
            
            // Subtotales para palets (mostrar pero no sumar al total general)
            cajasPaletArray.forEach(nombreCaja => {
                subtotalHTML += `<td><strong>${subtotalesPalets[nombreCaja]}</strong></td>`;
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
    
    // Totales para cajas normales
    cajasNormalesArray.forEach(nombreCaja => {
        totalHTML += `<td><strong>${totalesPorCaja[nombreCaja]}</strong></td>`;
    });
    
    // Totales para palets (separados)
    cajasPaletArray.forEach(nombreCaja => {
        totalHTML += `<td><strong>${totalesPalets[nombreCaja]}</strong></td>`;
    });
    
    totalRow.innerHTML = totalHTML;
    tbody.appendChild(totalRow);
    
    // Actualizar encabezados de la tabla
    updateHistorialHeaders();
}

// Función para actualizar los encabezados de la tabla del historial
function updateHistorialHeaders() {
    const thead = document.querySelector('#conteos .data-table thead tr');
    if (!thead) return;
    
    // Separar cajas normales de palets
    const cajasNormales = userCreatedBoxes.filter(box => !box.nombre.toLowerCase().includes('palet'));
    const cajasPalet = userCreatedBoxes.filter(box => box.nombre.toLowerCase().includes('palet'));
    
    // Crear encabezados dinámicamente
    let headersHTML = '<th>Fecha/Hora</th>';
    
    // Agregar columna Total después de Fecha
    headersHTML += '<th>Total</th>';
    
    // Encabezados para cajas normales
    cajasNormales.forEach(box => {
        headersHTML += `<th>${box.nombre}</th>`;
    });
    
    // Encabezados para palets (separados)
    cajasPalet.forEach(box => {
        headersHTML += `<th style="background-color: #f0f8ff;">${box.nombre}</th>`;
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
        }
    });
    
    // Guardar el PDF
    doc.save(`registros-archivados-${new Date().toISOString().split('T')[0]}.pdf`);
}
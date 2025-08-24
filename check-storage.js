// Script para verificar el contenido de localStorage
console.log('=== VERIFICACIÓN DE LOCALSTORAGE ===');

// Verificar si localStorage está disponible
if (typeof(Storage) !== "undefined") {
    console.log('✅ localStorage está disponible');
    
    // Obtener datos guardados
    const saved = localStorage.getItem('userCreatedBoxes');
    console.log('Datos en localStorage:', saved);
    
    if (saved) {
        try {
            const boxes = JSON.parse(saved);
            console.log('Número de cajas:', boxes.length);
            
            boxes.forEach((box, index) => {
                console.log(`${index + 1}. ${box.nombre}`);
                
                // Verificar si contiene 'palet'
                const containsPalet = box.nombre.toLowerCase().includes('palet');
                if (containsPalet) {
                    console.log(`   ✅ Esta caja contiene 'palet': ${box.nombre}`);
                }
            });
            
            // Buscar caja con 'palet'
            const cajaPalet = boxes.find(box => 
                box.nombre.toLowerCase().includes('palet')
            );
            
            if (cajaPalet) {
                console.log(`🎯 CAJA ENCONTRADA: ${cajaPalet.nombre}`);
            } else {
                console.log('❌ No se encontró ninguna caja con "palet"');
            }
            
        } catch (error) {
            console.error('Error al parsear JSON:', error);
        }
    } else {
        console.log('❌ No hay datos en localStorage');
    }
} else {
    console.log('❌ localStorage no está disponible');
}

console.log('=== FIN DE VERIFICACIÓN ===');
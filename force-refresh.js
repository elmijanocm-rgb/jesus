// FORCE REFRESH SCRIPT - Versión 3.0
// Script para forzar limpieza completa del cache del navegador

(function() {
    'use strict';
    
    console.log('🔄 Iniciando limpieza completa v3.0...');
    
    // Función para limpiar todo
    function clearEverything() {
        return new Promise((resolve) => {
            // 1. Limpiar Storage
            try {
                localStorage.clear();
                sessionStorage.clear();
                console.log('✅ Storage limpiado');
            } catch (e) {
                console.warn('⚠️ Error limpiando storage:', e);
            }
            
            // 2. Limpiar IndexedDB
            if ('indexedDB' in window) {
                try {
                    indexedDB.deleteDatabase('conteo-app');
                    console.log('✅ IndexedDB limpiado');
                } catch (e) {
                    console.warn('⚠️ Error limpiando IndexedDB:', e);
                }
            }
            
            // 3. Desregistrar Service Workers
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    const promises = registrations.map(registration => {
                        console.log('🗑️ Desregistrando SW:', registration.scope);
                        return registration.unregister();
                    });
                    
                    return Promise.all(promises);
                }).then(() => {
                    console.log('✅ Todos los Service Workers desregistrados');
                    
                    // 4. Limpiar todos los caches
                    if ('caches' in window) {
                        return caches.keys();
                    }
                    return [];
                }).then(cacheNames => {
                    const deletePromises = cacheNames.map(cacheName => {
                        console.log('🗑️ Eliminando cache:', cacheName);
                        return caches.delete(cacheName);
                    });
                    
                    return Promise.all(deletePromises);
                }).then(() => {
                    console.log('✅ Todos los caches eliminados');
                    
                    // 5. Marcar versión actual
                    localStorage.setItem('app_version', '3.0');
                    localStorage.setItem('last_clear', Date.now().toString());
                    
                    console.log('🎉 Limpieza completa finalizada');
                    resolve();
                }).catch(error => {
                    console.error('❌ Error durante la limpieza:', error);
                    resolve();
                });
            } else {
                // Si no hay SW, solo limpiar caches
                if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                        const deletePromises = cacheNames.map(cacheName => {
                            console.log('🗑️ Eliminando cache:', cacheName);
                            return caches.delete(cacheName);
                        });
                        return Promise.all(deletePromises);
                    }).then(() => {
                        console.log('✅ Caches eliminados');
                        localStorage.setItem('app_version', '3.0');
                        resolve();
                    });
                } else {
                    localStorage.setItem('app_version', '3.0');
                    resolve();
                }
            }
        });
    }
    
    // Función para recargar con cache busting
    function forceReload() {
        console.log('🔄 Forzando recarga completa...');
        
        // Agregar parámetros de cache busting a la URL
        const url = new URL(window.location);
        url.searchParams.set('_cb', Date.now());
        url.searchParams.set('_v', '3.0');
        
        // Recargar con la nueva URL
        window.location.replace(url.toString());
    }
    
    // DESHABILITADO: Auto-verificación para evitar bucles infinitos
    // Solo funciones manuales disponibles
    console.log('🔧 Force-refresh cargado - Solo modo manual disponible');
    
    // Establecer versión actual si no existe
    const currentVersion = '3.0';
    if (!localStorage.getItem('app_version')) {
        localStorage.setItem('app_version', currentVersion);
        console.log('📝 Versión establecida:', currentVersion);
    }
    
    // Exponer función global para uso manual
    window.forceClearAndReload = function() {
        console.log('🔄 Limpieza manual iniciada...');
        clearEverything().then(() => {
            setTimeout(forceReload, 500);
        });
    };
    
})();

// Mensaje para el usuario
console.log('💡 Para forzar una limpieza manual, ejecuta: forceClearAndReload()');
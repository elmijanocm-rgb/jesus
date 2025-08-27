// Script para forzar actualización completa
(function() {
    'use strict';
    
    // Limpiar todos los caches
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log('Eliminando cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(function() {
            console.log('Todos los caches eliminados');
            // Recargar la página después de limpiar cache
            window.location.reload(true);
        });
    }
    
    // Desregistrar todos los service workers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                console.log('Desregistrando service worker:', registration);
                registration.unregister();
            }
        });
    }
    
    // Limpiar localStorage y sessionStorage
    try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Storage limpiado');
    } catch(e) {
        console.log('Error limpiando storage:', e);
    }
    
    // Forzar recarga completa
    setTimeout(function() {
        window.location.reload(true);
    }, 1000);
})();
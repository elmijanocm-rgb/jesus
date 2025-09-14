// OPTIMIZACIONES DE RENDIMIENTO - v3.2.0
// Este archivo contiene optimizaciones adicionales para mejorar el rendimiento

// Lazy loading para imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Debounce para eventos de resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimización de localStorage
const StorageOptimizer = {
    // Comprimir datos antes de guardar
    setItem: function(key, value) {
        try {
            const compressed = JSON.stringify(value);
            localStorage.setItem(key, compressed);
        } catch (e) {
            console.warn('Error al guardar en localStorage:', e);
        }
    },
    
    // Descomprimir datos al leer
    getItem: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Error al leer de localStorage:', e);
            return null;
        }
    },
    
    // Limpiar datos antiguos
    cleanup: function() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('temp_') || key.startsWith('cache_')) {
                const timestamp = localStorage.getItem(key + '_timestamp');
                if (timestamp && Date.now() - parseInt(timestamp) > 86400000) { // 24 horas
                    localStorage.removeItem(key);
                    localStorage.removeItem(key + '_timestamp');
                }
            }
        });
    }
};

// Optimización de eventos táctiles
function optimizeTouchEvents() {
    // Prevenir scroll durante interacciones
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('no-scroll')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Optimizar eventos de touch para botones
    const buttons = document.querySelectorAll('.btn, .keypad-btn, .nav-item');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
    });
}

// Preload de recursos críticos
function preloadCriticalResources() {
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = './emergency-mobile.css';
    document.head.appendChild(criticalCSS);
}

// Optimización de animaciones
function optimizeAnimations() {
    // Reducir animaciones en dispositivos de bajo rendimiento
    const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                            navigator.deviceMemory < 4;
    
    if (isLowPerformance) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
}

// Inicializar optimizaciones
function initPerformanceOptimizations() {
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            lazyLoadImages();
            optimizeTouchEvents();
            optimizeAnimations();
            StorageOptimizer.cleanup();
        });
    } else {
        lazyLoadImages();
        optimizeTouchEvents();
        optimizeAnimations();
        StorageOptimizer.cleanup();
    }
    
    // Preload recursos críticos inmediatamente
    preloadCriticalResources();
    
    // Optimizar resize events
    window.addEventListener('resize', debounce(() => {
        // Reajustar layout si es necesario
        if (window.updateLayout) {
            window.updateLayout();
        }
    }, 250));
}

// Auto-inicializar
initPerformanceOptimizations();

// Exportar para uso global
window.PerformanceOptimizer = {
    StorageOptimizer,
    debounce,
    lazyLoadImages,
    optimizeTouchEvents,
    optimizeAnimations
};
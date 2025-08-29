# 📦 Cuenta de Cajas - Aplicación PWA de Conteo

> Aplicación web progresiva moderna para el conteo eficiente de cajas y palets con sistema de bloques automático, edición de cantidades y totales en tiempo real.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://elmijanocm-rgb.github.io/cuenta-de-cajas/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-3.2.0-success)](https://github.com/elmijanocm-rgb/cuenta-de-cajas)

## 🚀 Demo en Vivo

**[🌐 Ver Aplicación](https://elmijanocm-rgb.github.io/cuenta-de-cajas/)**

*La aplicación está desplegada en GitHub Pages y lista para usar en cualquier dispositivo.*

## 🌟 Características Principales

### ✏️ **Edición de Cantidades (v3.1.4)**
- **Celdas Editables**: Haz clic en cualquier cantidad del bloque activo para editarla
- **Validación Automática**: Solo acepta números positivos
- **Guardado Instantáneo**: Los cambios se guardan automáticamente
- **Recálculo Automático**: Totales y subtotales se actualizan al instante
- **Feedback Visual**: Confirmación visual de cambios guardados
- **Optimizado para Móvil**: Funciona perfectamente en dispositivos táctiles

### 🎨 **Contraste Mejorado (NUEVO v3.1.5)**
- **Botones Más Visibles**: Teclado numérico con colores más distintivos
- **Mejor Accesibilidad**: Contraste mejorado para usuarios con dificultades visuales
- **Diseño Optimizado**: Colores que facilitan la identificación rápida de botones
- **Experiencia Mejorada**: Interfaz más clara y profesional

### 👁️ **Visibilidad del Texto (v3.1.6)**
- **Campo de entrada del teclado**: Texto ahora visible en gris oscuro (#1e293b)
- **Peso de fuente reforzado**: Mayor legibilidad con font-weight 700
- **Compatibilidad móvil**: Corrección aplicada en todas las resoluciones
- **Experiencia mejorada**: Eliminada la confusión visual del texto blanco sobre fondo blanco

### ✏️ **Edición Mejorada de Cantidades (v3.1.7)**
- **Input visual mejorado**: Diseño con gradientes, sombras y bordes redondeados
- **Tamaño optimizado**: Input más grande (80px desktop, 90px móvil) para mejor usabilidad
- **Efectos interactivos**: Escalado dinámico (1.05x-1.15x) y transiciones suaves
- **Indicadores visuales**: Tooltip "✏️ EDITAR" al hacer hover sobre celdas editables
- **Colores distintivos**: Verde (#2e7d32) por defecto, azul (#1565c0) al enfocar
- **Touch-friendly**: Optimizado para dispositivos táctiles con tamaños mínimos de 44-50px

### 🗑️ **Eliminación de Conteos (NUEVO v3.2.0)**
- **Botones de Eliminación**: Cada conteo individual puede ser eliminado con botón ❌
- **Confirmación de Seguridad**: Diálogo de confirmación antes de eliminar
- **Actualización Automática**: La tabla se refresca inmediatamente después de eliminar
- **Funcionalidad Móvil**: Optimizado para dispositivos táctiles
- **Solución Robusta**: Sistema simple y confiable sin conflictos de eventos

### 📱 **Optimización Móvil Completa (v3.2.0)**
- **CSS Móvil Avanzado**: Estilos específicos para dispositivos táctiles
- **PWA Mejorada**: Configuración optimizada para instalación móvil
- **Interfaz Táctil**: Botones y controles adaptados para touch
- **Rendimiento Optimizado**: Carga rápida y funcionamiento fluido en móviles

### 🎯 **Sistema de Bloques Inteligente**
- **Bloque Activo**: Las nuevas cantidades aparecen en la parte superior
- **Cierre Automático**: Los bloques se cierran automáticamente después de 4 filas
- **Ordenamiento Inteligente**: Bloques más recientes primero
- **Colores Diferenciados**: Cada bloque tiene su propio color distintivo

### 📊 **Totales en Tiempo Real**
- **Total General**: Suma de todas las cajas (excluyendo palets)
- **Total Palets**: Suma específica de todos los palets
- **Subtotales por Bloque**: Cálculos independientes para cada bloque
- **Actualización Automática**: Los totales se actualizan instantáneamente

### 💻 **Tecnología PWA**
- ✅ **Instalable** en dispositivos móviles y escritorio
- ✅ **Funciona Offline** una vez cargada
- ✅ **Responsive Design** para todos los dispositivos
- ✅ **Service Worker** para cache inteligente
- ✅ **Manifest** para instalación nativa

## 🚀 Inicio Rápido

### 📱 **Acceso Directo (GitHub Pages)**
```
🌐 https://elmijanocm-rgb.github.io/cuenta-de-cajas/
```

### 💻 **Desarrollo Local**

#### Opción 1: Servidor PowerShell (Recomendado)
```powershell
# Clonar el repositorio
git clone https://github.com/elmijanocm-rgb/cuenta-de-cajas.git
cd cuenta-de-cajas

# Iniciar servidor local
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Servidor iniciado en http://localhost:8080' -ForegroundColor Green

# El servidor se ejecutará hasta que cierres PowerShell
```

#### Opción 2: Python
```bash
# Clonar y navegar
git clone https://github.com/tu-usuario/nombre-repositorio.git
cd nombre-repositorio

# Iniciar servidor
python -m http.server 8080
# Abrir: http://localhost:8080
```

#### Opción 3: Node.js
```bash
# Instalar servidor global
npm install -g http-server

# Clonar y navegar
git clone https://github.com/tu-usuario/nombre-repositorio.git
cd nombre-repositorio

# Iniciar servidor
http-server -p 8080
# Abrir: http://localhost:8080
```

## 📱 Instalación como PWA

### En Móviles (Android/iOS)
1. Abrir la aplicación en el navegador
2. Buscar "Agregar a pantalla de inicio" o "Instalar aplicación"
3. Confirmar la instalación
4. ¡La app aparecerá como una aplicación nativa!

### En Escritorio (Chrome/Edge)
1. Abrir la aplicación en el navegador
2. Buscar el ícono de instalación en la barra de direcciones
3. Hacer clic en "Instalar"
4. La aplicación se abrirá en su propia ventana

## 🎨 Funcionalidades Detalladas

### 📋 **Gestión de Tipos de Cajas**
- Crear tipos personalizados de cajas
- Editar y eliminar tipos existentes
- Configuración de colores y nombres

### 🔢 **Sistema de Conteo Avanzado**
- Conteo rápido con botones intuitivos
- Historial completo de conteos con eliminación individual
- Exportación a PDF
- Búsqueda y filtrado
- Gestión completa del historial de conteos

### 📊 **Reportes y Análisis**
- Totales generales y por categoría
- Subtotales por bloque de conteo
- Visualización clara de datos
- Exportación de reportes

## 🏗️ Estructura del Proyecto

```
📁 proyecto/
├── 📄 index.html          # Estructura principal de la aplicación
├── 📄 script.js           # Lógica de negocio y funcionalidades
├── 📄 styles.css          # Estilos CSS modernos y responsive
├── 📄 manifest.json       # Configuración PWA
├── 📄 sw.js              # Service Worker para funcionalidad offline
├── 🖼️ icon-192.png        # Icono PWA 192x192
├── 🖼️ icon-512.png        # Icono PWA 512x512
├── 📄 README.md           # Documentación del proyecto
└── 📁 backup_app_conteo/  # Copia de seguridad completa
    ├── 📄 index.html
    ├── 📄 script.js
    ├── 📄 styles.css
    └── 📄 ...
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **Almacenamiento**: LocalStorage API
- **Diseño**: CSS Grid, Flexbox, Responsive Design
- **Iconografía**: Material Design Icons
- **Exportación**: jsPDF para generación de PDFs

## 🌐 Compatibilidad

| Navegador | Versión Mínima | PWA Support |
|-----------|----------------|-------------|
| Chrome    | 67+           | ✅ Completo  |
| Firefox   | 60+           | ✅ Completo  |
| Safari    | 11.1+         | ✅ Completo  |
| Edge      | 79+           | ✅ Completo  |

## 📱 Dispositivos Soportados

- 📱 **Móviles**: Android 5.0+, iOS 11.3+
- 💻 **Escritorio**: Windows 10+, macOS 10.14+, Linux
- 📟 **Tablets**: iPad, Android tablets

## 🔒 Privacidad y Datos

- ✅ **100% Local**: Todos los datos se almacenan localmente
- ✅ **Sin Servidor**: No se envían datos a servidores externos
- ✅ **Offline First**: Funciona completamente sin internet
- ✅ **Sin Tracking**: No se recopilan datos de usuario

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

¿Tienes problemas o sugerencias? 

- 🐛 **Reportar Bug**: [Crear Issue](https://github.com/tu-usuario/nombre-repositorio/issues)
- 💡 **Sugerir Feature**: [Crear Issue](https://github.com/tu-usuario/nombre-repositorio/issues)
- 📧 **Contacto**: tu-email@ejemplo.com

## 🎯 Roadmap

- [ ] 🔄 Sincronización en la nube
- [ ] 📊 Gráficos y estadísticas avanzadas
- [ ] 🔔 Notificaciones push
- [ ] 🌍 Soporte multi-idioma
- [ ] 📱 App nativa para tiendas

---

<div align="center">

**⭐ Si te gusta este proyecto, ¡dale una estrella! ⭐**

*Desarrollado con ❤️ para optimizar el conteo de inventarios*

</div>
# 📦 Aplicación PWA de Conteo de Cajas

![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Design-blue)
![Offline](https://img.shields.io/badge/Offline-Support-green)

> **Aplicación web progresiva (PWA) moderna para el conteo eficiente de cajas y palets con sistema de bloques automático y totales en tiempo real.**

## 🌟 Características Principales

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
🌐 https://tu-usuario.github.io/nombre-repositorio
```

### 💻 **Desarrollo Local**

#### Opción 1: Servidor PowerShell (Recomendado)
```powershell
# Clonar el repositorio
git clone https://github.com/tu-usuario/nombre-repositorio.git
cd nombre-repositorio

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
- Historial completo de conteos
- Exportación a PDF
- Búsqueda y filtrado

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
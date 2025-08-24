# 📦 App de Conteo de Cajas - PWA

> Aplicación web progresiva para el conteo y gestión de diferentes tipos de cajas y contenedores.

## 🌟 Características

- ✅ **PWA Completa**: Instalable en móviles y funciona offline
- ✅ **Gestión de Cajas**: Crear, editar y eliminar tipos de cajas personalizadas
- ✅ **Conteo Inteligente**: Sistema de conteo con historial completo
- ✅ **Exportación PDF**: Genera reportes en PDF de los conteos
- ✅ **Responsive**: Optimizada para móviles y escritorio
- ✅ **Offline First**: Funciona sin conexión a internet
- ✅ **Almacenamiento Local**: Los datos se guardan en el navegador

## 🚀 Demo en Vivo

[Ver Demo](https://tu-usuario.github.io/app-conteo-cajas)

## 📱 Capturas de Pantalla

### Pantalla Principal
![Pantalla Principal](https://via.placeholder.com/400x600/4CAF50/FFFFFF?text=Pantalla+Principal)

### Crear Cajas
![Crear Cajas](https://via.placeholder.com/400x600/2196F3/FFFFFF?text=Crear+Cajas)

### Historial
![Historial](https://via.placeholder.com/400x600/FF9800/FFFFFF?text=Historial)

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Lógica de la aplicación
- **PWA** - Service Worker para funcionalidad offline
- **jsPDF** - Generación de reportes PDF
- **Font Awesome** - Iconografía
- **LocalStorage** - Persistencia de datos

## 📋 Funcionalidades Detalladas

### 🏠 Pantalla de Inicio
- Resumen total de cajas contadas
- Vista rápida de todos los tipos de cajas
- Acceso directo para agregar conteos

### ⚙️ Gestión de Cajas
- Crear nuevos tipos de cajas con:
  - Nombre personalizado
  - Tipo de contenido (Juego, Película, Libro, etc.)
  - Descripción y medidas
  - Peso para tara
  - Imagen personalizada o colores predefinidos
- Editar cajas existentes
- Eliminar cajas no utilizadas

### 📊 Sistema de Conteo
- Conteo individual por tipo de caja
- Historial completo con fechas
- Subtotales y totales generales
- Función de archivar históricos

### 📄 Reportes
- Exportación a PDF del historial
- Exportación de registros archivados
- Formato profesional para reportes

## 🚀 Instalación y Uso

### Opción 1: Usar desde GitHub Pages
1. Ve a la [demo en vivo](https://tu-usuario.github.io/app-conteo-cajas)
2. En móviles, aparecerá la opción "Agregar a pantalla de inicio"
3. ¡Listo! Ya puedes usar la app offline

### Opción 2: Ejecutar Localmente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/app-conteo-cajas.git

# Entrar al directorio
cd app-conteo-cajas

# Servir con cualquier servidor HTTP
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js
npx http-server -p 8080

# Opción 3: PHP
php -S localhost:8080
```

Luego abre tu navegador en `http://localhost:8080`

## 📱 Instalación como PWA

### En Android:
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma la instalación

### En iOS:
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

### En Escritorio:
1. Abre la app en Chrome/Edge
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar"

## 🔧 Desarrollo

### Estructura del Proyecto
```
app-conteo-cajas/
├── index.html          # Estructura principal
├── script.js           # Lógica de la aplicación
├── styles.css          # Estilos CSS
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
├── icon-192.png       # Icono 192x192
├── icon-512.png       # Icono 512x512
└── README.md          # Este archivo
```

### Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📊 Datos y Privacidad

- **Almacenamiento Local**: Todos los datos se guardan en el `localStorage` del navegador
- **Sin Servidor**: No se envían datos a ningún servidor externo
- **Privacidad Total**: Tus datos permanecen en tu dispositivo
- **Backup Manual**: Puedes exportar tus datos en PDF

## 🐛 Problemas Conocidos

- Los datos no se sincronizan entre dispositivos (por diseño)
- Limpiar datos del navegador eliminará todos los conteos
- La exportación PDF requiere conexión para cargar la librería

## 🔮 Próximas Funcionalidades

- [ ] Sincronización en la nube (opcional)
- [ ] Códigos QR para cajas
- [ ] Estadísticas avanzadas
- [ ] Temas personalizables
- [ ] Backup automático
- [ ] Múltiples almacenes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- [Font Awesome](https://fontawesome.com/) por los iconos
- [jsPDF](https://github.com/parallax/jsPDF) por la generación de PDFs
- Comunidad de desarrolladores PWA

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐
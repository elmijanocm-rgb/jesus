# Aplicación de Conteo de Mercancía

Una aplicación móvil desarrollada con React Native y Expo para el conteo y gestión de diferentes tipos de cajas y mercancía.

## Características

- **Resumen del Conteo**: Vista principal con contadores para diferentes tipos de cajas
- **Historial de Conteos**: Tabla detallada con el historial de todos los conteos realizados
- **Registros Archivados**: Gestión de registros históricos archivados
- **Crear Caja**: Interfaz para seleccionar y contar diferentes tipos de mercancía

## Tipos de Mercancía Soportados

- Caja Verde Grande (CEVG)
- Caja Verde Pequeña (CEVP)
- Caja Roja Grande (CERG)
- Caja Roja Pequeña (CERP)
- Caja Verde Grande BOX (CVGBOX)
- Caja Azul Pescado (PEAZUL)
- Palet Mercancía (EUROPEO)

## Instalación

1. Asegúrate de tener Node.js instalado
2. Instala Expo CLI globalmente:
   ```bash
   npm install -g expo-cli
   ```

3. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

## Ejecución

### Desarrollo
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Estructura del Proyecto

```
├── App.js                 # Componente principal con navegación
├── src/
│   └── screens/
│       ├── ResumenScreen.js      # Pantalla de resumen
│       ├── HistorialScreen.js    # Pantalla de historial
│       ├── RegistrosScreen.js    # Pantalla de registros archivados
│       └── CrearCajaScreen.js    # Pantalla para crear conteos
├── package.json
├── app.json
└── babel.config.js
```

## Tecnologías Utilizadas

- React Native
- Expo
- React Navigation
- React Native Paper
- Expo Vector Icons

## Funcionalidades

### Pantalla de Resumen
- Muestra el total de cajas contadas
- Lista todos los tipos de cajas con sus contadores individuales
- Botón para agregar nuevos conteos

### Pantalla de Historial
- Tabla detallada con fecha/hora de cada conteo
- Subtotales y total general
- Opciones para exportar a PDF y archivar

### Pantalla de Registros Archivados
- Visualización de totales archivados
- Acciones para ver detalles y eliminar registros
- Exportación a PDF

### Pantalla de Crear Caja
- Selección de tipo de mercancía
- Contador interactivo con botones de incremento/decremento
- Guardado de conteos

## Colores del Tema

- Verde Principal: #4CAF50
- Verde Oscuro: #2E7D32
- Rojo: #F44336
- Azul: #2196F3
- Naranja: #FF9800
- Fondo: #F5F5F5
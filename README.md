# Aplicación PWA de Conteo de Cajas

## Descripción
Aplicación web progresiva (PWA) para el conteo de diferentes tipos de cajas y palets.

## Cómo abrir la aplicación en el PC

### Opción 1: Servidor HTTP Simple
1. Abrir PowerShell en la carpeta del proyecto
2. Ejecutar el siguiente comando:
```powershell
$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Servidor iniciado en http://localhost:8080/' -ForegroundColor Green; Write-Host 'Para acceso desde móvil: http://192.168.18.5:8080/' -ForegroundColor Green; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $localPath = $request.Url.LocalPath; if ($localPath -eq '/') { $localPath = '/index.html' }; $filePath = Join-Path (Get-Location) $localPath.TrimStart('/'); if (Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length) } else { $response.StatusCode = 404; $notFound = [System.Text.Encoding]::UTF8.GetBytes('404 - Not Found'); $response.ContentLength64 = $notFound.Length; $response.OutputStream.Write($notFound, 0, $notFound.Length) }; $response.OutputStream.Close() }
```
3. Abrir el navegador y ir a: http://localhost:8080/

### Opción 2: Python (si está instalado)
1. Abrir terminal en la carpeta del proyecto
2. Ejecutar: `python -m http.server 8080`
3. Abrir el navegador y ir a: http://localhost:8080/

### Opción 3: Node.js (si está instalado)
1. Instalar servidor simple: `npm install -g http-server`
2. Ejecutar: `http-server -p 8080`
3. Abrir el navegador y ir a: http://localhost:8080/

## Funcionalidades
- ✅ Crear y administrar tipos de cajas personalizadas
- ✅ Realizar conteos de cajas
- ✅ Ver historial de conteos con totales
- ✅ Exportar historial a PDF
- ✅ Funcionalidad PWA (instalable en móviles)
- ✅ Funciona offline
- ✅ Navegación entre pantallas

## Archivos principales
- `index.html` - Estructura de la aplicación
- `script.js` - Lógica de la aplicación
- `styles.css` - Estilos de la interfaz
- `manifest.json` - Configuración PWA
- `sw.js` - Service Worker para funcionalidad offline
- `icon-192.png`, `icon-512.png` - Iconos de la aplicación

## Backup
La carpeta `backup_app_conteo/` contiene una copia de seguridad de todos los archivos.

## Notas
- La aplicación guarda los datos en el localStorage del navegador
- Para acceso desde móvil, usar la IP local mostrada al iniciar el servidor
- La aplicación es completamente funcional offline una vez cargada
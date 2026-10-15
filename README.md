# 🍪 Galleta Factory

Demo incremental para Android, inspirada en Cookie Clicker. Toca la galleta, compra dedos de oro, abuelas reposteras y hornos mágicos. Las mejoras producen galletas y el progreso se guarda automáticamente en el dispositivo. Se generan hasta 8 horas de producción al regresar. Sin anuncios, servidores, permisos de Internet ni dependencias web externas.

## Generar y descargar el APK

1. Entra en [Actions → Generar APK Android](https://github.com/migdlp/incremental_game/actions/workflows/build-apk.yml).
2. Pulsa **Run workflow**, selecciona **main** y confirma **Run workflow**.
3. Espera a que termine con una marca verde (la primera compilación puede tardar varios minutos).
4. Abre esa ejecución. En **Artifacts**, descarga **galleta-factory-apk-N**. También hay un enlace en el resumen de la ejecución.
5. Extrae el ZIP y abre **galleta-factory-demo.apk** desde tu móvil Android. Si Android lo solicita, autoriza a esa aplicación a instalar apps desconocidas.

Necesitas iniciar sesión en GitHub para descargar los artifacts. Se conservan **30 días**; puedes ejecutar de nuevo la pipeline cuando quieras. **Solo se ejecuta manualmente**, nunca al hacer push o abrir una PR. No requiere configurar ningún secreto.

El APK es una **demo debug firmada automáticamente**, para Android 6.0 o superior (API 23). No es un paquete de distribución de Google Play. La clave debug puede variar entre compilaciones: si una actualización dice que la firma no coincide, desinstala la anterior antes de instalarla; esto borra su progreso. No desinstales si quieres conservar la partida actual.

## Desarrollo

- Android nativo en Java con WebView y archivos locales HTML/CSS/JavaScript.
- SDK 35, Android Gradle Plugin 8.9.2, Gradle 8.11.1, JDK 17.
- Pruebas: `node --test tests/game.test.cjs` (Node 22).
- Compilación local: instala el SDK 35 y Gradle 8.11.1, configura `ANDROID_HOME` y ejecuta `gradle :app:lintDebug :app:assembleDebug`.
- APK local: `app/build/outputs/apk/debug/app-debug.apk`.
- Para probar la interfaz en navegador, sirve `app/src/main/assets` con un servidor estático, por ejemplo `python3 -m http.server 8000 --directory app/src/main/assets`.

El botón **Reiniciar partida** pide confirmación antes de borrar el progreso. El guardado es local, sin sincronización entre dispositivos.

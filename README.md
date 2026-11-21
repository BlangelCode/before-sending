# Antes de enviar

**Antes de enviar** es una aplicación web para revisar posibles datos sensibles antes de compartir texto con herramientas de inteligencia artificial, enviarlo a una empresa o publicarlo en redes sociales. El análisis se ejecuta en el navegador; el texto no se envía al backend ni a una API de IA.

> **Estado:** MVP frontend de una sola página. La detección es orientativa y no garantiza anonimización completa.

## Problema y objetivo

Al pedirle ayuda a una IA, enviar un mensaje o publicar en redes, una persona puede incluir accidentalmente datos propios o de terceros. Antes de enviar muestra tipos de posibles datos sensibles y permite reemplazarlos antes de copiar el texto protegido.

El proyecto se plantea como una herramienta educativa de privacidad, no como una garantía de anonimización.

## Funcionalidades del MVP

- Escribir o pegar texto, o cargar un ejemplo ficticio para probar la aplicación.
- Detectar posibles correos electrónicos y números de teléfono con reglas locales de JavaScript.
- Seleccionar manualmente otro fragmento dentro del texto y añadirlo como posible dato sensible.
- Revisar y desmarcar los hallazgos que se quieran conservar.
- Reemplazar los fragmentos seleccionados con etiquetas como `[CORREO_1]`, `[TELEFONO_1]` y `[DATO_1]`.
- Revisar y copiar el resultado protegido, o limpiar el texto y los hallazgos de la página.
- Instalar la PWA y abrir su estructura estática sin conexión en navegadores compatibles.

La interfaz presenta los resultados como posibles datos sensibles. Las reglas pueden pasar por alto valores o marcar números que no sean teléfonos; la persona debe revisar el resultado antes de compartirlo.

## Tecnologías y por qué

| Tecnología | Uso previsto |
| --- | --- |
| HTML | Estructura semántica y accesible de la interfaz. |
| CSS | Presentación adaptable a móvil y escritorio, sin imponer un framework visual. |
| JavaScript nativo | Interacciones, selección de fragmentos, reglas de detección y sustitución local. |
| Python + FastAPI | Backend planeado para futuras operaciones no sensibles. No forma parte del MVP y no recibe texto. |
| Manifiesto y service worker | Describir la PWA y cachear únicamente los recursos estáticos para que la interfaz pueda abrirse sin conexión. |

Se elige HTML, CSS y JavaScript nativo en vez de añadir un framework de frontend para mantener el MVP ligero y reducir dependencias. HTML y CSS por sí solos no pueden realizar el análisis interactivo; JavaScript es necesario para leer el texto en la página, detectar patrones y aplicar cambios.

## Arquitectura

```text
Navegador
  ├─ frontend/
  │   ├─ index.html
  │   ├─ css/styles.css
  │   ├─ js/app.js
  │   ├─ manifest.webmanifest
  │   ├─ service-worker.js
  │   └─ assets/icon.svg
  └─ Analiza y transforma el texto localmente

Servidor estático HTTPS
  └─ Entrega los archivos de la PWA; no recibe el texto del editor

FastAPI
  └─ Planeado, pero no utilizado por el MVP
```

El texto, los hallazgos y los reemplazos se procesan en memoria en la página. El frontend no realiza peticiones para analizar el texto ni persiste un historial. El service worker guarda recursos de la aplicación, no el contenido del editor. FastAPI permanece sin implementar y no hay base de datos ni cuentas.

## Detección local y límites

La detección automática implementada utiliza patrones de JavaScript para correos electrónicos y posibles teléfonos; no usa un modelo de IA. Otros fragmentos se pueden seleccionar manualmente. Los números de teléfono pueden confundirse con fechas o identificadores, y otros formatos internacionales pueden no detectarse. Nombres, direcciones e identificadores no se identifican automáticamente.

La aplicación debe indicar con claridad que:

- puede pasar por alto datos sensibles o marcar texto que no lo sea;
- una revisión manual sigue siendo necesaria;
- cada persona debe comprobar el texto protegido antes de compartirlo;
- el producto no reemplaza la política de privacidad del servicio de IA utilizado.

## Estructura inicial

```text
frontend/
  index.html
  css/
    styles.css
  js/
    app.js
  manifest.webmanifest
  service-worker.js
  assets/
    icon.svg

backend/
  app/
    main.py
  requirements.txt

evohacks-2-copilot/
  context/
    memory.md
```

`backend/app/main.py` y `backend/requirements.txt` se mantienen vacíos: el MVP no necesita servidor para procesar texto.

## Empaquetado y ejecución previstos

La PWA se puede probar con un servidor estático local y desplegar como sitio HTTPS para que otras personas la abran mediante un enlace. En Windows, desde PowerShell:

```powershell
Set-Location frontend
python -m http.server 8000
```

Abre `http://localhost:8000`. Para instalar la PWA desde un sitio publicado se necesita HTTPS y un navegador compatible. El service worker cachea el shell estático, no el texto escrito.

## Privacidad y seguridad del producto

- No integrar una API externa de IA para leer el texto.
- El frontend no envía texto ni hallazgos a FastAPI; el backend no participa en el MVP.
- No guardar el texto en almacenamiento local ni crear historial.
- La acción «Limpiar» borra el contenido del editor, la lista de hallazgos y el resultado de la página.
- No prometer detección exhaustiva ni protección absoluta; revisar el resultado antes de compartirlo.

## Contexto de la hackatón

El proyecto se alinea con el tema **Projects for Social Good** al promover un uso más consciente y privado de herramientas de IA. Para la entrega se deberá distinguir el trabajo realizado durante el evento, explicar las decisiones técnicas y acreditar los recursos externos que se incorporen.

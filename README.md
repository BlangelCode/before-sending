# Antes de enviar

**Antes de enviar** es una aplicación web para revisar posibles datos sensibles antes de compartir texto con herramientas de inteligencia artificial, enviarlo a una empresa o publicarlo en redes sociales. El análisis se ejecuta en el navegador; el texto no se envía al backend ni a una API de IA.

> **Estado:** MVP frontend de una sola página. La detección es orientativa y no garantiza anonimización completa.

## Problema y objetivo

Al pedirle ayuda a una IA, enviar un mensaje o publicar en redes, una persona puede incluir accidentalmente datos propios o de terceros. Antes de enviar muestra tipos de posibles datos sensibles y permite reemplazarlos antes de copiar el texto protegido.

El proyecto se plantea como una herramienta educativa de privacidad, no como una garantía de anonimización.

## Funcionalidades del MVP

- Escribir o pegar texto, o cargar un ejemplo ficticio de 201 caracteres para probar varias categorías.
- Revisar categorías en pestañas con conteos; se muestra un solo panel a la vez y la lista tiene desplazamiento propio.
- Recorrer pestañas con flechas izquierda/derecha, Inicio y Fin; al cambiar de categoría se conservan etiquetas y apariciones desmarcadas.
- Agrupar los hallazgos por categoría y por valor, sin distinguir mayúsculas/minúsculas; cada valor distinto tiene su propia etiqueta.
- Mostrar por separado las apariciones de un valor, permitir excluir cada aparición y saltar desde ella a su ubicación seleccionada en el texto original.
- Reconocer cédulas venezolanas con prefijos `V-`/`E-` y otros números de identificación junto a etiquetas como “DNI”, “CI” o “documento de identidad”, incluso en frases como “mi cédula es 12345678”.
- Reconocer pasaportes y RIF solo junto a su etiqueta; detectar teléfonos internacionales o junto a términos como “teléfono”, “número de teléfono”, “celular” y “móvil”.
- Detectar correos, cuentas bancarias, números de tarjetas de pago y códigos de seguridad (CVV/CVC) mediante contexto.
- Detectar tickets de soporte y códigos de planilla solo junto a sus términos contextuales. No detectar números de operación bancaria ni códigos de aula aislados.
- Detectar direcciones IP IPv4 completas por separado de las direcciones postales; estas últimas se buscan a partir de indicadores como “calle”, “avenida”, “urbanización” o “domicilio”.
- Seleccionar manualmente un fragmento; la herramienta propone sus coincidencias repetidas ignorando mayúsculas/minúsculas y permite excluirlas individualmente.
- Elegir una etiqueta predefinida o personalizada por cada valor distinto y aplicarla a sus apariciones marcadas. Las etiquetas predeterminadas llevan un índice (`[CÉDULA_1]`, `[CÉDULA_2]`) para distinguir valores diferentes.
- Revisar y desmarcar las apariciones que se quieran conservar.
- Reemplazar los fragmentos seleccionados con etiquetas como `[CORREO_1]`, `[TELÉFONO_1]` y `[DATO_1]`.
- Revisar y copiar el resultado protegido, o limpiar el texto y los hallazgos de la página.
- Instalar la PWA y abrir su estructura estática sin conexión en navegadores compatibles.

La interfaz presenta los resultados como posibles datos sensibles. Los patrones contextuales pueden pasar por alto valores o producir falsos positivos; la persona debe revisar el texto protegido antes de compartirlo.

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

La detección automática se basa en patrones y palabras de contexto en JavaScript; no usa un modelo de IA. Un número suelto no basta para reconocer cédula, RIF, pasaporte, cuenta, tarjeta, código de seguridad, ticket o planilla. La detección de teléfonos locales requiere contexto. Las etiquetas y formatos varían por país, por lo que las reglas no cubren todos los documentos. Las direcciones postales se extraen de manera heurística desde un indicador postal hasta un límite cercano; deben revisarse. Las direcciones IP se validan y se reconocen por separado. Todo resultado es una sugerencia.

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

## Posibles mejoras futuras

- Perfiles regionales para patrones de identificación y teléfono, probados con datos ficticios de cada país.
- Detección local de contraseñas y claves de API, siempre con confirmación manual y sin almacenar valores.
- Deshacer o restaurar reemplazos durante la sesión, borrando el mapa temporal al limpiar.
- Importar documentos de texto; el soporte de PDF, documentos ofimáticos e imágenes requeriría evaluar cuidadosamente privacidad, tamaño y OCR offline.

## Contexto de la hackatón

El proyecto se alinea con el tema **Projects for Social Good** al promover un uso más consciente y privado de herramientas de IA. Para la entrega se deberá distinguir el trabajo realizado durante el evento, explicar las decisiones técnicas y acreditar los recursos externos que se incorporen.

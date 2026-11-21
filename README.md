# Antes de enviar

**Antes de enviar** es el concepto de una aplicación web que ayuda a las personas a revisar y reducir la información sensible que comparten con herramientas de inteligencia artificial, enviar mensajes extensos a empresas o públicar algún contenido extenso en redes sociales. El análisis del texto está diseñado para ejecutarse en el navegador, sin enviarlo a una API de IA ni al backend.

> **Estado:** documentación y estructura inicial. Los archivos de la aplicación están vacíos; el producto todavía no está implementado.

## Problema y objetivo

Al pedirle ayuda a una IA, una persona puede pegar por accidente datos personales, laborales o de otra persona. Antes de enviar busca dar control al usuario: mostrar posibles datos sensibles, explicar por qué se marcaron y permitir ocultarlos, reemplazarlos o generalizarlos antes de copiar el texto protegido.

El proyecto se plantea como una herramienta educativa de privacidad, no como una garantía de anonimización.

## Funcionalidades previstas

- Revisar texto en el navegador con reglas locales deterministas.
- Señalar patrones comunes, por ejemplo correos, algunos formatos de teléfono y valores junto a etiquetas como “contraseña” o “token”.
- Permitir que el usuario seleccione manualmente nombres, direcciones u otros fragmentos que las reglas no puedan reconocer con seguridad.
- Ocultar, reemplazar por etiquetas o generalizar los fragmentos seleccionados.
- Copiar el texto protegido para utilizarlo en la herramienta de IA elegida por el usuario.
- En una etapa posterior, revisar una respuesta pegada desde una IA y restaurar localmente algunas etiquetas cuando sea necesario.
- Ofrecer plantillas de preparación de prompts y una experiencia PWA instalable en navegadores compatibles.

Estas son funcionalidades previstas; todavía no están implementadas.

## Tecnologías y por qué

| Tecnología | Uso previsto |
| --- | --- |
| HTML | Estructura semántica y accesible de la interfaz. |
| CSS | Presentación adaptable a móvil y escritorio, sin imponer un framework visual. |
| JavaScript nativo | Interacciones, selección de fragmentos, reglas de detección y sustitución local. |
| Python + FastAPI | Backend mínimo para servir la aplicación y ofrecer operaciones no sensibles, como una comprobación de salud. |
| PWA | Permitir abrir la aplicación por enlace e instalarla desde navegadores compatibles; el soporte offline se añadirá al implementar el service worker. |

Se elige HTML, CSS y JavaScript nativo en vez de añadir un framework de frontend para mantener el MVP ligero y reducir dependencias. HTML y CSS por sí solos no pueden realizar el análisis interactivo; JavaScript es necesario para leer el texto en la página, detectar patrones y aplicar cambios.

## Arquitectura

```text
Navegador
  ├─ frontend/
  │   ├─ index.html
  │   ├─ css/styles.css
  │   ├─ js/app.js
  │   ├─ manifest.webmanifest
  │   └─ service-worker.js
  └─ Analiza y transforma el texto localmente

Servidor FastAPI
  ├─ backend/app/main.py
  ├─ Sirve la aplicación y recursos estáticos
  └─ Expone funciones no sensibles (por ejemplo, health check)
```

El texto introducido, los hallazgos y el mapa temporal usado para reemplazar/restaurar etiquetas deben permanecer en el navegador. FastAPI no debe recibirlos, guardarlos ni registrarlos. Para el MVP no se prevé base de datos, cuentas de usuario ni llamadas a modelos de IA.

## Detección local y límites

La primera versión utilizará reglas de JavaScript —principalmente patrones de texto y reglas de contexto—, no un modelo de IA. El usuario revisará cada hallazgo antes de aplicar cambios. La detección automática de nombres, direcciones e identificadores nacionales es difícil de hacer de forma fiable para todos los idiomas y países; por ello debe existir selección manual y no se debe afirmar que el texto quedó completamente anonimizado.

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

backend/
  app/
    main.py
  requirements.txt

evohacks-2-copilot/
  context/
    memory.md
```

Los archivos de frontend y backend se han creado vacíos intencionalmente. No contienen todavía lógica ni configuración ejecutable.

## Empaquetado y ejecución previstos

La entrega objetivo es una PWA disponible mediante un enlace HTTPS para facilitar que participantes y jueces de distintos lugares la prueben sin instalar un programa de escritorio. FastAPI puede servir el frontend y el endpoint de salud bajo el mismo origen; alternativamente, el frontend podría alojarse como sitio estático y el backend desplegarse por separado, siempre que el navegador no envíe texto sensible.

La instalación de una PWA y el service worker requieren un contexto seguro (normalmente HTTPS; `localhost` se permite para desarrollo). El manifiesto y el service worker están solo como archivos vacíos; todavía no habilitan instalación ni uso offline.

## Privacidad y seguridad del producto

- No integrar una API externa de IA para leer el texto.
- No enviar texto o fragmentos detectados a FastAPI.
- No persistir texto ni historial por defecto.
- Mantener cualquier relación temporal entre valores originales y etiquetas solo en memoria del navegador y ofrecer borrado explícito.
- No prometer detección exhaustiva ni protección absoluta.

## Contexto de la hackatón

El proyecto se alinea con el tema **Projects for Social Good** al promover un uso más consciente y privado de herramientas de IA. Para la entrega se deberá distinguir el trabajo realizado durante el evento, explicar las decisiones técnicas y acreditar los recursos externos que se incorporen.

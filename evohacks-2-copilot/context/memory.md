# Memoria del proyecto: Antes de enviar

- Producto: herramienta web de privacidad antes de compartir textos con IA, empresas o redes sociales.
- Público: estudiantes, trabajadores y público general; útil desde distintos países.
- Frontend: HTML, CSS y JavaScript nativo; aplicación de una sola página.
- El MVP detecta correos y posibles teléfonos en el navegador; permite añadir manualmente otras selecciones.
- Hallazgos revisables y reemplazos etiquetados; el usuario debe verificar el resultado.
- No se utiliza API externa de IA; el frontend no envía ni persiste el texto.
- El service worker cachea recursos estáticos, nunca el contenido del editor.
- FastAPI queda pospuesto y no recibe ni almacena textos.
- Sin cuentas, base de datos ni historial en el MVP.
- PWA por enlace HTTPS, con opción de instalación en navegadores compatibles.
- No prometer anonimización completa; los resultados son orientativos.
- El usuario necesita explicaciones claras en español sobre los cambios de HTML, CSS y JavaScript.

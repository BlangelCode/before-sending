// Traducciones y preferencias visuales; el almacenamiento nunca incluye texto del usuario.
window.AntesDeEnviar = window.AntesDeEnviar || {};
(function (app) {
const STORAGE_KEY = "antes-de-enviar.ui-preferences.v1";
const translations = {
  en: {
    title: "Before Sending",
    description: "Review and protect possible sensitive data before sharing text.",
    skipLink: "Skip to content",
    brandAria: "Before Sending home",
    workspaceAria: "Text review tool",
    privacyTitle: "Privacy stays local",
    privacyDetail: "Text is analyzed here",
    introEyebrow: "Pause before you share",
    introTitleFirst: "Your text.",
    introTitleSecond: "Your choice.",
    introCopy: "Review possible personal data and decide what to protect before sharing a message, a post, or a prompt with AI.",
    privacyNoteAria: "Privacy notice",
    privacyNote: "Analysis runs on this page. Text is not sent to a server or saved in a history. Results are suggestions: review them before sharing.",
    stepText: "YOUR TEXT",
    editorTitle: "What are you going to share?",
    analyzeButton: "Review text",
    sampleButton: "Try an example",
    sourceLabel: "Text you want to review",
    sourcePlaceholder: "Example: “My email is alex@example.com…”",
    clearButton: "Clear text",
    editorHelp: "Looks for IDs, names, phones, email, financial data, and addresses.",
    stepReview: "REVIEW",
    findingsTitle: "Possible sensitive data",
    findingsDescription: "Choose the fragments you want to replace. Uncheck any you want to keep.",
    emptyTitle: "Findings will appear here",
    emptyHelp: "Review some text to get started.",
    categoriesAria: "Detected data categories",
    groupedFindingsAria: "Findings grouped by type",
    manualNote: "See another sensitive detail? Select it in the text to add it manually.",
    addSelection: "+ Protect selection",
    protectSelected: "Protect checked items",
    stepResult: "PROTECTED TEXT",
    resultTitle: "Review before copying",
    changesApplied: "Changes applied",
    protectedTextLabel: "Text with sensitive data replaced",
    copyButton: "Copy text",
    disclaimer: "No detector finds everything. Check the text and the privacy policy of the service you will send it to.",
    clearDialogEyebrow: "Clear content",
    clearDialogTitle: "Clear the text and findings?",
    clearDialogDescription: "This removes the text from this page and cannot be undone.",
    cancelClear: "Keep reviewing",
    confirmClear: "Yes, clear everything",
    footerDisclaimer: "A support tool, not a guarantee of anonymization.",
    noscript: "Enable JavaScript to review and protect text on this page.",
    languageButton: "Español",
    languageButtonAria: "Switch language to Spanish",
    themeDarkButton: "Dark mode",
    themeLightButton: "Light mode",
    themeButtonAria: "Switch to {theme} theme",
    themeDarkName: "dark",
    themeLightName: "light",
    characterOne: "{count} character",
    characterMany: "{count} characters",
    jumpedToOccurrence: "The occurrence is selected in the original text.",
    findingRemoved: "Finding removed. Its text is selected; choose “Protect selection” to add it manually.",
    enterText: "Type or paste some text to get started.",
    noFindings: "No matches found with these rules. You can select a fragment manually.",
    analysisComplete: "Found {findings} possible items in {categories} categories. Review them before protecting the text.",
    selectFirst: "Select a fragment in the text first.",
    overlappingSelection: "The selected matches overlap other findings. Choose another fragment.",
    manualMatchesAdded: "Added {added} of {matches} matching fragments. You can uncheck individual occurrences.",
    markFinding: "Check at least one finding to protect it.",
    enterLabel: "Enter a replacement label for “{value}” before protecting it.",
    protectedReady: "Protected text is ready. Review it before copying.",
    copied: "Protected text copied to the clipboard.",
    clipboardUnavailable: "Clipboard access failed. The text is selected so you can copy it manually.",
    cleared: "Text, findings, and labels cleared from this page.",
    installUnavailable: "The app works, but install/offline support could not be enabled.",
    preferenceUnavailable: "This browser does not allow saving preferences here. Your choice will last for this session only.",
    categoryCount: "{values} values · {occurrences} occurrences",
    occurrenceOne: "{count} occurrence",
    occurrenceMany: "{count} occurrences",
    labelForValue: "Replacement label for “{value}”",
    labelPrivate: "[PRIVATE DATA]",
    labelCustom: "Custom label…",
    labelCustomForValue: "Custom label for {category} {value}",
    labelCustomPlaceholder: "Example: [CONTACT]…",
    labelAppliesToMarked: "The label applies to all checked occurrences of this value.",
    occurrencesAria: "Occurrences of {value}",
    replaceOccurrenceAria: "Replace occurrence {index} of {category}: {value}",
    occurrenceLabel: "Occurrence {index}",
    jumpOccurrenceAria: "Go to occurrence {index} of {value} in the text",
    removeFinding: "Remove",
    removeFindingAria: "Remove {category} finding: {value}",
    findingOne: "{count} finding",
    findingMany: "{count} findings",
    replacementSummaryEnd: "replaced. Each value used its configured label.",
    languageChanged: "Language changed to English.",
    themeChanged: "Theme changed to {theme}.",
    categories: {
      cedula: { title: "ID numbers", singular: "ID number", plural: "ID numbers", defaultLabel: "[ID]", description: "Detected by a V-/E- prefix, an identity label, or contextual SSN and driver's license formats." },
      nombreCompleto: { title: "Full names", singular: "full name", plural: "full names", defaultLabel: "[NAME]", description: "Detected near name phrases, roles such as “patient”, “applicant”, or “emergency contact”, and professional titles; heuristic only." },
      pasaporte: { title: "Passports", singular: "passport", plural: "passports", defaultLabel: "[PASSPORT]", description: "Detected when an alphanumeric number appears near “passport”." },
      rif: { title: "Tax IDs", singular: "tax ID", plural: "tax IDs", defaultLabel: "[TAX ID]", description: "Detected near a RIF or EIN label." },
      telefono: { title: "Phone numbers", singular: "phone number", plural: "phone numbers", defaultLabel: "[PHONE]", description: "Detected by an international prefix or nearby phone terms in English or Spanish." },
      correo: { title: "Email addresses", singular: "email address", plural: "email addresses", defaultLabel: "[EMAIL]", description: "Detected by an email address pattern." },
      cuenta: { title: "Bank accounts", singular: "bank account", plural: "bank accounts", defaultLabel: "[BANK ACCOUNT]", description: "Detected near account or bank-routing labels, not from isolated numbers." },
      tarjeta: { title: "Payment cards", singular: "payment card", plural: "payment cards", defaultLabel: "[CARD]", description: "Detected near a card label or supported brand such as Visa or American Express." },
      codigoSeguridad: { title: "Security codes", singular: "security code", plural: "security codes", defaultLabel: "[SECURITY CODE]", description: "Detected near CVV, CVC, CID, security code, or verification code labels." },
      ticket: { title: "Support tickets", singular: "support ticket", plural: "support tickets", defaultLabel: "[TICKET]", description: "Detected near “support ticket”." },
      planilla: { title: "Form codes", singular: "form code", plural: "form codes", defaultLabel: "[FORM CODE]", description: "Detected near a form-code label, not from isolated classroom codes." },
      direccionIp: { title: "IP addresses", singular: "IP address", plural: "IP addresses", defaultLabel: "[IP ADDRESS]", description: "Detected as a complete, valid IPv4 or IPv6 address." },
      direccion: { title: "Postal addresses", singular: "postal address", plural: "postal addresses", defaultLabel: "[ADDRESS]", description: "Detected near address clues or U.S. street, state, and ZIP formats." },
      otros: { title: "Other", singular: "other sensitive item", plural: "other sensitive items", defaultLabel: "[OTHER]", description: "Detected near birth-date, health, insurance, or internal-reference labels." },
      manual: { title: "Manual selection", singular: "fragment", plural: "fragments", defaultLabel: "[DATA]", description: "Text fragments you selected directly." },
    },
  },
  es: {
    title: "Before Sending",
    description: "Revisa y protege posibles datos sensibles antes de compartir texto.",
    skipLink: "Saltar al contenido",
    brandAria: "Before Sending, inicio",
    workspaceAria: "Herramienta de revisión de texto",
    privacyTitle: "Privacidad local",
    privacyDetail: "El texto se analiza aquí",
    introEyebrow: "Una pausa antes de compartir",
    introTitleFirst: "Tu texto.",
    introTitleSecond: "Tu decisión.",
    introCopy: "Revisa posibles datos personales y decide qué quieres proteger antes de compartir un mensaje, una publicación o una consulta con una IA.",
    privacyNoteAria: "Nota de privacidad",
    privacyNote: "El análisis se realiza en esta página. El texto no se envía a un servidor ni se guarda en un historial. Los resultados son orientativos: revísalos antes de compartir.",
    stepText: "TU TEXTO",
    editorTitle: "¿Qué vas a compartir?",
    analyzeButton: "Revisar texto",
    sampleButton: "Probar ejemplo",
    sourceLabel: "Texto que quieres revisar",
    sourcePlaceholder: "Ejemplo: «Mi correo es ana@ejemplo.com…»",
    clearButton: "Borrar texto",
    editorHelp: "Busca identificaciones, nombres, teléfonos, correos, datos financieros y direcciones.",
    stepReview: "REVISA",
    findingsTitle: "Posibles datos",
    findingsDescription: "Elige qué fragmentos quieres reemplazar. Puedes desmarcar los que quieras conservar.",
    emptyTitle: "Aquí aparecerán los hallazgos",
    emptyHelp: "Revisa un texto para empezar.",
    categoriesAria: "Categorías de datos detectados",
    groupedFindingsAria: "Hallazgos agrupados por tipo",
    manualNote: "¿Ves otro dato? Selecciónalo en el texto y podrás añadirlo manualmente.",
    addSelection: "+ Proteger selección",
    protectSelected: "Proteger los marcados",
    stepResult: "TEXTO PROTEGIDO",
    resultTitle: "Revísalo antes de copiar",
    changesApplied: "Cambios aplicados",
    protectedTextLabel: "Texto con los datos reemplazados",
    copyButton: "Copiar texto",
    disclaimer: "Ningún detector encuentra todo. Comprueba el texto y la política del servicio al que lo enviarás.",
    clearDialogEyebrow: "Borrar contenido",
    clearDialogTitle: "¿Borrar el texto y los hallazgos?",
    clearDialogDescription: "Esta acción elimina el texto de esta página y no se puede deshacer.",
    cancelClear: "Seguir revisando",
    confirmClear: "Sí, borrar todo",
    footerDisclaimer: "Una herramienta de apoyo, no una garantía de anonimización.",
    noscript: "Activa JavaScript para revisar y proteger el texto en esta página.",
    languageButton: "English",
    languageButtonAria: "Cambiar idioma a inglés",
    themeDarkButton: "Modo oscuro",
    themeLightButton: "Modo claro",
    themeButtonAria: "Cambiar al tema {theme}",
    themeDarkName: "oscuro",
    themeLightName: "claro",
    characterOne: "{count} carácter",
    characterMany: "{count} caracteres",
    jumpedToOccurrence: "La aparición está seleccionada en el texto original.",
    findingRemoved: "Hallazgo quitado. El fragmento está seleccionado; pulsa «+ Proteger selección» para añadirlo manualmente.",
    enterText: "Escribe o pega un texto para empezar.",
    noFindings: "No se encontraron coincidencias con estas reglas. Puedes seleccionar un fragmento manualmente.",
    analysisComplete: "Se encontraron {findings} posibles datos en {categories} categorías. Revísalos antes de proteger el texto.",
    selectFirst: "Selecciona primero un fragmento dentro del texto.",
    overlappingSelection: "Las coincidencias seleccionadas se cruzan con otros hallazgos. Elige otro fragmento.",
    manualMatchesAdded: "Se añadieron {added} de {matches} coincidencias con el mismo texto; puedes excluir apariciones individuales.",
    markFinding: "Marca al menos un hallazgo para protegerlo.",
    enterLabel: "Escribe una etiqueta para «{value}» antes de protegerlo.",
    protectedReady: "Texto protegido preparado. Revísalo antes de copiarlo.",
    copied: "Texto protegido copiado al portapapeles.",
    clipboardUnavailable: "No se pudo acceder al portapapeles. El texto quedó seleccionado para que lo copies manualmente.",
    cleared: "Texto, hallazgos y etiquetas borrados de esta página.",
    installUnavailable: "La aplicación funciona, pero no se pudo activar el modo instalable.",
    preferenceUnavailable: "Este navegador no permite guardar preferencias aquí. Tu elección durará solo esta sesión.",
    categoryCount: "{values} valores · {occurrences} apariciones",
    occurrenceOne: "{count} aparición",
    occurrenceMany: "{count} apariciones",
    labelForValue: "Etiqueta para «{value}»",
    labelPrivate: "[DATO PRIVADO]",
    labelCustom: "Etiqueta personalizada…",
    labelCustomForValue: "Etiqueta personalizada para {category} {value}",
    labelCustomPlaceholder: "Ejemplo: [CONTACTO]…",
    labelAppliesToMarked: "La etiqueta se aplica a todas las apariciones marcadas de este valor.",
    occurrencesAria: "Apariciones de {value}",
    replaceOccurrenceAria: "Reemplazar aparición {index} de {category}: {value}",
    occurrenceLabel: "Aparición {index}",
    jumpOccurrenceAria: "Ir a la aparición {index} de {value} en el texto",
    removeFinding: "Quitar",
    removeFindingAria: "Quitar hallazgo de {category}: {value}",
    findingOne: "{count} hallazgo",
    findingMany: "{count} hallazgos",
    replacementSummaryEnd: "reemplazados. Cada valor usó su etiqueta configurada.",
    languageChanged: "Idioma cambiado a español.",
    themeChanged: "Tema cambiado a {theme}.",
    categories: {
      cedula: { title: "Identificaciones", singular: "identificación", plural: "identificaciones", defaultLabel: "[IDENTIFICACIÓN]", description: "Se reconoce por un prefijo V-/E-, una etiqueta de identidad o formatos contextuales de SSN/licencia de conducir." },
      nombreCompleto: { title: "Nombres completos", singular: "nombre completo", plural: "nombres completos", defaultLabel: "[NOMBRE]", description: "Se reconoce junto a frases de nombre, roles como «aspirante» o etiquetas inglesas como «patient», «applicant» y «emergency contact», y títulos profesionales; la detección es orientativa." },
      pasaporte: { title: "Pasaportes", singular: "pasaporte", plural: "pasaportes", defaultLabel: "[PASAPORTE]", description: "Se reconoce cuando un número alfanumérico aparece junto a «pasaporte»." },
      rif: { title: "Identificadores fiscales", singular: "identificador fiscal", plural: "identificadores fiscales", defaultLabel: "[ID FISCAL]", description: "Se reconoce por el formato de RIF o EIN junto a su etiqueta." },
      telefono: { title: "Teléfonos", singular: "teléfono", plural: "teléfonos", defaultLabel: "[TELÉFONO]", description: "Se reconoce por un prefijo internacional o por términos telefónicos en español e inglés." },
      correo: { title: "Correos electrónicos", singular: "correo", plural: "correos", defaultLabel: "[CORREO]", description: "Se reconoce por un patrón de dirección de correo electrónico." },
      cuenta: { title: "Cuentas bancarias", singular: "cuenta bancaria", plural: "cuentas bancarias", defaultLabel: "[CUENTA BANCARIA]", description: "Se reconoce junto a etiquetas de cuenta, número de cuenta o ruta bancaria." },
      tarjeta: { title: "Tarjetas de pago", singular: "tarjeta", plural: "tarjetas", defaultLabel: "[TARJETA]", description: "Se reconoce junto a «tarjeta», Visa, Mastercard o American Express." },
      codigoSeguridad: { title: "Códigos de seguridad", singular: "código de seguridad", plural: "códigos de seguridad", defaultLabel: "[CÓDIGO]", description: "Se reconoce junto a CVV, CVC, CID o etiquetas de código de seguridad." },
      ticket: { title: "Tickets de soporte", singular: "ticket", plural: "tickets", defaultLabel: "[TICKET]", description: "Se reconoce junto a «ticket de soporte» o «support ticket»." },
      planilla: { title: "Códigos de planilla", singular: "código de planilla", plural: "códigos de planilla", defaultLabel: "[PLANILLA]", description: "Se reconoce junto a «código de planilla», no por códigos de aula aislados." },
      direccionIp: { title: "Direcciones IP", singular: "dirección IP", plural: "direcciones IP", defaultLabel: "[DIRECCIÓN IP]", description: "Se reconocen direcciones IPv4 e IPv6 completas y válidas." },
      direccion: { title: "Direcciones postales", singular: "dirección", plural: "direcciones", defaultLabel: "[DIRECCIÓN]", description: "Se reconoce por indicadores postales o por formatos de calle, estado y ZIP estadounidenses." },
      otros: { title: "Otros", singular: "otro dato sensible", plural: "otros datos sensibles", defaultLabel: "[OTRO DATO]", description: "Se reconoce junto a etiquetas de fecha de nacimiento, salud, seguro o referencias internas." },
      manual: { title: "Selección manual", singular: "fragmento", plural: "fragmentos", defaultLabel: "[DATO]", description: "Fragmentos que seleccionaste directamente en el texto." },
    },
  },
};

let preferences = { language: "en", theme: "light" };
let storageAvailable = true;

function isStorageAccessError(error) {
  return typeof DOMException !== "undefined"
    && error instanceof DOMException
    && ["SecurityError", "QuotaExceededError", "InvalidStateError"].includes(error.name);
}

function persistPreferences() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    if (!isStorageAccessError(error)) {
      throw error;
    }
    storageAvailable = false;
    return false;
  }
}

function initialize() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.language === "en" || parsed.language === "es")) {
          preferences.language = parsed.language;
        }
        if (parsed && (parsed.theme === "light" || parsed.theme === "dark")) {
          preferences.theme = parsed.theme;
        }
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
      }
    }
  } catch (error) {
    if (!isStorageAccessError(error)) {
      throw error;
    }
    storageAvailable = false;
  }
  document.documentElement.dataset.theme = preferences.theme;
  applyStaticTranslations();
  return storageAvailable;
}

function t(key, values = {}) {
  const dictionary = translations[preferences.language];
  const template = dictionary[key] ?? translations.en[key] ?? key;
  return template.replace(/\{([a-zA-Z]+)\}/g, (match, name) => (
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
  ));
}

function categoryInfo(category) {
  const base = app.config.CATEGORY_CONFIG[category];
  const localized = translations[preferences.language].categories[category];
  return { ...base, ...localized };
}

function applyStaticTranslations() {
  document.documentElement.lang = preferences.language;
  document.documentElement.dataset.theme = preferences.theme;
  document.title = t("title");
  document.querySelector('meta[name="description"]').content = t("description");
  document.querySelector('meta[name="theme-color"]').content = preferences.theme === "dark" ? "#17131e" : "#44206d";

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  }
}

function setLanguage(language) {
  if (language !== "en" && language !== "es") {
    throw new RangeError(`Unsupported language: ${language}`);
  }
  preferences.language = language;
  applyStaticTranslations();
  return persistPreferences();
}

function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    throw new RangeError(`Unsupported theme: ${theme}`);
  }
  preferences.theme = theme;
  document.documentElement.dataset.theme = theme;
  return persistPreferences();
}

app.i18n = {
  t,
  categoryInfo,
  initialize,
  setLanguage,
  setTheme,
  language: () => preferences.language,
  theme: () => preferences.theme,
  canPersist: () => storageAvailable,
};
})(window.AntesDeEnviar);

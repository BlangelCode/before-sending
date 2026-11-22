const sourceText = document.querySelector("#sourceText");
const categoryTabs = document.querySelector("#categoryTabs");
const findingGroups = document.querySelector("#findingGroups");
const emptyFindings = document.querySelector("#emptyFindings");
const findingCount = document.querySelector("#findingCount");
const characterCount = document.querySelector("#characterCount");
const analyzeButton = document.querySelector("#analyzeButton");
const addSelectionButton = document.querySelector("#addSelectionButton");
const protectButton = document.querySelector("#protectButton");
const sampleButton = document.querySelector("#sampleButton");
const clearButton = document.querySelector("#clearButton");
const clearDialog = document.querySelector("#clearDialog");
const cancelClearButton = document.querySelector("#cancelClearButton");
const confirmClearButton = document.querySelector("#confirmClearButton");
const resultSection = document.querySelector("#resultSection");
const protectedText = document.querySelector("#protectedText");
const replacementSummary = document.querySelector("#replacementSummary");
const copyButton = document.querySelector("#copyButton");
const pageMessage = document.querySelector("#pageMessage");

const CATEGORY_ORDER = [
  "cedula",
  "pasaporte",
  "rif",
  "telefono",
  "correo",
  "cuenta",
  "tarjeta",
  "codigoSeguridad",
  "ticket",
  "planilla",
  "direccionIp",
  "direccion",
  "manual",
];
const CATEGORY_CONFIG = {
  cedula: {
    title: "Cédulas",
    icon: "ID",
    singular: "cédula",
    plural: "cédulas",
    defaultLabel: "[CÉDULA]",
    description: "Se reconoce por un prefijo V-/E- o por una etiqueta de identidad cercana.",
  },
  pasaporte: {
    title: "Pasaportes",
    icon: "PAS",
    singular: "pasaporte",
    plural: "pasaportes",
    defaultLabel: "[PASAPORTE]",
    description: "Se reconoce cuando un número alfanumérico aparece junto a «pasaporte».",
  },
  rif: {
    title: "RIF",
    icon: "RIF",
    singular: "RIF",
    plural: "RIF",
    defaultLabel: "[RIF]",
    description: "Se reconoce por el prefijo fiscal junto a «RIF».",
  },
  telefono: {
    title: "Teléfonos",
    icon: "TEL",
    singular: "teléfono",
    plural: "teléfonos",
    defaultLabel: "[TELÉFONO]",
    description: "Se reconoce por un prefijo internacional o por términos como «teléfono» y «número de teléfono».",
  },
  correo: {
    title: "Correos electrónicos",
    icon: "@",
    singular: "correo",
    plural: "correos",
    defaultLabel: "[CORREO]",
    description: "Se reconoce por un patrón de dirección de correo electrónico.",
  },
  cuenta: {
    title: "Cuentas bancarias",
    icon: "CTA",
    singular: "cuenta bancaria",
    plural: "cuentas bancarias",
    defaultLabel: "[CUENTA BANCARIA]",
    description: "Se reconoce junto a «cuenta bancaria» o «account number», no por números aislados.",
  },
  tarjeta: {
    title: "Tarjetas de pago",
    icon: "TAR",
    singular: "tarjeta",
    plural: "tarjetas",
    defaultLabel: "[TARJETA]",
    description: "Se reconoce junto a «tarjeta», Visa, Mastercard u otra marca.",
  },
  codigoSeguridad: {
    title: "Códigos de seguridad",
    icon: "COD",
    singular: "código de seguridad",
    plural: "códigos de seguridad",
    defaultLabel: "[CÓDIGO]",
    description: "Se reconoce junto a CVV, código de seguridad o código de verificación; no como documento.",
  },
  ticket: {
    title: "Tickets de soporte",
    icon: "TKT",
    singular: "ticket",
    plural: "tickets",
    defaultLabel: "[TICKET]",
    description: "Se reconoce junto a «ticket de soporte» o «support ticket».",
  },
  planilla: {
    title: "Códigos de planilla",
    icon: "PLN",
    singular: "código de planilla",
    plural: "códigos de planilla",
    defaultLabel: "[PLANILLA]",
    description: "Se reconoce junto a «código de planilla», no por códigos de aula aislados.",
  },
  direccionIp: {
    title: "Direcciones IP",
    icon: "IP",
    singular: "dirección IP",
    plural: "direcciones IP",
    defaultLabel: "[DIRECCIÓN IP]",
    description: "Se reconoce una dirección IPv4 completa y válida.",
  },
  direccion: {
    title: "Direcciones postales",
    icon: "DIR",
    singular: "dirección",
    plural: "direcciones",
    defaultLabel: "[DIRECCIÓN]",
    description: "Se reconoce junto a palabras como «calle», «avenida» o «domicilio».",
  },
  manual: {
    title: "Selección manual",
    icon: "…",
    singular: "fragmento",
    plural: "fragmentos",
    defaultLabel: "[DATO]",
    description: "Fragmentos que seleccionaste directamente en el texto.",
  },
};

const ID_CONTEXT_PATTERN = /(?:\bc[eé]dula\b|\bc\.?\s*i\.?(?=\s|:|#|-)|\bd\.?\s*n\.?\s*i\.?(?=\s|:|#|-)|\bnie\b|\bcurp\b|\bdocumento(?:\s+nacional)?\s+de\s+identidad\b|\bn[uú]mero\s+de\s+(?:identidad|documento|identificaci[oó]n)\b|\bnational\s+(?:id|identity|identification)(?:\s+(?:number|no\.?))?\b|\bidentity\s+(?:card|document|number)\b|\bidentification\s+(?:card|number|no\.?)\b|\bid\s*(?:number|no\.?)\b)\s*(?:n[uú]mero|no\.?)?\s*(?:es|is)?\s*[:#-]?\s*([VE]?[ \t.-]*\d(?:[\d \t.-]{3,}\d))/gi;
const VENEZUELAN_ID_PATTERN = /(?:^|[^\w])([VE][ \t.-]*\d(?:[\d \t.-]{3,}\d))/gi;
const PASSPORT_PATTERN = /\b(?:pasaporte|passport)(?:\s+(?:n[uú]mero|no\.?|number))?\s*[:#-]?\s*([A-Z]{0,2}\d[A-Z0-9-]{5,14})\b/gi;
const RIF_PATTERN = /\bRIF\s*(?:n[uú]mero|no\.?)?\s*[:#-]?\s*([JVEGPC]-?\d{7,9}-?\d)\b/gi;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const INTERNATIONAL_PHONE_PATTERN = /(?:\+\d{1,3}|00\d{1,3})[ \t().-]*\d(?:[\d(). \t-]*\d)/g;
const CONTEXTUAL_PHONE_PATTERN = /\b(?:(?:tel[eé]fono|tel\.?|celular|m[oó]vil|phone|mobile|cell(?:ular)?)(?:\s+(?:anterior|nuevo|alterno|principal|fijo|de\s+oficina|de\s+contacto))?\s*(?:n[uú]mero|no\.?|#)?|(?:n[uú]mero|no\.?)\s+(?:de\s+)?(?:tel[eé]fono|tel\.?|celular|m[oó]vil|phone|mobile|cell(?:ular)?))\s*(?:es|is)?[\s(:#-]*(\+?\d[\d(). \t-]{5,}\d)/gi;
const BANK_ACCOUNT_PATTERN = /\b(?:cuenta(?:\s+(?:bancaria|corriente|de\s+ahorros|de\s+banco))?|account(?:\s+number)?)\s*(?:(?:n[uú]mero|no\.?|#)\s*)?[:#-]?\s*(\d(?:[\d \t.-]{8,}\d))/gi;
const PAYMENT_CARD_PATTERN = /\b(?:tarjeta(?:\s+(?:de\s+)?(?:cr[eé]dito|d[eé]bito))?(?:\s+(?:visa|mastercard|amex))?|visa|mastercard|amex)\s*(?:(?:n[uú]mero|no\.?|#)\s*)?[:#-]?\s*(\d(?:[\d \t-]{11,26}\d))/gi;
const SECURITY_CODE_PATTERN = /\b(?:cvv|cvc|c[oó]digo\s+(?:de\s+)?(?:seguridad|verificaci[oó]n)|security\s+code|verification\s+code)\s*(?:temporal\s*)?(?:es|is|:|#|-)?\s*(\d{3,8})\b/gi;
const SUPPORT_TICKET_PATTERN = /\b(?:ticket(?:\s+de\s+soporte)?|support\s+ticket)\s*(?:n[uú]mero|no\.?|#)?\s*[:#-]?\s*(#?[A-Z0-9-]{5,})\b/gi;
const FORM_CODE_PATTERN = /\b(?:c[oó]digo|n[uú]mero|identificador)\s+de\s+planilla\s*(?:n[uú]mero|no\.?)?\s*[:#-]?\s*(#?[A-Z0-9-]{4,})\b/gi;
const IPV4_PATTERN = /(?:^|[^\d.])(((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))(?![\d.])/g;
const POSTAL_LANDMARK_PATTERN = /\b(?:calle|cll\.?|avenida|av\.?|urbanizaci[oó]n|urb\.?|sector|residencia|res\.?|edificio|edif\.?|apartamento|apto\.?|piso|casa|quinta|carrera|carr\.?|street|avenue|road|postal\s+code|c[oó]digo\s+postal)\b\.?\s*/gi;
const DEMO_TEXT = "C.I. V-16.731.908; pasaporte A7392014; tel. 0414-5550198; ana@example.com; cuenta 0105-0072-19-3008412590; tarjeta Visa 4111-1111-1111-1111, CVV 918; ticket #883920; IP 192.168.1.10; Calle 5, Valencia.";

let findings = [];
let nextFindingId = 0;
let activeCategory = null;
const labelSettings = new Map();

function showMessage(message, kind = "info") {
  pageMessage.textContent = message;
  pageMessage.dataset.kind = kind;
}

function hideProtectedResult() {
  resultSection.hidden = true;
  protectedText.value = "";
  replacementSummary.textContent = "";
}

function resetResults() {
  findings = [];
  activeCategory = null;
  categoryTabs.replaceChildren();
  categoryTabs.hidden = true;
  findingGroups.replaceChildren();
  findingCount.textContent = "0";
  emptyFindings.hidden = false;
  addSelectionButton.disabled = true;
  protectButton.disabled = true;
  hideProtectedResult();
}

function updateCharacterCount() {
  const count = sourceText.value.length;
  characterCount.textContent = `${count.toLocaleString("es")} ${count === 1 ? "carácter" : "caracteres"}`;
}

function getOccurrenceContext(finding) {
  const contextRadius = 42;
  const start = Math.max(0, finding.start - contextRadius);
  const end = Math.min(sourceText.value.length, finding.end + contextRadius);
  const before = sourceText.value.slice(start, finding.start).replace(/\s+/g, " ").trim();
  const after = sourceText.value.slice(finding.end, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "… " : ""}${before} «${finding.value}» ${after}${end < sourceText.value.length ? " …" : ""}`.trim();
}

function jumpToFinding(finding) {
  sourceText.focus();
  sourceText.setSelectionRange(finding.start, finding.end);
  sourceText.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "center",
  });
  showMessage("La aparición está seleccionada en el texto original.");
}

function getCaptureRange(match, capture, text) {
  const rawValue = match[capture];
  if (!rawValue) {
    return null;
  }

  const value = rawValue.trim();
  const offset = match[0].indexOf(rawValue) + rawValue.indexOf(value);
  const start = match.index + offset;
  return { value, start, end: start + value.length };
}

function countDigits(value) {
  return value.replace(/\D/g, "").length;
}

function normalizeFindingValue(value) {
  return value.normalize("NFC").toLocaleLowerCase("es");
}

function getPostalAddressEnd(text, start) {
  const maximumEnd = Math.min(text.length, start + 220);
  const fragment = text.slice(start, maximumEnd);
  let end = fragment.length;
  const stopPatterns = [
    /[,;]?\s+\b(?:hacia|desde donde|before|and then|al tel[eé]fono|o al correo|para el per[ií]odo)\b/i,
    /,\s+(?:y\s+)?se\s+(?:indic|traslad|registr)/i,
  ];

  for (const pattern of stopPatterns) {
    const match = pattern.exec(fragment);
    if (match && match.index < end) {
      end = match.index;
    }
  }

  for (let index = 0; index < end; index += 1) {
    const character = fragment[index];
    if (character === ";" || character === "\r" || character === "\n") {
      end = index;
      break;
    }
    if (character === ".") {
      const previousWord = fragment.slice(0, index).match(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)$/)?.[1];
      if (!previousWord || !/^(?:urb|av|edif|apto|apt|res|nro|no)$/i.test(previousWord)) {
        end = index;
        break;
      }
    }
  }

  while (end > 0 && /[\s,]+/.test(fragment[end - 1])) {
    end -= 1;
  }
  return start + end;
}

function addPatternCandidates(candidates, text, pattern, category, reason, priority, options = {}) {
  const capture = options.capture ?? 1;
  for (const match of text.matchAll(pattern)) {
    const range = getCaptureRange(match, capture, text);
    if (!range || (options.validate && !options.validate(range.value))) {
      continue;
    }
    candidates.push({ ...range, category, reason, priority });
  }
}

function isValidPhoneNumber(value) {
  let digits = value.replace(/\D/g, "");
  const isInternational = value.startsWith("+") || value.startsWith("00");
  if (value.startsWith("00")) {
    digits = digits.slice(2);
  }

  const minimumLength = isInternational ? 8 : 7;
  return digits.length >= minimumLength
    && digits.length <= 15
    && (!isInternational || digits[0] !== "0");
}

function addFinding(category, value, start, end, reason) {
  if (start >= end) {
    return false;
  }

  const overlaps = findings.some((finding) => start < finding.end && end > finding.start);
  if (overlaps) {
    return false;
  }

  findings.push({
    id: nextFindingId++,
    category,
    value,
    start,
    end,
    reason,
    checked: true,
  });
  return true;
}

function collectFindings(text) {
  const candidates = [];

  addPatternCandidates(candidates, text, IPV4_PATTERN, "direccionIp", "Formato IPv4", 0);

  for (const match of text.matchAll(ID_CONTEXT_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && countDigits(range.value) >= 5 && countDigits(range.value) <= 18) {
      candidates.push({ ...range, category: "cedula", reason: "Contexto de identificación", priority: 0 });
    }
  }

  for (const match of text.matchAll(VENEZUELAN_ID_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && countDigits(range.value) >= 5 && countDigits(range.value) <= 10) {
      candidates.push({ ...range, category: "cedula", reason: "Prefijo de cédula venezolana", priority: 0 });
    }
  }

  addPatternCandidates(candidates, text, PASSPORT_PATTERN, "pasaporte", "Contexto de pasaporte", 0, {
    validate: (value) => /[A-Z]/i.test(value) && /\d/.test(value),
  });
  addPatternCandidates(candidates, text, RIF_PATTERN, "rif", "Contexto de RIF", 0);
  addPatternCandidates(candidates, text, EMAIL_PATTERN, "correo", "Formato de correo electrónico", 1, { capture: 0 });
  addPatternCandidates(candidates, text, BANK_ACCOUNT_PATTERN, "cuenta", "Contexto de cuenta bancaria", 0, {
    validate: (value) => countDigits(value) >= 12 && countDigits(value) <= 24,
  });
  addPatternCandidates(candidates, text, PAYMENT_CARD_PATTERN, "tarjeta", "Contexto de tarjeta de pago", 0, {
    validate: (value) => countDigits(value) >= 13 && countDigits(value) <= 19,
  });
  addPatternCandidates(candidates, text, SECURITY_CODE_PATTERN, "codigoSeguridad", "Contexto de código de seguridad", 0);
  addPatternCandidates(candidates, text, SUPPORT_TICKET_PATTERN, "ticket", "Contexto de ticket de soporte", 0);
  addPatternCandidates(candidates, text, FORM_CODE_PATTERN, "planilla", "Contexto de código de planilla", 0);

  for (const match of text.matchAll(INTERNATIONAL_PHONE_PATTERN)) {
    if (isValidPhoneNumber(match[0])) {
      candidates.push({
        value: match[0].trim(),
        start: match.index,
        end: match.index + match[0].length,
        category: "telefono",
        reason: "Prefijo internacional",
        priority: 2,
      });
    }
  }

  for (const match of text.matchAll(CONTEXTUAL_PHONE_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && isValidPhoneNumber(range.value)) {
      candidates.push({ ...range, category: "telefono", reason: "Palabra de contexto telefónico", priority: 2 });
    }
  }

  for (const match of text.matchAll(POSTAL_LANDMARK_PATTERN)) {
    const start = match.index;
    const end = getPostalAddressEnd(text, start);
    const value = text.slice(start, end).trim();
    if (value.length < 6 || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value)) {
      continue;
    }
    candidates.push({
      value,
      start,
      end: start + value.length,
      category: "direccion",
      reason: "Contexto de dirección postal",
      priority: 4,
    });
  }

  candidates.sort((first, second) => first.priority - second.priority
    || first.start - second.start
    || second.end - first.end);
  for (const candidate of candidates) {
    addFinding(
      candidate.category,
      candidate.value,
      candidate.start,
      candidate.end,
      candidate.reason,
    );
  }

  findings.sort((first, second) => first.start - second.start);
}

function getLabelSettingsKey(category, value) {
  return JSON.stringify([category, normalizeFindingValue(value)]);
}

function getLabelSettings(category, value) {
  const key = getLabelSettingsKey(category, value);
  if (!labelSettings.has(key)) {
    labelSettings.set(key, { preset: "default", custom: "" });
  }
  return labelSettings.get(key);
}

function groupByValue(categoryFindings) {
  const groups = new Map();
  for (const finding of categoryFindings) {
    const key = normalizeFindingValue(finding.value);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(finding);
  }
  return [...groups.values()];
}

function createCategoryGroup(category, valueGroups) {
  const config = CATEGORY_CONFIG[category];
  const occurrenceCount = valueGroups.reduce((count, group) => count + group.length, 0);
  const section = document.createElement("section");
  section.className = "category-group";
  section.id = `panel-${category}`;
  section.setAttribute("role", "tabpanel");
  section.setAttribute("aria-labelledby", `tab-${category}`);
  section.tabIndex = 0;
  section.hidden = category !== activeCategory;

  const heading = document.createElement("div");
  heading.className = "category-heading";

  const titleRow = document.createElement("div");
  titleRow.className = "category-title-row";

  const icon = document.createElement("span");
  icon.className = "category-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = config.icon;

  const title = document.createElement("h3");
  title.id = `category-title-${category}`;
  title.textContent = config.title;
  titleRow.append(icon, title);

  const count = document.createElement("span");
  count.className = "category-count";
  count.textContent = `${valueGroups.length} ${valueGroups.length === 1 ? "valor" : "valores"} · ${occurrenceCount} ${occurrenceCount === 1 ? "aparición" : "apariciones"}`;
  heading.append(titleRow, count);

  const description = document.createElement("p");
  description.className = "category-description";
  description.textContent = config.description;

  const values = document.createElement("div");
  values.className = "value-groups";

  for (const [groupIndex, valueGroup] of valueGroups.entries()) {
    const valueCard = document.createElement("article");
    valueCard.className = "value-group";
    const defaultLabel = config.defaultLabel.replace(/\]$/, `_${groupIndex + 1}]`);

    const valueHeading = document.createElement("div");
    valueHeading.className = "value-heading";

    const value = document.createElement("span");
    value.className = "finding-value";
    value.textContent = valueGroup[0].value;

    const occurrences = document.createElement("span");
    occurrences.className = "occurrence-count";
    occurrences.textContent = `${valueGroup.length} ${valueGroup.length === 1 ? "aparición" : "apariciones"}`;
    valueHeading.append(value, occurrences);

    const settings = getLabelSettings(category, valueGroup[0].value);
    settings.defaultLabel = defaultLabel;
    const control = document.createElement("div");
    control.className = "category-label-control";

    const selectId = `replacement-${category}-${groupIndex}`;
    const selectLabel = document.createElement("label");
    selectLabel.htmlFor = selectId;
    selectLabel.textContent = `Etiqueta para «${valueGroup[0].value}»`;

    const select = document.createElement("select");
    select.id = selectId;
    select.name = selectId;
    select.setAttribute("autocomplete", "off");

    const presets = [
      { value: "default", text: defaultLabel },
      { value: "private", text: "[DATO PRIVADO]" },
      { value: "custom", text: "Etiqueta personalizada…" },
    ];
    for (const preset of presets) {
      const option = document.createElement("option");
      option.value = preset.value;
      option.textContent = preset.text;
      select.append(option);
    }
    select.value = settings.preset;

    const customId = `custom-replacement-${category}-${groupIndex}`;
    const customLabel = document.createElement("label");
    customLabel.className = "sr-only";
    customLabel.htmlFor = customId;
    customLabel.textContent = `Etiqueta personalizada para ${config.singular} ${valueGroup[0].value}`;

    const customInput = document.createElement("input");
    customInput.id = customId;
    customInput.name = `${customId}-value`;
    customInput.type = "text";
    customInput.autocomplete = "off";
    customInput.dataset.settingKey = getLabelSettingsKey(category, valueGroup[0].value);
    customInput.maxLength = 40;
    customInput.placeholder = "Ejemplo: [CONTACTO]…";
    customInput.value = settings.custom;
    customInput.hidden = settings.preset !== "custom";

    const helper = document.createElement("small");
    helper.textContent = "La etiqueta se aplica a todas las apariciones marcadas de este valor.";

    select.addEventListener("change", () => {
      settings.preset = select.value;
      customInput.hidden = settings.preset !== "custom";
      hideProtectedResult();
      if (!customInput.hidden) {
        customInput.focus();
      }
    });

    customInput.addEventListener("input", () => {
      settings.custom = customInput.value;
      hideProtectedResult();
    });

    control.append(selectLabel, select, customLabel, customInput, helper);

    const list = document.createElement("ul");
    list.className = "finding-items";
    list.setAttribute("aria-label", `Apariciones de ${valueGroup[0].value}`);

    for (const [occurrenceIndex, finding] of valueGroup.entries()) {
      const item = document.createElement("li");
      item.className = "finding-item";

      const label = document.createElement("label");
      label.className = "finding-check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `finding-${finding.id}`;
      checkbox.name = `finding-${category}-${groupIndex}`;
      checkbox.checked = finding.checked;
      checkbox.setAttribute(
        "aria-label",
        `Reemplazar aparición ${occurrenceIndex + 1} de ${config.singular}: ${finding.value}`,
      );
      checkbox.addEventListener("change", () => {
        finding.checked = checkbox.checked;
        hideProtectedResult();
        updateProtectButton();
      });

      const occurrenceContent = document.createElement("span");
      occurrenceContent.className = "occurrence-content";
      const occurrenceLabel = document.createElement("span");
      occurrenceLabel.className = "occurrence-label";
      occurrenceLabel.textContent = `Aparición ${occurrenceIndex + 1}`;
      const context = document.createElement("span");
      context.className = "occurrence-context";
      context.textContent = getOccurrenceContext(finding);
      occurrenceContent.append(occurrenceLabel, context);

      label.append(checkbox, occurrenceContent);

      const jumpButton = document.createElement("button");
      jumpButton.className = "jump-button";
      jumpButton.type = "button";
      jumpButton.setAttribute(
        "aria-label",
        `Ir a la aparición ${occurrenceIndex + 1} de ${finding.value} en el texto`,
      );
      jumpButton.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.2 3.2H3.5v4.7M3.8 3.5l5 5M11.8 16.8h4.7v-4.7M16.5 16.5l-5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      jumpButton.addEventListener("click", () => jumpToFinding(finding));

      item.append(label, jumpButton);
      list.append(item);
    }

    valueCard.append(valueHeading, control, list);
    values.append(valueCard);
  }

  section.append(heading, description, values);
  return section;
}

function activateCategory(category, focusTab = false) {
  if (!CATEGORY_ORDER.includes(category)) {
    return;
  }

  activeCategory = category;
  for (const tab of categoryTabs.querySelectorAll('[role="tab"]')) {
    const isActive = tab.dataset.category === category;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive) {
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      if (focusTab) {
        tab.focus();
      }
    }
  }

  for (const panel of findingGroups.querySelectorAll('[role="tabpanel"]')) {
    panel.hidden = panel.id !== `panel-${category}`;
  }
}

function handleCategoryTabKeydown(event, category) {
  const tabs = [...categoryTabs.querySelectorAll('[role="tab"]')];
  const currentIndex = tabs.findIndex((tab) => tab.dataset.category === category);
  let nextIndex = currentIndex;

  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  activateCategory(tabs[nextIndex].dataset.category, true);
}

function renderFindings() {
  const categories = CATEGORY_ORDER
    .map((category) => ({
      category,
      categoryFindings: findings.filter((finding) => finding.category === category),
    }))
    .filter(({ categoryFindings }) => categoryFindings.length > 0);
  const availableCategories = new Set(categories.map(({ category }) => category));
  if (!availableCategories.has(activeCategory)) {
    activeCategory = categories[0]?.category ?? null;
  }

  categoryTabs.replaceChildren();
  categoryTabs.hidden = categories.length === 0;
  findingGroups.replaceChildren();
  findingCount.textContent = String(findings.length);
  emptyFindings.hidden = findings.length > 0;

  for (const { category, categoryFindings } of categories) {
    const tab = document.createElement("button");
    tab.id = `tab-${category}`;
    tab.className = "category-tab";
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `panel-${category}`);
    tab.setAttribute("aria-selected", String(category === activeCategory));
    tab.tabIndex = category === activeCategory ? 0 : -1;
    tab.dataset.category = category;
    tab.addEventListener("click", () => activateCategory(category));
    tab.addEventListener("keydown", (event) => handleCategoryTabKeydown(event, category));

    const title = document.createElement("span");
    title.className = "category-tab-title";
    title.textContent = CATEGORY_CONFIG[category].title;
    const count = document.createElement("span");
    count.className = "category-tab-count";
    count.textContent = String(categoryFindings.length);
    count.setAttribute("aria-label", `${categoryFindings.length} ${categoryFindings.length === 1 ? "hallazgo" : "hallazgos"}`);
    tab.append(title, count);
    categoryTabs.append(tab);

    findingGroups.append(createCategoryGroup(category, groupByValue(categoryFindings)));
  }

  if (activeCategory) {
    activateCategory(activeCategory);
  }
  addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
  updateProtectButton();
}

function updateProtectButton() {
  protectButton.disabled = !findings.some((finding) => finding.checked);
}

function analyzeText() {
  resetResults();
  showMessage("");

  if (!sourceText.value.trim()) {
    showMessage("Escribe o pega un texto para empezar.", "warning");
    sourceText.focus();
    return;
  }

  collectFindings(sourceText.value);
  renderFindings();

  if (findings.length === 0) {
    showMessage("No se encontraron coincidencias con estas reglas. Puedes seleccionar un fragmento manualmente.");
  } else {
    showMessage(`Se encontraron ${findings.length} posibles datos en ${new Set(findings.map((item) => item.category)).size} categorías. Revísalos antes de proteger el texto.`);
  }
}

function addManualSelection() {
  const start = sourceText.selectionStart;
  const end = sourceText.selectionEnd;
  const selectedText = sourceText.value.slice(start, end);

  if (start === end || !selectedText.trim()) {
    showMessage("Selecciona primero un fragmento dentro del texto.", "warning");
    sourceText.focus();
    return;
  }

  const repeatedValuePattern = new RegExp(selectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
  let addedCount = 0;
  let matchCount = 0;
  for (const match of sourceText.value.matchAll(repeatedValuePattern)) {
    matchCount += 1;
    if (addFinding("manual", match[0], match.index, match.index + match[0].length, "Selección manual")) {
      addedCount += 1;
    }
  }

  if (addedCount === 0) {
    showMessage("Las coincidencias seleccionadas se cruzan con otros hallazgos. Elige otro fragmento.", "warning");
    return;
  }

  findings.sort((first, second) => first.start - second.start);
  activeCategory = "manual";
  hideProtectedResult();
  renderFindings();
  showMessage(`Se añadieron ${addedCount} de ${matchCount} coincidencias con el mismo texto; puedes excluir apariciones individuales.`);
}

function getReplacementLabel(finding) {
  const config = CATEGORY_CONFIG[finding.category];
  const settings = getLabelSettings(finding.category, finding.value);
  if (settings.preset === "private") {
    return "[DATO PRIVADO]";
  }
  if (settings.preset === "custom") {
    return settings.custom.trim().replace(/[\r\n]+/g, " ").slice(0, 40);
  }
  return settings.defaultLabel || config.defaultLabel;
}

function protectSelectedFindings() {
  const selected = findings
    .filter((finding) => finding.checked)
    .sort((first, second) => first.start - second.start);

  if (selected.length === 0) {
    showMessage("Marca al menos un hallazgo para protegerlo.", "warning");
    return;
  }

  const replacementsByValue = new Map();
  for (const finding of selected) {
    const settingKey = getLabelSettingsKey(finding.category, finding.value);
    if (!replacementsByValue.has(settingKey)) {
      const replacement = getReplacementLabel(finding);
      if (!replacement) {
        const customInput = [...findingGroups.querySelectorAll(".category-label-control input")]
          .find((input) => input.dataset.settingKey === settingKey);
        showMessage(`Escribe una etiqueta para «${finding.value}» antes de protegerlo.`, "warning");
        customInput?.focus();
        return;
      }
      replacementsByValue.set(settingKey, replacement);
    }
  }

  let result = sourceText.value;
  const replacements = selected
    .map((finding) => ({
      ...finding,
      replacement: replacementsByValue.get(getLabelSettingsKey(finding.category, finding.value)),
    }))
    .sort((first, second) => second.start - first.start);

  for (const finding of replacements) {
    result = `${result.slice(0, finding.start)}${finding.replacement}${result.slice(finding.end)}`;
  }

  protectedText.value = result;
  const counts = new Map();
  for (const finding of selected) {
    counts.set(finding.category, (counts.get(finding.category) || 0) + 1);
  }
  replacementSummary.textContent = [...counts]
    .map(([category, count]) => `${count} ${count === 1 ? CATEGORY_CONFIG[category].singular : CATEGORY_CONFIG[category].plural}`)
    .join(", ") + " reemplazados. Cada valor usó su etiqueta configurada.";
  resultSection.hidden = false;
  showMessage("Texto protegido preparado. Revísalo antes de copiarlo.");
  resultSection.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "nearest",
  });
}

async function copyProtectedText() {
  try {
    await navigator.clipboard.writeText(protectedText.value);
    showMessage("Texto protegido copiado al portapapeles.");
  } catch {
    protectedText.focus();
    protectedText.select();
    showMessage("No se pudo acceder al portapapeles. El texto quedó seleccionado para que lo copies manualmente.", "warning");
  }
}

function clearSession() {
  sourceText.value = "";
  labelSettings.clear();
  resetResults();
  updateCharacterCount();
  showMessage("Texto, hallazgos y etiquetas borrados de esta página.");
  sourceText.focus();
}

sourceText.addEventListener("input", () => {
  updateCharacterCount();
  resetResults();
  showMessage("");
});

sourceText.addEventListener("mouseup", () => {
  addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
});

sourceText.addEventListener("keyup", () => {
  addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
});

analyzeButton.addEventListener("click", analyzeText);
addSelectionButton.addEventListener("click", addManualSelection);
protectButton.addEventListener("click", protectSelectedFindings);
clearButton.addEventListener("click", () => clearDialog.showModal());
cancelClearButton.addEventListener("click", () => clearDialog.close());
confirmClearButton.addEventListener("click", () => {
  clearDialog.close();
  clearSession();
});
copyButton.addEventListener("click", copyProtectedText);

sampleButton.addEventListener("click", () => {
  sourceText.value = DEMO_TEXT;
  updateCharacterCount();
  analyzeText();
  sourceText.focus();
});

document.addEventListener("selectionchange", () => {
  if (document.activeElement === sourceText) {
    addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
  }
});

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(() => showMessage("La aplicación funciona, pero no se pudo activar el modo instalable.", "warning"));
  });
}

updateCharacterCount();

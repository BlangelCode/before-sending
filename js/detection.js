// Analiza el texto localmente y devuelve rangos sin modificar el estado de la interfaz.
window.AntesDeEnviar = window.AntesDeEnviar || {};
(function (app) {
const ID_CONTEXT_PATTERN = /(?:\bc[eé]dula\b|\bc\.?\s*i\.?(?=\s|:|#|-)|\bd\.?\s*n\.?\s*i\.?(?=\s|:|#|-)|\bnie\b|\bcurp\b|\bdocumento(?:\s+nacional)?\s+de\s+identidad\b|\bn[uú]mero\s+de\s+(?:identidad|documento|identificaci[oó]n)\b|\bnational\s+(?:id|identity|identification)(?:\s+(?:number|no\.?))?\b|\bidentity\s+(?:card|document|number)\b|\bidentification\s+(?:card|number|no\.?)\b|\bid\s*(?:number|no\.?)\b)\s*(?:n[uú]mero|no\.?)?\s*(?:es|is)?\s*[:#-]?\s*([VE]?[ \t.-]*\d(?:[\d \t.-]{3,}\d))/gi;
const VENEZUELAN_ID_PATTERN = /(?:^|[^\w])([VE][ \t.-]*\d(?:[\d \t.-]{3,}\d))/gi;
const SOCIAL_SECURITY_PATTERN = /\b(?:(?:ssn|social\s+security(?:\s+number)?)(?:\s+(?:number|no\.?))?\s*[:#-]?\s*)?(\d{3}[- ]\d{2}[- ]\d{4})\b/gi;
const DRIVER_LICENSE_PATTERN = /\b(?:driver(?:['’]s)?\s+(?:license|licence)|state\s+id(?:entification)?(?:\s+(?:number|no\.?))?)\s*(?:(?:number|no\.?)\s*)?[:#-]?\s*([A-Z0-9][A-Z0-9-]{4,19})\b/gi;
// Los nombres requieren una pista semántica; no se infieren solo por las mayúsculas.
const FULL_NAME_CONTEXT_PATTERN = /\b(?:me\s+llamo|mi\s+nombre(?:\s+completo)?\s+es|nombre\s+completo(?:\s+de)?|nombre|representante\s+legal|aspirante|patient|applicant|emergency\s+contact|titular|senior\s+legal\s+counsel|legal\s+counsel|counsel|lic(?:enciado|enciada)?\.?|ing(?:eniero|eniera)?\.?|dra?\.?|prof(?:esor|esora)?\.?)\s*[:#-]?\s*/gi;
const FULL_NAME_VALUE_PATTERN = /^([A-ZÁÉÍÓÚÜÑ](?:[A-ZÁÉÍÓÚÜÑ]*[a-záéíóúüñ]+|[A-ZÁÉÍÓÚÜÑ]+)(?:['’-][A-ZÁÉÍÓÚÜÑ]?(?:[a-záéíóúüñ]+|[A-ZÁÉÍÓÚÜÑ]+))?(?:[ \t]+(?:(?:de|del|la|las|los|y)[ \t]+){0,2}[A-ZÁÉÍÓÚÜÑ](?:[A-ZÁÉÍÓÚÜÑ]*[a-záéíóúüñ]+|[A-ZÁÉÍÓÚÜÑ]+)(?:['’-][A-ZÁÉÍÓÚÜÑ]?(?:[a-záéíóúüñ]+|[A-ZÁÉÍÓÚÜÑ]+))?){1,3})\b/;
const PASSPORT_PATTERN = /\b(?:pasaporte|passport)(?:\s+(?:n[uú]mero|no\.?|number))?\s*[:#-]?\s*([A-Z]{0,2}\d[A-Z0-9-]{5,14})\b/gi;
const RIF_PATTERN = /\bRIF\s*(?:n[uú]mero|no\.?)?\s*[:#-]?\s*([JVEGPC]-?\d{7,9}-?\d)\b/gi;
const EMPLOYER_TAX_ID_PATTERN = /\b(?:EIN|FEIN|employer\s+identification(?:\s+number)?)\s*(?:no\.?|number)?\s*[:#-]?\s*(\d{2}-\d{7})\b/gi;
const DATE_OF_BIRTH_PATTERN = /\b(?:DOB|date\s+of\s+birth|birth\s+date|born\s+on|fecha\s+de\s+nacimiento)\s*(?:is|es|:|#|-)?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/gi;
const NPI_PATTERN = /\bNPI(?:\s+(?:number|no\.?))?\s*[:#-]?\s*(\d{10})\b/gi;
const INSURANCE_ID_PATTERN = /\b(?:(?:insurance|health)\s+)?(?:policy|member|group)(?:\s+(?:id|number|no\.?))?\s*#?\s*[:=-]?\s*([A-Z0-9][A-Z0-9-]{4,})\b/gi;
const MEDICAL_CODE_PATTERN = /\bICD[- ]?10\s+(?:diagnosis\s+)?code\s*[:#-]?\s*([A-Z]\d{2}(?:\.\d{1,4})?)\b/gi;
const ENCOUNTER_ID_PATTERN = /\b(?:encounter|case)\s+ID\s*[:#-]?\s*(#?[A-Z0-9-]{4,})\b/gi;
const BANK_TRANSACTION_ID_PATTERN = /\b(?:(?:bank\s+)?transaction(?:\s+(?:number|id|no\.?))|n[uú]mero\s+de\s+operaci[oó]n\s+bancaria)\s*[:#-]?\s*(#?[A-Z0-9-]{5,})\b/gi;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const INTERNATIONAL_PHONE_PATTERN = /(?:\+\d{1,3}|00\d{1,3})[ \t().-]*\d(?:[\d(). \t-]*\d)/g;
const FORMATTED_US_PHONE_PATTERN = /(?:^|[^\d])((?:\([2-9]\d{2}\)|[2-9]\d{2})[ .-][2-9]\d{2}[ .-]\d{4})(?!\d)/g;
const CONTEXTUAL_PHONE_PATTERN = /\b(?:(?:tel[eé]fono|tel\.?|celular|m[oó]vil)(?:\s+(?:anterior|nuevo|alterno|principal|fijo|de\s+oficina|de\s+contacto))?\s*(?:n[uú]mero|no\.?|#)?|(?:(?:primary|backup|secondary|alternate|work|home|office|mobile)\s+)*(?:phone|telephone|mobile|cell(?:ular)?|landline|line)(?:\s+(?:number|no\.?|line))?|(?:n[uú]mero|no\.?)\s+(?:de\s+)?(?:tel[eé]fono|tel\.?|celular|m[oó]vil|phone|mobile|cell(?:ular)?|landline))\s*(?:n[uú]mero|no\.?|#)?\s*(?:es|is|as|to|was)?[\s:#-]*(\+?\(?\d[\d(). \t-]{5,}\d)/gi;
const BANK_ACCOUNT_PATTERN = /\b(?:cuenta(?:\s+(?:bancaria|corriente|de\s+ahorros|de\s+banco))?|(?:(?:bank|checking|savings)\s+)?account(?:\s+number)?)\s*(?:(?:n[uú]mero|no\.?|#)\s*)?[:#-]?\s*(\d(?:[\d \t.-]{8,}\d))/gi;
const ROUTING_NUMBER_PATTERN = /\b(?:routing(?:\s+transit)?|ABA(?:\s+routing)?)(?:\s+(?:number|no\.?|#))+\s*[:#-]?\s*(\d{9})\b/gi;
const PAYMENT_CARD_PATTERN = /\b(?:tarjeta(?:\s+(?:de\s+)?(?:cr[eé]dito|d[eé]bito))?(?:\s+(?:visa|mastercard|amex))?|american\s+express|visa|mastercard|amex|(?:credit|debit)\s+card|card)\s*(?:(?:n[uú]mero|no\.?|number|#)\s*)?[:#-]?\s*(\d(?:[\d \t-]{11,26}\d))/gi;
const SECURITY_CODE_PATTERN = /\b(?:cvv|cvc|cid|c[oó]digo\s+(?:de\s+)?(?:seguridad|verificaci[oó]n)|security\s+code|verification\s+code)\s*(?:temporal\s*)?(?:es|is|:|#|-)?\s*(\d{3,8})\b/gi;
const SUPPORT_TICKET_PATTERN = /\b(?:ticket(?:\s+de\s+soporte)?|support\s+ticket)\s*(?:n[uú]mero|no\.?|#)?\s*[:#-]?\s*(#?[A-Z0-9-]{5,})\b/gi;
const FORM_CODE_PATTERN = /\b(?:c[oó]digo|n[uú]mero|identificador)\s+de\s+planilla\s*(?:n[uú]mero|no\.?)?\s*[:#-]?\s*(#?[A-Z0-9-]{4,})\b/gi;
const IPV4_PATTERN = /(?:^|[^\d.])(((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))(?!\d|\.\d)/g;
const IPV6_PATTERN = /(^|[^\w:.])((?:[A-Fa-f0-9]{0,4}:){2,7}(?:[A-Fa-f0-9]{0,4}|(?:\d{1,3}\.){3}\d{1,3}))(?![\w:]|\.\d)/g;
const US_POSTAL_ADDRESS_PATTERN = /\b(\d{1,6}\s+(?:[A-Z0-9][A-Z0-9.'’-]*\s+){1,6}(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|circle|cir|terrace|ter|parkway|pkwy|place|pl|way)\.?(?:\s*,\s*(?:apt|apartment|unit|suite|ste|#)\s*[A-Z0-9-]+)?(?:\s*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)?)/gi;
const POSTAL_LANDMARK_PATTERN = /\b(?:calle|cll\.?|avenida|av\.?|urbanizaci[oó]n|urb\.?|sector|residencia|res\.?|edificio|edif\.?|apartamento|apto\.?|piso|casa|quinta|carrera|carr\.?|street|avenue|road|drive|lane|boulevard|court|terrace|parkway|suite|unit|zip(?:\s+code)?|postal\s+code|c[oó]digo\s+postal)\b\.?\s*/gi;

function normalizeFindingValue(value) {
  return value.normalize("NFC").toLocaleLowerCase("es");
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

function isValidSocialSecurityNumber(value) {
  const digits = value.replace(/\D/g, "");
  const area = Number(digits.slice(0, 3));
  return digits.length === 9
    && area !== 0
    && area !== 666
    && area < 900
    && digits.slice(3, 5) !== "00"
    && digits.slice(5) !== "0000";
}

function isValidIPv6(value) {
  let address = value;
  if (address.includes(".")) {
    const lastColon = address.lastIndexOf(":");
    const ipv4 = address.slice(lastColon + 1).split(".").map(Number);
    if (ipv4.length !== 4 || ipv4.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
      return false;
    }
    const high = ((ipv4[0] << 8) | ipv4[1]).toString(16);
    const low = ((ipv4[2] << 8) | ipv4[3]).toString(16);
    address = `${address.slice(0, lastColon + 1)}${high}:${low}`;
  }

  const compressedSections = address.match(/::/g) || [];
  if (compressedSections.length > 1) {
    return false;
  }

  const sections = address.split(":");
  if (sections.some((section) => section && !/^[\da-f]{1,4}$/i.test(section))) {
    return false;
  }
  const sectionCount = sections.filter(Boolean).length;
  return compressedSections.length === 1 ? sectionCount < 8 : sectionCount === 8;
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

function addCandidate(candidates, value, start, end, category, reason, priority) {
  if (start < end) {
    candidates.push({ value, start, end, category, reason, priority });
  }
}

function detectFindings(text) {
  const candidates = [];
  addPatternCandidates(candidates, text, IPV4_PATTERN, "direccionIp", "Formato IPv4", 0);
  addPatternCandidates(candidates, text, IPV6_PATTERN, "direccionIp", "Formato IPv6", 0, {
    capture: 2,
    validate: isValidIPv6,
  });

  for (const match of text.matchAll(ID_CONTEXT_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && countDigits(range.value) >= 5 && countDigits(range.value) <= 18) {
      addCandidate(candidates, range.value, range.start, range.end, "cedula", "Contexto de identificación", 0);
    }
  }

  addPatternCandidates(candidates, text, SOCIAL_SECURITY_PATTERN, "cedula", "Formato de seguro social estadounidense", 0, {
    validate: isValidSocialSecurityNumber,
  });
  addPatternCandidates(candidates, text, DRIVER_LICENSE_PATTERN, "cedula", "Contexto de licencia de conducir", 0);

  for (const match of text.matchAll(VENEZUELAN_ID_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && countDigits(range.value) >= 5 && countDigits(range.value) <= 10) {
      addCandidate(candidates, range.value, range.start, range.end, "cedula", "Prefijo de cédula venezolana", 0);
    }
  }

  for (const match of text.matchAll(FULL_NAME_CONTEXT_PATTERN)) {
    const valueStart = match.index + match[0].length;
    const valueMatch = FULL_NAME_VALUE_PATTERN.exec(text.slice(valueStart));
    if (!valueMatch) {
      continue;
    }

    const value = valueMatch[1];
    const start = valueStart + valueMatch[0].indexOf(value);
    addCandidate(candidates, value, start, start + value.length, "nombreCompleto", "Contexto de nombre completo", 0);
  }

  addPatternCandidates(candidates, text, PASSPORT_PATTERN, "pasaporte", "Contexto de pasaporte", 0, {
    validate: (value) => /[A-Z]/i.test(value) && /\d/.test(value),
  });
  addPatternCandidates(candidates, text, RIF_PATTERN, "rif", "Contexto de RIF", 0);
  addPatternCandidates(candidates, text, EMPLOYER_TAX_ID_PATTERN, "rif", "Contexto de EIN", 0);
  addPatternCandidates(candidates, text, DATE_OF_BIRTH_PATTERN, "otros", "Contexto de fecha de nacimiento", 0);
  addPatternCandidates(candidates, text, NPI_PATTERN, "otros", "Contexto de identificador NPI", 0);
  addPatternCandidates(candidates, text, INSURANCE_ID_PATTERN, "otros", "Contexto de póliza o grupo de seguro", 0);
  addPatternCandidates(candidates, text, MEDICAL_CODE_PATTERN, "otros", "Contexto de código médico ICD-10", 0);
  addPatternCandidates(candidates, text, ENCOUNTER_ID_PATTERN, "otros", "Contexto de referencia de caso o encuentro", 0);
  addPatternCandidates(candidates, text, BANK_TRANSACTION_ID_PATTERN, "otros", "Contexto de referencia de operación bancaria", 0);
  addPatternCandidates(candidates, text, EMAIL_PATTERN, "correo", "Formato de correo electrónico", 1, { capture: 0 });
  addPatternCandidates(candidates, text, BANK_ACCOUNT_PATTERN, "cuenta", "Contexto de cuenta bancaria", 0, {
    validate: (value) => countDigits(value) >= 12 && countDigits(value) <= 24,
  });
  addPatternCandidates(candidates, text, ROUTING_NUMBER_PATTERN, "cuenta", "Contexto de número de ruta bancaria", 0);
  addPatternCandidates(candidates, text, PAYMENT_CARD_PATTERN, "tarjeta", "Contexto de tarjeta de pago", 0, {
    validate: (value) => countDigits(value) >= 13 && countDigits(value) <= 19,
  });
  addPatternCandidates(candidates, text, SECURITY_CODE_PATTERN, "codigoSeguridad", "Contexto de código de seguridad", 0);
  addPatternCandidates(candidates, text, SUPPORT_TICKET_PATTERN, "ticket", "Contexto de ticket de soporte", 0);
  addPatternCandidates(candidates, text, FORM_CODE_PATTERN, "planilla", "Contexto de código de planilla", 0);

  for (const match of text.matchAll(INTERNATIONAL_PHONE_PATTERN)) {
    if (isValidPhoneNumber(match[0])) {
      addCandidate(candidates, match[0].trim(), match.index, match.index + match[0].length, "telefono", "Prefijo internacional", 2);
    }
  }

  addPatternCandidates(candidates, text, FORMATTED_US_PHONE_PATTERN, "telefono", "Formato telefónico estadounidense", 2, {
    validate: (value) => countDigits(value) === 10,
  });

  for (const match of text.matchAll(CONTEXTUAL_PHONE_PATTERN)) {
    const range = getCaptureRange(match, 1, text);
    if (range && isValidPhoneNumber(range.value)) {
      addCandidate(candidates, range.value, range.start, range.end, "telefono", "Palabra de contexto telefónico", 2);
    }
  }

  for (const match of text.matchAll(POSTAL_LANDMARK_PATTERN)) {
    const start = match.index;
    const end = getPostalAddressEnd(text, start);
    const value = text.slice(start, end).trim();
    if (value.length < 6 || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value)) {
      continue;
    }
    addCandidate(candidates, value, start, start + value.length, "direccion", "Contexto de dirección postal", 4);
  }

  addPatternCandidates(candidates, text, US_POSTAL_ADDRESS_PATTERN, "direccion", "Formato de dirección postal estadounidense", 0);

  candidates.sort((first, second) => first.priority - second.priority
    || first.start - second.start
    || second.end - first.end);

  const accepted = [];
  for (const candidate of candidates) {
    // La prioridad conserva el hallazgo más específico cuando dos reglas cubren el mismo texto.
    if (!accepted.some((finding) => candidate.start < finding.end && candidate.end > finding.start)) {
      accepted.push(candidate);
    }
  }
  return accepted.sort((first, second) => first.start - second.start);
}

app.normalizeFindingValue = normalizeFindingValue;
app.detectFindings = detectFindings;
})(window.AntesDeEnviar);

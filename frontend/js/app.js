const sourceText = document.querySelector("#sourceText");
const findingList = document.querySelector("#findingList");
const emptyFindings = document.querySelector("#emptyFindings");
const findingCount = document.querySelector("#findingCount");
const characterCount = document.querySelector("#characterCount");
const analyzeButton = document.querySelector("#analyzeButton");
const addSelectionButton = document.querySelector("#addSelectionButton");
const protectButton = document.querySelector("#protectButton");
const sampleButton = document.querySelector("#sampleButton");
const clearButton = document.querySelector("#clearButton");
const resultSection = document.querySelector("#resultSection");
const protectedText = document.querySelector("#protectedText");
const replacementSummary = document.querySelector("#replacementSummary");
const copyButton = document.querySelector("#copyButton");
const pageMessage = document.querySelector("#pageMessage");

let findings = [];
let nextFindingId = 0;

function showMessage(message, kind = "info") {
  pageMessage.textContent = message;
  pageMessage.dataset.kind = kind;
}

function resetResults() {
  findings = [];
  findingList.replaceChildren();
  findingCount.textContent = "0";
  emptyFindings.hidden = false;
  addSelectionButton.disabled = true;
  protectButton.disabled = true;
  resultSection.hidden = true;
  protectedText.value = "";
  replacementSummary.textContent = "";
}

function updateCharacterCount() {
  const count = sourceText.value.length;
  characterCount.textContent = `${count.toLocaleString("es")} ${count === 1 ? "carácter" : "caracteres"}`;
}

function addFinding(type, value, start, end) {
  const overlaps = findings.some((finding) => start < finding.end && end > finding.start);
  if (overlaps) {
    return false;
  }

  findings.push({
    id: nextFindingId++,
    type,
    value,
    start,
    end,
    checked: true,
  });
  return true;
}

function renderFindings() {
  findingList.replaceChildren();
  findingCount.textContent = String(findings.length);
  emptyFindings.hidden = findings.length > 0;

  for (const finding of findings) {
    const item = document.createElement("li");
    item.className = "finding-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `finding-${finding.id}`;
    checkbox.checked = finding.checked;
    checkbox.setAttribute("aria-label", `Reemplazar ${finding.type}: ${finding.value}`);
    checkbox.addEventListener("change", () => {
      finding.checked = checkbox.checked;
      updateProtectButton();
    });

    const content = document.createElement("label");
    content.className = "finding-content";
    content.htmlFor = checkbox.id;

    const type = document.createElement("span");
    type.className = "finding-type";
    type.textContent = finding.type;

    const value = document.createElement("span");
    value.className = "finding-value";
    value.textContent = finding.value;

    content.append(type, value);
    item.append(checkbox, content);
    findingList.append(item);
  }

  addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
  updateProtectButton();
}

function updateProtectButton() {
  protectButton.disabled = !findings.some((finding) => finding.checked);
}

function analyzeText() {
  const text = sourceText.value;
  resetResults();
  showMessage("");

  if (!text.trim()) {
    showMessage("Escribe o pega un texto para empezar.", "warning");
    sourceText.focus();
    return;
  }

  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  for (const match of text.matchAll(emailPattern)) {
    addFinding("Correo posible", match[0], match.index, match.index + match[0].length);
  }

  const phonePattern = /\+?\d[\d().\s-]{6,}\d/g;
  for (const match of text.matchAll(phonePattern)) {
    const digitCount = match[0].replace(/\D/g, "").length;
    if (digitCount >= 8 && digitCount <= 15) {
      addFinding("Teléfono posible", match[0].trim(), match.index, match.index + match[0].length);
    }
  }

  findings.sort((first, second) => first.start - second.start);
  renderFindings();

  if (findings.length === 0) {
    showMessage("No se encontraron correos ni teléfonos con estas reglas. Puedes marcar un fragmento manualmente.");
  } else {
    showMessage(`Se encontraron ${findings.length} posibles datos. Revísalos antes de proteger el texto.`);
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

  if (!addFinding("Selección manual", selectedText, start, end)) {
    showMessage("Esa selección se cruza con otro hallazgo. Desmarca ese hallazgo o elige otro fragmento.", "warning");
    return;
  }

  findings.sort((first, second) => first.start - second.start);
  renderFindings();
  showMessage("Selección añadida. Puedes elegir si quieres reemplazarla.");
}

function protectSelectedFindings() {
  const selected = findings
    .filter((finding) => finding.checked)
    .sort((first, second) => first.start - second.start);

  if (selected.length === 0) {
    showMessage("Marca al menos un hallazgo para protegerlo.", "warning");
    return;
  }

  const replacements = [];
  const typeCounts = new Map();

  for (const finding of selected) {
    const key = finding.type === "Correo posible"
      ? "CORREO"
      : finding.type === "Teléfono posible"
        ? "TELEFONO"
        : "DATO";
    const count = (typeCounts.get(key) || 0) + 1;
    typeCounts.set(key, count);
    replacements.push({
      ...finding,
      replacement: `[${key}_${count}]`,
    });
  }

  let result = sourceText.value;
  for (const finding of replacements.reverse()) {
    result = `${result.slice(0, finding.start)}${finding.replacement}${result.slice(finding.end)}`;
  }

  protectedText.value = result;
  const total = selected.length;
  replacementSummary.textContent = `${total} ${total === 1 ? "fragmento reemplazado" : "fragmentos reemplazados"}. El texto original permanece en el editor hasta que limpies la sesión.`;
  resultSection.hidden = false;
  showMessage("Texto protegido preparado. Revísalo antes de copiarlo.");
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  resetResults();
  updateCharacterCount();
  showMessage("Texto y hallazgos borrados de esta página.");
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
clearButton.addEventListener("click", clearSession);
copyButton.addEventListener("click", copyProtectedText);

sampleButton.addEventListener("click", () => {
  sourceText.value = "Hola, mi correo es ana.ejemplo@example.com y mi teléfono es +1 (202) 555-0142. ¿Puedes ayudarme a revisar este mensaje?";
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
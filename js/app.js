  // Orquesta la interacción y conserva el estado de la sesión en memoria.
window.AntesDeEnviar = window.AntesDeEnviar || {};
(function (app) {
const { CATEGORY_CONFIG, DEMO_TEXTS } = app.config;
const { detectFindings, normalizeFindingValue, renderFindingsView } = app;
const { t, categoryInfo } = app.i18n;

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
const languageToggle = document.querySelector("#languageToggle");
const themeToggle = document.querySelector("#themeToggle");

let findings = [];
let nextFindingId = 0;
let activeCategory = null;
const labelSettings = new Map();
let demoOrder = [];
let demoOrderIndex = 0;
let lastDemoIndex = -1;

function getNextDemoText() {
  if (demoOrderIndex >= demoOrder.length) {
    demoOrder = DEMO_TEXTS.map((_, index) => index);
    for (let index = demoOrder.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [demoOrder[index], demoOrder[swapIndex]] = [demoOrder[swapIndex], demoOrder[index]];
    }
    if (demoOrder.length > 1 && demoOrder[0] === lastDemoIndex) {
      [demoOrder[0], demoOrder[1]] = [demoOrder[1], demoOrder[0]];
    }
    demoOrderIndex = 0;
  }

  const demoIndex = demoOrder[demoOrderIndex];
  demoOrderIndex += 1;
  lastDemoIndex = demoIndex;
  return DEMO_TEXTS[demoIndex];
}

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
  const language = app.i18n.language();
  characterCount.textContent = t(count === 1 ? "characterOne" : "characterMany", {
    count: count.toLocaleString(language === "es" ? "es-ES" : "en-US"),
  });
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
  showMessage(t("jumpedToOccurrence"));
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

function renderFindings() {
  // La vista gestiona el DOM; esta capa conserva el estado y las acciones del editor.
  renderFindingsView({
    findings,
    categoryTabs,
    findingGroups,
    findingCount,
    emptyFindings,
    activeCategory,
    getLabelSettings,
    getLabelSettingsKey,
    getOccurrenceContext,
    jumpToFinding,
    onActiveCategoryChange: (category) => {
      activeCategory = category;
    },
    onFindingChange: () => {
      hideProtectedResult();
      updateProtectButton();
    },
    onLabelChange: hideProtectedResult,
    onRemoveFinding: removeAutomaticFinding,
  });
  addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
  updateProtectButton();
}

function updateProtectButton() {
  protectButton.disabled = !findings.some((finding) => finding.checked);
}

function removeAutomaticFinding(finding) {
  const findingIndex = findings.findIndex((item) => item.id === finding.id);
  if (findingIndex === -1) {
    return;
  }

  findings.splice(findingIndex, 1);
  hideProtectedResult();
  renderFindings();
  sourceText.focus();
  sourceText.setSelectionRange(finding.start, finding.end);
  addSelectionButton.disabled = false;
  showMessage(t("findingRemoved"));
}

function analyzeText() {
  resetResults();
  showMessage("");

  if (!sourceText.value.trim()) {
    showMessage(t("enterText"), "warning");
    sourceText.focus();
    return;
  }

  for (const finding of detectFindings(sourceText.value)) {
    addFinding(finding.category, finding.value, finding.start, finding.end, finding.reason);
  }
  renderFindings();

  if (findings.length === 0) {
    showMessage(t("noFindings"));
  } else {
    showMessage(t("analysisComplete", {
      findings: findings.length,
      categories: new Set(findings.map((item) => item.category)).size,
    }));
  }
}

function addManualSelection() {
  const start = sourceText.selectionStart;
  const end = sourceText.selectionEnd;
  const selectedText = sourceText.value.slice(start, end);

  if (start === end || !selectedText.trim()) {
    showMessage(t("selectFirst"), "warning");
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
    showMessage(t("overlappingSelection"), "warning");
    return;
  }

  findings.sort((first, second) => first.start - second.start);
  activeCategory = "manual";
  hideProtectedResult();
  renderFindings();
  showMessage(t("manualMatchesAdded", { added: addedCount, matches: matchCount }));
}

function getReplacementLabel(finding) {
  const config = CATEGORY_CONFIG[finding.category];
  const settings = getLabelSettings(finding.category, finding.value);
  if (settings.preset === "private") {
    return t("labelPrivate");
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
    showMessage(t("markFinding"), "warning");
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
        showMessage(t("enterLabel", { value: finding.value }), "warning");
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
  updateReplacementSummary(counts);
  resultSection.hidden = false;
  showMessage(t("protectedReady"));
  resultSection.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "nearest",
  });
}

function updateReplacementSummary(counts = null) {
  const categoryCounts = counts ?? findings
    .filter((finding) => finding.checked)
    .reduce((result, finding) => {
      result.set(finding.category, (result.get(finding.category) || 0) + 1);
      return result;
    }, new Map());
  replacementSummary.textContent = [...categoryCounts]
    .map(([category, count]) => {
      const info = categoryInfo(category);
      return `${count} ${count === 1 ? info.singular : info.plural}`;
    })
    .join(", ") + ` ${t("replacementSummaryEnd")}`;
}

async function copyProtectedText() {
  try {
    await navigator.clipboard.writeText(protectedText.value);
    showMessage(t("copied"));
  } catch {
    protectedText.focus();
    protectedText.select();
    showMessage(t("clipboardUnavailable"), "warning");
  }
}

function clearSession() {
  sourceText.value = "";
  labelSettings.clear();
  resetResults();
  updateCharacterCount();
  showMessage(t("cleared"));
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
  sourceText.value = getNextDemoText();
  updateCharacterCount();
  analyzeText();
  sourceText.focus();
});

function updatePreferenceControls() {
  const nextTheme = app.i18n.theme() === "light" ? "dark" : "light";
  const themeName = t(nextTheme === "dark" ? "themeDarkName" : "themeLightName");
  themeToggle.textContent = t(nextTheme === "dark" ? "themeDarkButton" : "themeLightButton");
  themeToggle.setAttribute("aria-label", t("themeButtonAria", { theme: themeName }));
}

languageToggle.addEventListener("click", () => {
  const language = app.i18n.language() === "en" ? "es" : "en";
  const persisted = app.i18n.setLanguage(language);
  updatePreferenceControls();
  updateCharacterCount();
  if (findings.length > 0) {
    renderFindings();
  }
  if (!resultSection.hidden) {
    updateReplacementSummary();
  }
  showMessage(persisted ? t("languageChanged") : t("preferenceUnavailable"), persisted ? "info" : "warning");
});

themeToggle.addEventListener("click", () => {
  const theme = app.i18n.theme() === "light" ? "dark" : "light";
  const persisted = app.i18n.setTheme(theme);
  updatePreferenceControls();
  showMessage(persisted ? t("themeChanged", {
    theme: t(theme === "dark" ? "themeDarkName" : "themeLightName"),
  }) : t("preferenceUnavailable"), persisted ? "info" : "warning");
});

document.addEventListener("selectionchange", () => {
  if (document.activeElement === sourceText) {
    addSelectionButton.disabled = sourceText.selectionStart === sourceText.selectionEnd;
  }
});

if ("serviceWorker" in navigator && window.isSecureContext && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(() => showMessage(t("installUnavailable"), "warning"));
  });
}

app.i18n.initialize();
updatePreferenceControls();
updateCharacterCount();
if (!app.i18n.canPersist()) {
  showMessage(t("preferenceUnavailable"), "warning");
}
})(window.AntesDeEnviar);

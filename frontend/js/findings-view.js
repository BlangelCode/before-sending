// Renderiza hallazgos; las acciones y el estado continúan bajo control de app.js.
window.AntesDeEnviar = window.AntesDeEnviar || {};
(function (app) {
const { CATEGORY_ORDER } = app.config;
const { normalizeFindingValue } = app;
const { categoryInfo, t } = app.i18n;

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

function renderFindingsView(options) {
  const {
    findings,
    categoryTabs,
    findingGroups,
    findingCount,
    emptyFindings,
    activeCategory: previousCategory,
    getLabelSettings,
    getLabelSettingsKey,
    getOccurrenceContext,
    jumpToFinding,
    onActiveCategoryChange,
    onFindingChange,
    onLabelChange,
    onRemoveFinding,
  } = options;

  const categories = CATEGORY_ORDER
    .map((category) => ({
      category,
      categoryFindings: findings.filter((finding) => finding.category === category),
    }))
    .filter(({ categoryFindings }) => categoryFindings.length > 0);
  const availableCategories = new Set(categories.map(({ category }) => category));
  let activeCategory = availableCategories.has(previousCategory)
    ? previousCategory
    : categories[0]?.category ?? null;

  if (activeCategory !== previousCategory) {
    onActiveCategoryChange(activeCategory);
  }

  categoryTabs.replaceChildren();
  categoryTabs.hidden = categories.length === 0;
  findingGroups.replaceChildren();
  findingCount.textContent = String(findings.length);
  emptyFindings.hidden = findings.length > 0;

  function activateCategory(category, focusTab = false) {
    if (!CATEGORY_ORDER.includes(category)) {
      return;
    }

    activeCategory = category;
    onActiveCategoryChange(category);
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

  function createCategoryGroup(category, valueGroups) {
    const config = categoryInfo(category);
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
    count.textContent = t("categoryCount", { values: valueGroups.length, occurrences: occurrenceCount });
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
      occurrences.textContent = t(valueGroup.length === 1 ? "occurrenceOne" : "occurrenceMany", { count: valueGroup.length });
      valueHeading.append(value, occurrences);

      const settings = getLabelSettings(category, valueGroup[0].value);
      settings.defaultLabel = defaultLabel;
      const control = document.createElement("div");
      control.className = "category-label-control";

      const selectId = `replacement-${category}-${groupIndex}`;
      const selectLabel = document.createElement("label");
      selectLabel.htmlFor = selectId;
      selectLabel.textContent = t("labelForValue", { value: valueGroup[0].value });

      const select = document.createElement("select");
      select.id = selectId;
      select.name = selectId;
      select.setAttribute("autocomplete", "off");

      const presets = [
        { value: "default", text: defaultLabel },
        { value: "private", text: t("labelPrivate") },
        { value: "custom", text: t("labelCustom") },
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
      customLabel.textContent = t("labelCustomForValue", { category: config.singular, value: valueGroup[0].value });

      const customInput = document.createElement("input");
      customInput.id = customId;
      customInput.name = `${customId}-value`;
      customInput.type = "text";
      customInput.autocomplete = "off";
      customInput.dataset.settingKey = getLabelSettingsKey(category, valueGroup[0].value);
      customInput.maxLength = 40;
      customInput.placeholder = t("labelCustomPlaceholder");
      customInput.value = settings.custom;
      customInput.hidden = settings.preset !== "custom";

      const helper = document.createElement("small");
      helper.textContent = t("labelAppliesToMarked");

      select.addEventListener("change", () => {
        settings.preset = select.value;
        customInput.hidden = settings.preset !== "custom";
        onLabelChange();
        if (!customInput.hidden) {
          customInput.focus();
        }
      });

      customInput.addEventListener("input", () => {
        settings.custom = customInput.value;
        onLabelChange();
      });

      control.append(selectLabel, select, customLabel, customInput, helper);

      const list = document.createElement("ul");
      list.className = "finding-items";
      list.setAttribute("aria-label", t("occurrencesAria", { value: valueGroup[0].value }));

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
          t("replaceOccurrenceAria", { index: occurrenceIndex + 1, category: config.singular, value: finding.value }),
        );
        checkbox.addEventListener("change", () => {
          finding.checked = checkbox.checked;
          onFindingChange();
        });

        const occurrenceContent = document.createElement("span");
        occurrenceContent.className = "occurrence-content";
        const occurrenceLabel = document.createElement("span");
        occurrenceLabel.className = "occurrence-label";
        occurrenceLabel.textContent = t("occurrenceLabel", { index: occurrenceIndex + 1 });
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
          t("jumpOccurrenceAria", { index: occurrenceIndex + 1, value: finding.value }),
        );
        jumpButton.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.2 3.2H3.5v4.7M3.8 3.5l5 5M11.8 16.8h4.7v-4.7M16.5 16.5l-5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        jumpButton.addEventListener("click", () => jumpToFinding(finding));

        item.append(label, jumpButton);
        if (category !== "manual") {
          const removeButton = document.createElement("button");
          removeButton.className = "remove-finding-button";
          removeButton.type = "button";
          removeButton.textContent = t("removeFinding");
          removeButton.setAttribute("aria-label", t("removeFindingAria", { category: config.singular, value: finding.value }));
          removeButton.addEventListener("click", () => onRemoveFinding(finding));
          item.append(removeButton);
        }
        list.append(item);
      }

      valueCard.append(valueHeading, control, list);
      values.append(valueCard);
    }

    section.append(heading, description, values);
    return section;
  }

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
    title.textContent = categoryInfo(category).title;
    const count = document.createElement("span");
    count.className = "category-tab-count";
    count.textContent = String(categoryFindings.length);
    count.setAttribute("aria-label", t(categoryFindings.length === 1 ? "findingOne" : "findingMany", { count: categoryFindings.length }));
    tab.append(title, count);
    categoryTabs.append(tab);

    findingGroups.append(createCategoryGroup(category, groupByValue(categoryFindings)));
  }

  if (activeCategory) {
    activateCategory(activeCategory);
  }
}

app.renderFindingsView = renderFindingsView;
})(window.AntesDeEnviar);

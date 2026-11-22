# Antes de enviar

**Antes de enviar** is a lightweight web app that helps people review and replace potentially sensitive information before sharing text with AI tools, a company, or social media. Detection runs locally in the browser; text is not sent to a backend or an AI API.

> **Status:** Single-page PWA MVP. Detection is heuristic and does not guarantee complete anonymization.

## Problem and goal

People can accidentally include their own or someone else's personal information in a prompt, message, or social media post. Antes de enviar highlights possible sensitive values and lets users replace selected occurrences before copying the protected text.

The project is an educational privacy aid, not a guarantee of anonymization.

## MVP features

- Type or paste text, or load a synthetic example covering several categories.
- Review detected categories in tabs with counts. Only one category panel is shown at a time, and its list scrolls independently.
- Navigate tabs with the arrow keys, Home, and End. Labels and per-occurrence selections stay in memory when switching tabs.
- Group findings by category and equivalent value, ignoring letter case; each distinct value has its own replacement label.
- Review individual occurrences, exclude selected occurrences, and jump from a finding to its selected range in the original text.
- Detect Venezuelan ID numbers with `V-`/`E-` prefixes and other ID numbers near labels such as “DNI”, “CI”, or “identity document”.
- Detect full names with initial capitals when they follow explicit name phrases, certain roles (such as “legal representative” or “applicant”), or professional titles (such as “Lic.”). This is contextual and heuristic; it will not find every name.
- Detect passports and tax IDs only near their labels; detect international phone numbers or local numbers near terms such as “phone”, “telephone”, “cell”, or “mobile”.
- Detect email addresses, bank accounts, payment card numbers, and security codes using format and context rules.
- Detect support tickets and form codes only when accompanied by their contextual terms. Do not classify isolated bank transaction numbers or classroom codes.
- Detect valid IPv4 addresses separately from postal addresses. Postal addresses are approximated from nearby indicators such as “street”, “avenue”, or “home address”.
- Select a text fragment manually; the app can suggest repeated matches regardless of letter case and lets users exclude occurrences individually.
- Choose a preset or custom replacement for each distinct value. Default labels include an index (for example, `[ID_1]` and `[ID_2]`) to distinguish values.
- Review and uncheck findings to keep them, then inspect and copy the protected text.
- Clear the editor and findings from the page, or install the PWA in a compatible browser.

Patterns may miss sensitive values or produce false positives. Users should always review the protected text before sharing it.

## Technology choices

| Technology | Purpose |
| --- | --- |
| HTML | Semantic and accessible interface structure. |
| CSS | Responsive styling without a visual framework. |
| Classic JavaScript scripts | Local interactions, detection rules, selection, replacement, and translations. Ordered scripts and a shared namespace allow the app to run when `index.html` is opened directly with `file://`; no frontend packages or build step are required. |
| Web manifest and service worker | Describe the PWA and cache static application resources for offline launch. User text is never cached. |
| Python and FastAPI | Planned for possible future non-sensitive features. They are not part of this MVP and do not receive text. |

HTML and CSS alone cannot perform interactive analysis; JavaScript reads text in the page, applies detection rules, and replaces selected ranges. Classic scripts are loaded in dependency order and share a small global namespace so local ES module restrictions do not block direct `file://` use.

## Architecture

```text
Browser
  ├─ frontend/
  │   ├─ index.html
  │   ├─ css/                  # Base, layout, editor, findings, feedback, responsive, and theme styles
  │   ├─ js/
  │   │   ├─ app.js            # UI events and in-memory session state
  │   │   ├─ config.js         # Category labels and sample text
  │   │   ├─ detection.js      # Local contextual patterns and candidate ranges
  │   │   ├─ findings-view.js  # Category tabs and finding controls
  │   │   └─ translations.js   # English/Spanish strings and UI preferences
  │   ├─ manifest.webmanifest
  │   ├─ service-worker.js
  │   └─ assets/icon.svg
  └─ Analyzes and transforms text locally

Static HTTPS host
  └─ Serves the PWA files; it does not receive editor text

FastAPI
  └─ Planned only; not implemented or used by the MVP
```

Text, findings, and replacement settings remain in page memory. The frontend does not send text for analysis or persist a history. The service worker caches static application files only. There is no database, account system, or backend in the MVP.

## Local detection and limitations

Automatic detection uses JavaScript patterns and contextual phrases; it does not use an AI model or external AI API. Full names are detected only when they follow supported contextual phrases, role words, or professional titles and match the expected capitalization pattern. Names without a supported cue, or written in a different format, may be missed; select those manually.

An isolated number is not enough to classify an ID, tax ID, passport, bank account, payment card, security code, support ticket, or form code. Local phone numbers require context. Formats and labels vary by country, so the rules are not exhaustive. Postal address boundaries are heuristic and should be checked. IPv4 addresses are validated and handled separately.

The app should make clear that:

- it can miss sensitive data or flag harmless text;
- a manual review is still necessary;
- users must check the protected text before sharing it;
- the product does not replace the privacy policy of the AI service being used.

## Project structure

```text
frontend/
  index.html
  css/
    foundation.css
    layout.css
    editor.css
    findings.css
    feedback.css
    responsive.css
    theme.css
  js/
    app.js
    config.js
    detection.js
    findings-view.js
    translations.js
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

`backend/app/main.py` and `backend/requirements.txt` remain empty. The MVP does not need a server to process text.

## Run and package

For the core review, detection, replacement, language, and theme features, open `frontend/index.html` directly in a modern browser. This `file://` mode does not support service-worker caching or PWA installation.

To run the PWA locally with service-worker/offline support, serve the static frontend with Python. In PowerShell:

```powershell
Set-Location frontend
python -m http.server 8000
```

Open `http://localhost:8000`. Publishing the app as an installable PWA requires HTTPS and a compatible browser. The service worker caches the application shell and scripts, never the text entered by the user.

The interface defaults to English and offers English/Spanish and light/dark controls. Only these preferences are stored locally; text, findings, and replacement results stay in page memory and are not persisted.

## Product privacy and security

- Do not integrate an external AI API to inspect text.
- The frontend does not send text or findings to FastAPI; the backend is not part of the MVP.
- Do not store editor text in local storage or create a history.
- The “Clear text” action removes the editor text, findings, and result from the page.
- Do not promise exhaustive detection or absolute protection; review the output before sharing it.

## Possible future improvements

- Regional profiles for identity and phone formats, tested with synthetic examples from each country.
- Local detection for passwords and API keys, with explicit confirmation and without storing values.
- Undo or restore replacements during the current session, clearing the temporary mapping on reset.
- Text-document import. PDF, office documents, and image support would require careful review of privacy, file size, and offline OCR.

## Hackathon context

The project aligns with **Projects for Social Good** by promoting more privacy-conscious use of AI tools. The final submission should distinguish work completed during the event, explain technical decisions, and credit any external resources used.

# Healthcare Tools Hub (Vite + React)

Client-side utilities for healthcare operations. No backend. No cookies. No localStorage. All state is in memory.

Live at:

```
https://healthcaretools.netlify.app/
```

## Stack

- **Vite** + **React** (JavaScript)
- **React Router**
- **Vanilla CSS** (`src/styles.css`)
- Simple PDF utility (`src/util/pdf.js` → `downloadElementAsPDF(elementId, filename)`)

## Key Principles

- **Ephemeral**: state resets on reload.
- **Client-only**: all processing happens in the browser.
- **No PHI storage**: outputs must be downloaded and stored in approved systems.

## Getting Started

```bash
# install deps
npm i

# dev
npm run dev

# production build
npm run build

# local preview of build
npm run preview
```

## Deploy (Netlify)

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Branch to deploy**: your repo’s default (e.g., `main`)

## Project Structure (high level)

```
src/
  components/
    Navbar.jsx
    FlagButton.jsx
    Footer.jsx
    FormFieldEditor.jsx
    SessionBadge.jsx
    FormPreview.jsx
    TemplateCard.jsx
  context/
    SessionContext.jsx
  pages/
    Home.jsx
    ABADataCollector.jsx
    Flagged.jsx
    FormBuilder.jsx
    MedicationMAP.jsx
    Templates.jsx
    FormBuilder.jsx
    TourForm.jsx
    StaffCompliance.jsx
    CaseFileChecklist.jsx
    HomeSafetyAssessment.jsx
    BillingContracts.jsx
    AdminTools.jsx
    PdfTools.jsx
    TourForm.jsx
    Templates.jsx
  util/
    pdf.js         # downloadElementAsPDF helper
  styles.css
  App.jsx
  main.jsx
index.html
```

## Routes / Tools

- `/` — Home
- `/templates` — Starter Blueprints index
- `/form-builder` — Intake/consent/incident/etc. builder + PDF export
- `/pdf-tools` — PDF utilities (client-side)
- `/admin-tools` — Admin utilities (client-side)
- `/tour-form` — Tour data capture (client/guardian, contact, priority, PCP history, diagnoses, medications, ADLs, services, trauma-informed care) + logo header + PDF
- `/staff-compliance` — Staff Credential & Compliance Checker (HR/Managers) with status badges + PDF
- `/case-file-checklist` — MassHealth/department baseline readiness checklist with progress bar + PDF
- `/home-safety` — Home & Environmental Safety Assessment with readiness % + risk badge + PDF

## Session & Search

- `SessionContext` exposes:
  - `searchQuery` / `setSearchQuery` (global quick search)
  - `flagged` (in-memory Set of ids)
  - `toggleFlag(id)`
- No persistence layer by design.

## PDF Export Pattern

Each page renders a preview container and exports it:

```jsx
// Preview container
<div id="casefile-preview"> ... </div>

// Export button
<button onClick={() => downloadElementAsPDF("casefile-preview", "Case_File_Readiness.pdf")}>
  Download PDF
</button>
```

## Data & Privacy

- This project is not an EMR/EHR.
- Do not store PHI here.
- All outputs must be downloaded and filed in your organization’s official system.

# License & Attribution

This project is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0). You are free to:

Share — copy and redistribute the material in any medium or format
Adapt — remix, transform, and build upon the material for any purpose, even commercially
Under the following terms:

Attribution — You must give appropriate credit, provide a link to this repository, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
For full license details, see:

```
https://creativecommons.org/licenses/by/4.0/
```

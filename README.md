# Isaiah Kolawole — ML/AI portfolio

Responsive static HTML, CSS and JavaScript portfolio with an interactive neural globe. No build step or dependencies.

Production: https://isaiah-kolawole-portfolio.vercel.app/

## Pages

- `index.html`: portfolio, skills, projects, and contact details.
- `case-study.html`: architecture, recorded evaluation, and limitations.
- `demo.html` / `demo.js`: synthetic analytics demo with period/area filters, responsive chart, reporting-status table, pagination, and CSV export.
- `profile.html`: factual portfolio profile with print/save-as-PDF styling and a plain-text download.
- `assets/social-preview.png`: share preview.

## Preview

From this repository run `python -m http.server 3000 --bind 127.0.0.1`, then open http://localhost:3000. Serve over HTTP for the demo's JSON fetch; opening its HTML directly as a file is not supported.

## Data and claims

`assets/demo-data.json` contains selected fields from the public project's `data/processed/facility_month_status.csv` and `data/forecast/model_diagnostics.json`:
https://github.com/kolawoleisaiah325/health-programme-analytics

All records describe fictional facilities. Across 216 expected facility-months, 213 are accepted, two missing, and one invalid. Reporting completeness is 214/216 = 99.1%; accepted doses total 26,945. Missing and invalid counts remain null, while an accepted zero stays zero. Achievement uses targets for accepted records only.

Operational filters affect metrics and chart. Record view affects the table and CSV download, including every matching row across pages. Downloads label synthetic data. Forecast scores remain programme-wide: three methods, trained on 2023–2024 and scored on nine complete 2025 months. The same holdout selected the model; independent validation is needed. The website does not run Python, PostgreSQL, or the LLM.

Skills are labeled PROJECT USE or TO EXPLORE based on evidence across the featured projects. Project use is not a proficiency rating. The work cards feature three distinct projects. No education, employers, credentials or real-world programme impact are invented.

## Contact and accessibility

Confirmed email and phone are set in `script.js` and the printable profile. LinkedIn is omitted. Google Fonts is the only external resource, with system fallbacks. Reduced-motion is respected; the globe pauses offscreen. Navigation, dialogs, filters and downloads are keyboard accessible.

## Deployment and rollback

Repository: `kolawoleisaiah325/isaiah-kolawole-portfolio`. Vercel deploys pushes to `main`, using framework **Other**, root `./`, and no build command.

The version before the October 2 improvements is saved as tag `before-portfolio-improvements-2026-10-02`, commit `2f46fc8`. Restore by reverting the improvement commit(s), reviewing the diff, and pushing the revert to `main`. Preserve subsequent user changes; do not force-push or reset shared history.

## GitHub Code Chat feature

`code-chat.html` features the second project and a browser-only BM25 search over its authored fictional shop. `assets/code-chat-demo.json` contains actual sample excerpts and the recorded local-model evaluation. `code-chat.js` searches those excerpts and displays recorded outputs without calling an LLM. The gallery and case-study previews are complete captures of the working browser demos. `code-chat-demo.html` presents the same sample search as a dedicated source explorer; the full AI app remains local. Earlier Streamlit captures remain in assets as historical evidence. The case study documents citation limitations and observed model errors.

RAG & Embeddings is now labeled PROJECT USE based on this project. The health project modules are described in its case study, and the main gallery shows distinct projects.

Before this feature, the portfolio is tagged `before-code-chat-feature-2026-10-02` (`370d4db`). Revert the feature commit to restore that version.

## Project preview framing

Project images retain their natural proportions instead of using a fixed aspect ratio with cover cropping. The gallery links to full-size captures, and labels are outside the image. `assets/health-workspace.jpg` includes the complete metrics and service-delivery chart; `assets/code-chat-workspace.jpg` shows the full source-explorer workspace. Both were captured in the browser from working demos.

Before these changes, the portfolio is tagged `before-project-preview-refresh-2026-10-02` (`90f1a77`). Revert the preview-refresh commit to restore that version.


## InspectAI feature

`inspect-ai.html` documents the third project: frozen CNN feature extraction, normal-patch memory, ONNX serving and a FastAPI image-inspection API. The full app runs separately from this static portfolio. `assets/inspect-ai-evaluation.json` contains the recorded 83-image benchmark, including the split, per-image scores and both missed contamination cases. Dataset assets are attributed to MVTec AD under CC BY-NC-SA 4.0. PyTorch and FastAPI now carry PROJECT USE labels based on this implementation; Docker remains TO EXPLORE.

Before this feature, the portfolio is tagged `before-inspectai-feature-2026-10-02` (`afbc923`). Revert the feature commit to restore it without resetting shared history.

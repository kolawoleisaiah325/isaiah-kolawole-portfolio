# Isaiah Kolawole — ML/AI portfolio

A responsive, static portfolio inspired by the supplied reference: dark colours, red accents, large outlined type, and About, Skills, Projects, and Contact sections. No build step or package installation required.

## Preview

Open `index.html` directly, or serve this folder:

```powershell
python -m http.server 3000 --bind 127.0.0.1
```

Run that command from the folder containing `index.html`, then open http://localhost:3000.

## Personalise

- `index.html`: biography, suggested skills, project copy, and GitHub links.
- `script.js`: confirmed email, phone number, and optional LinkedIn URL in `profile`. Phone links use Nigeria's `+234` country code. The links appear automatically.
- `neural-engine.js`: interactive 3D globe artwork, orbital particles, and animation controls.
- `styles.css`: colours, typography, and responsive layouts.
- `assets/health-dashboard.jpg`: a copy of the actual project dashboard screenshot.

The skill list is suggested copy, not a claim of verified proficiency. Review it before publishing. The three work cards describe the existing health analytics project and two of its modules, not three independent projects. All programme data is synthetic. No experience figures, employers, credentials, portrait, or contact details have been invented.

Google Fonts is the only external page resource; system fonts act as fallbacks. The neural animation respects reduced-motion preferences and pauses when offscreen. Skills can be filtered, project details open in keyboard-accessible dialogs, and the mobile navigation supports Escape.

## Deploy

Upload the contents of this directory to any static web host. For this standalone repository on Vercel, use the repository root (`./`), framework preset **Other**, and leave the build command empty. The website has not been deployed automatically.

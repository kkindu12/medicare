# Medicare

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

1. Copy `.env.example` to `.env` in the medicare2 directory
2. Fill in your credentials for MongoDB and Dropbox
# Medicare

Medicare is a modular healthcare management application. The frontend is built with Angular and the repository also includes Python utility scripts and microservices. It's designed for booking appointments, managing patient records, billing, notifications, and administrative dashboards.

This repository is organized as:

- `medicare1/` — Angular frontend application
- `medicare2/` — Python scripts / microservices

## Features

- Patient and doctor sign-in / sign-up
- Appointment booking, rescheduling, and reminders
- Electronic Medical Records (EMR) viewing and basic management
- Billing / invoice generation
- Notifications (including SSE endpoints)
- Accessibility settings (font-size scaling system)

## Quick start

Prerequisites

- Node.js 16+ and npm (or yarn)
- Angular CLI (optional but helpful for development)
- Python 3.10+ (for backend utilities)

Frontend (medicare1)

1. Install dependencies

```powershell
cd medicare1
npm install
```

2. Run dev server

```powershell
npm start
# or: ng serve --open
```

3. Build for production

```powershell
npm run build
```

Backend / Python utilities (medicare2)

1. Create & activate a virtualenv (recommended)

```powershell
python -m venv venv
venv\Scripts\activate
```

2. Install Python deps (if present)

```powershell
pip install -r requirements.txt
```

3. Run a script / service

```powershell
python main.py
```

## Accessibility: Font-size scaling system

The frontend provides a font-size accessibility feature so users can increase or decrease the UI type size. Important behaviors:

- Users can preview font-size changes on the settings page.
- Clicking "Save" applies the font-size across the app (the system excludes specific protected pages: `home`, `signin`, `signup` to preserve branding/layout).
- Scaling is proportional — headings, small text, and `.lead` scale relative to `--base-font-size` and `--font-scale` CSS variables.
- Preferences are persisted to `localStorage`.

Key files:

- `medicare1/src/styles.scss` — CSS variables and scaling rules
- `medicare1/src/app/components/navbar/settings/*` — settings UI and logic

## Project structure (high-level)

- `medicare1/` — Angular code, components, global styles, and configuration
	- `src/app/` — main app modules, routes, components (navbar, pages, dashboards, services)
	- `src/styles.scss` — global styles and font-size accessibility rules

- `medicare2/` — Python scripts and microservices (DB helpers, notification helpers, routers)

## Development notes & conventions

- Follow Angular style guide for structure and naming.
- Keep UI state in components; use services for shared logic and HTTP requests.
- Use SCSS variables and CSS custom properties for theme / scaling consistency.

## Testing

- Backend tests currently: `test_api.py`, `test_backend.py` at repository root
- Frontend: if present, run `ng test` inside `medicare1/`

## Linting & CI

Recommended additions (not currently included):

- GitHub Actions to run tests and lint on PRs
- A formatter and linter for frontend (Prettier + ESLint/TSLint) and backend (flake8/black)

## Contributing

1. Fork the repo and create a feature branch
2. Make changes, add tests and update docs
3. Run tests and ensure linting passes
4. Open a PR with a clear description of changes

If you'd like, I can create a GitHub Actions workflow and a CONTRIBUTING.md with a code of conduct.

## Next steps (optional tasks I can do for you)

- Add `requirements.txt` for `medicare2` if missing
- Add a minimal GitHub Actions workflow for building/testing the frontend & running Python tests
- Add more detailed API documentation for backend routes
- Create CONTRIBUTING.md and CODE_OF_CONDUCT.md

---

If you want the README tailored to a specific audience (deployers, developers, or product stakeholders), tell me which one and I will expand the README with environment-specific instructions and diagrams.

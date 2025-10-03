<!-- .github/copilot-instructions.md -->

# Copilot / AI Agent instructions for this repository

Purpose: give an AI coding agent the minimal, actionable context to be productive working on the Playwright test suite in this repo.

- Big picture

  - This is a Playwright Test repository (see `package.json` and `playwright.config.ts`). Tests live under `tests/`, page objects under `pages/`.
  - `playwright.config.ts` defines: `testDir: ./tests`, `testIdAttribute: "data-test"`, `baseURL` (default `https://practicesoftwaretesting.com`), trace/video/screenshot policies, and a special `setup` project that creates persistent auth state.
  - CI (GitHub Actions) runs `npm ci`, installs Playwright browsers (`npx playwright install --with-deps`) and runs `npx playwright test`. Workflow: `.github/workflows/playwright.yml`.

- Key files to read/use

  - `playwright.config.ts` — global test rules, projects (`setup`, `chromium`), reporter settings.
  - `package.json` — scripts: `test`, `test:chromium`, `test:first`, `test:local`, `test:report`, `test:ui`.
  - `tests/auth.setup.ts` — example setup project that signs in and writes storage state to `.auth/customer01.json`.
  - `tests/homepage/home.spec.ts` and `tests/login/login.spec.ts` — exemplar tests (visual, auth, page-object usage).
  - `pages/login/loginPage.ts` — page object pattern used in the suite (constructors store Locators and expose actions).
  - `playwright-report/` and `tests/**-snapshots/` — where reports and snapshots are stored/checked into the repo.

- Repository conventions and patterns (explicit)

  - Selectors use data-test attributes. Tests typically use `page.getByTestId('...')`. `playwright.config.ts` sets `testIdAttribute: 'data-test'`.
  - Auth setup is done by the `setup` project (matched by `*.setup.ts`) which writes storage state files under `.auth/`. Other tests opt-in with `test.use({ storageState: '.auth/customer01.json' })`.
  - Visual snapshot files are stored next to tests in `*-snapshots/` folders. Don't rename snapshot images without updating expectations.
  - Page objects live in `pages/` and export classes (e.g., `LoginPage`) that accept a `Page` in the constructor and expose Locators and actions.
  - Tests are grouped with `test.describe` and may use `test.beforeEach` / `test.use` for shared setup.
  - Playwright traces/videos/screenshots settings are enabled in `playwright.config.ts` (trace: on, video: retain-on-failure, screenshot: only-on-failure).

- How to run locally (Windows PowerShell examples)

  - Install deps (first time):
    ```powershell
    npm ci
    npx playwright install
    ```
  - Run full test suite (same as `npm test`):
    ```powershell
    npx playwright test
    # or
    npm run test
    ```
  - Run only chromium project:
    ```powershell
    npx playwright test --project=chromium
    # or
    npm run test:chromium
    ```
  - Run the `test:local` script (package.json uses a POSIX env var). In PowerShell do:
    ```powershell
    $env:BASE_URL = 'http://localhost:4200'; npx playwright test
    ```
    (Alternatively add cross-env to `devDependencies` to make `BASE_URL=...` compatible across shells.)

- CI and safety notes for agents

  - `playwright.config.ts` sets `forbidOnly: !!process.env.CI` — do not leave `test.only` in committed code; CI will fail.
  - The workflows expect Playwright browsers to be installed (`npx playwright install --with-deps`) and that `npm ci` is used to install dependencies.
  - Tests rely on storage-state files created by the `setup` project (`.auth/customer01.json`). Avoid renaming or deleting those files without updating tests that reference them.

- Typical changes an agent may perform (recommended small edits)

  - Add new page objects under `pages/` when adding page-specific interactions.
  - Add tests under `tests/<feature>/` and, if they require an authenticated session, either consume an existing storageState or add a `*.setup.ts` file and wire it via the `setup` project pattern.
  - When changing config values (timeouts, baseURL, reporters), update `.github/workflows/playwright.yml` if the CI behavior must change.

- Quick examples (copyable patterns found in repo)
  - Use data-test selectors:
    page.getByTestId('login-submit')
  - Page object pattern (see `pages/login/loginPage.ts`):
    const login = new LoginPage(page); await login.login(email, password);
  - Setup storageState (see `tests/auth.setup.ts`):
    await context.storageState({ path: '.auth/customer01.json' });

If anything here is unclear or you'd like extra detail (example-driven patterns, more commands, or CI matrix notes), tell me which areas to expand and I'll iterate.

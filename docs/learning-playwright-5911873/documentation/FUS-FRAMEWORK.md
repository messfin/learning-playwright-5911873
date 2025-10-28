## FusionWW Playwright Framework (FUS-1/2/3)

This document explains the directory layout, fixtures, POM usage, and test examples for FusionWW scenarios.

### Directory Layout

```
lib/
  config/           # Shared configuration and environment
  fixtures/         # Test fixtures (base, pages, console, config)
  helpers/          # Helper utilities (arrays, states, etc.)
  pages/            # Page Object Model classes
  utils/            # Data utilities
tests/
  fusionww/         # FUS-1/2/3 spec files
```

### Fixtures

- `base.fixture.ts`: merges page, console, and config fixtures so tests import from `@fixtures/base.fixture` once.
- `pages.fixture.ts`: creates typed instances of POMs for each test.
- `console.fixture.ts`: collects console messages and adds matcher `toHaveNoConsoleErrors`.
- `config.fixture.ts`: provides `config` object loaded from environment via `lib/config/env.ts`.

### Page Objects

POMs live in `lib/pages/fusionww`. They wrap locators and expose semantic actions like `openRegistrationModal`, `clickRegisterNow`, etc., keeping tests readable and focused on intent.

### Test Data and Env

- `lib/config/env.ts`: loads environment with `dotenv`. Configure `BASE_URL`, `TEST_ENV`, and credentials via `.env`.
- `lib/utils/testData.ts`: provides `uniqueEmail`, `randomString`, and `readJson` for external data files.

### Running Tests

```
npm test
npm run test:chromium
BASE_URL=https://www.fusionww.com/ npx playwright test tests/fusionww
```

### Best Practices

- Use async/await and explicit waits tied to UI state
- Keep selectors resilient (data attributes or robust text/role)
- POM methods return `Promise<void>` and avoid hard-coded pauses
- Centralize config and data; avoid inline secrets
- Prefer fixtures over `beforeEach` for object creation

### Registration Flow (FUS-2/FUS-3)

This section outlines the end-to-end registration journey covered by the FUS tests.

1. Navigate to the website

   - Open the FusionWW homepage (e.g., `https://www.fusionww.com/` or `BASE_URL`).

2. Verify landing page

   - Confirm the URL is correct and page is loaded.

3. Accept cookies

   - If the cookie consent banner appears, accept it to proceed.

4. Open registration modal

   - Use the account/registration entry point to open the modal.

5. Verify modal elements

   - Ensure account and register buttons are visible.

6. Click modal title (optional)

   - Validate the modal header interaction if applicable.

7. Click "Register Now"

   - Proceed to the registration form view within the modal.

8. Fill in registration form

   - First Name, Last Name, Email (use `uniqueEmail()` for isolation)
   - Geographical Region (e.g., Americas)
   - Password and Confirm Password

9. Verify inputs

   - Assert field values and visibility after each entry.

10. Close modal

- Dismiss the modal when done; state should be preserved where applicable.

Notes:

- Validate geographical region selection via the displayed button value after selection.
- Keep assertions focused on visible state and correctness rather than brittle timing.

## Cucumber run steps

### Install dependencies

```bash
npm install
```

### Run all features

```bash
npx cucumber-js --config cucumber.config.js
```

### Run a specific feature

```bash
npx cucumber-js tests/mestest/features/registration.feature --config cucumber.config.js
```

### Filter by scenario name

```bash
npx cucumber-js --config cucumber.config.js --name "Complete registration form"
```

### View JSON report

The run outputs `reports/cucumber_report.json` (configured in `cucumber.config.js`).

### Notes

- Step timeouts are increased in `testsm/registrationSteps.ts` via `setDefaultTimeout(60000)`.
- Playwright browser is launched in the steps; an `After` hook closes the browser.
- If you see an ESM warning for `.ts` imports, you can ignore it or add "type": "module" to `package.json`.

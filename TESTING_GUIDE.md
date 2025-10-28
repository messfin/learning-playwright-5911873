# Testing Guide - JavaScript and TypeScript Commands

This guide provides step-by-step instructions for running both JavaScript and TypeScript tests in this Playwright project.

## Prerequisites

Make sure you have the following installed:

- Node.js (v18.20.8 or higher)
- npm
- Playwright browsers installed

## Installation Commands

```bash
# Install Playwright browsers (if not already installed)
npx playwright install

# Install TypeScript dependencies
npm install ts-node @types/node

# Install project dependencies
npm install
```

## JavaScript Testing

### 1. Simple JavaScript Test (Recommended)

**File:** `testsm/test-login.js`

```bash
# Navigate to testsm directory
cd testsm

# Run the JavaScript test
node test-login.js
```

**Expected Output:**

```
Starting login test...
Navigating to login page...
Entering credentials...
Clicking sign in...
Current URL: https://binaryville.com/account/?email=test%40example.com&password=pass123#
✅ Test passed: Email and password found in URL
```

### 2. Playwright Test Runner (JavaScript)

```bash
# Run all Playwright tests
npm test

# Run specific test file
npx playwright test testsm/test-login.js

# Run with UI mode
npm run test:ui

# Run with specific browser
npm run test:chromium
```

## TypeScript Testing

### 1. Cucumber with TypeScript

**Files:**

- `testsm/loginsteps/loginSteps.ts` (step definitions)
- `tests/mestest/features/login.feature` (feature file)

#### Method 1: Using ts-node/register

```bash
# Navigate to testsm directory
cd testsm

# Run Cucumber with TypeScript support
npx cucumber-js ../tests/mestest/features/login.feature --require ts-node/register --require loginsteps/loginSteps.ts
```

#### Method 2: Using require-module

```bash
# Navigate to testsm directory
cd testsm

# Alternative Cucumber command
npx cucumber-js ../tests/mestest/features/login.feature --require-module ts-node/register --require loginsteps/loginSteps.ts
```

#### Method 3: Using ts-node directly

```bash
# Navigate to testsm directory
cd testsm

# Run with ts-node
npx ts-node -r @cucumber/cucumber loginsteps/loginSteps.ts
```

### 2. Playwright Test Runner (TypeScript)

```bash
# Run TypeScript tests with Playwright
npx playwright test testsm/loginsteps/loginSteps.ts

# Run all tests in testsm directory
npx playwright test testsm/

# Run with specific configuration
npx playwright test --config playwright.config.ts
```

### 3. Direct TypeScript Execution

```bash
# Navigate to testsm directory
cd testsm

# Run TypeScript file directly
npx ts-node loginsteps/loginSteps.ts
```

## Configuration Files

### tsconfig.json

Ensure your `tsconfig.json` includes proper module resolution:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### cucumber.json (if needed)

Create a `cucumber.json` file in the root directory:

```json
{
  "default": {
    "require": ["testsm/loginsteps/loginSteps.ts"],
    "requireModule": ["ts-node/register"]
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot use import statement outside a module"

**Solution:** Use ts-node/register or configure module resolution

#### 2. "Cannot find module '../browserSetup'"

**Solution:** Check file paths and ensure proper exports

#### 3. "ts-node/register not found"

**Solution:** Install ts-node: `npm install ts-node`

#### 4. Cucumber not finding step definitions

**Solution:** Ensure proper require paths and file extensions

## Quick Reference Commands

### JavaScript Tests

```bash
# Quick JS test
cd testsm && node test-login.js

# Playwright JS tests
npm test
```

### TypeScript Tests

```bash
# Cucumber TS test
cd testsm && npx cucumber-js ../tests/mestest/features/login.feature --require ts-node/register --require loginsteps/loginSteps.ts

# Playwright TS tests
npx playwright test testsm/
```

### Development Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run with UI
npm run test:ui

# Generate test report
npm run test:report
```

## File Structure

```
testsm/
├── loginsteps/
│   └── loginSteps.ts          # Cucumber step definitions
├── browserSetup.ts            # Browser configuration
├── test-login.js             # JavaScript test
└── auth.setup.ts             # Authentication setup

tests/mestest/features/
└── login.feature             # Cucumber feature file
```

## Best Practices

1. **Use JavaScript for simple tests** - Faster execution, no compilation needed
2. **Use TypeScript for complex projects** - Better type safety and IDE support
3. **Keep step definitions organized** - Group related steps in the same file
4. **Use proper imports** - Ensure all dependencies are correctly imported
5. **Test in headless mode for CI** - Use `headless: true` for automated testing

## Environment Variables

Create a `.env` file for environment-specific settings:

```env
BASE_URL=https://binaryville.com
HEADLESS=true
BROWSER=chromium
```

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npm test
```

---

**Note:** This guide covers the most common testing scenarios. For advanced configurations, refer to the official Playwright and Cucumber documentation.

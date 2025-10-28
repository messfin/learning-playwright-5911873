# FusionWW Playwright Test Automation Framework

**Complete Framework Documentation and User Guide**

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Framework Architecture](#framework-architecture)
4. [Getting Started](#getting-started)
5. [Configuration and Test Data](#configuration-and-test-data)
6. [Test Execution](#test-execution)
7. [Registration Flow Testing](#registration-flow-testing)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This project is a comprehensive test automation suite built using Playwright for the FusionWW application. It provides automated testing coverage for core functionalities including registration, login, and homepage interactions. The framework follows industry best practices with a structured Page Object Model architecture, reusable fixtures, and modular test organization for enhanced maintainability and readability.

### Key Features

- **Page Object Model (POM)**: Encapsulates page interactions for better code reusability
- **Fixture-based Architecture**: Provides consistent test setup and teardown
- **TypeScript Support**: Ensures type safety and enhanced IDE support
- **CI/CD Integration**: GitHub Actions workflows for automated test execution
- **Console Error Monitoring**: Automatic detection of browser console errors
- **Environment Configuration**: Flexible configuration management across environments

---

## Project Structure

```
learning-playwright-5911873/
├── documentation/          # Framework and test documentation
│   └── registration-flow.md
├── lib/
│   ├── config/            # Environment configuration
│   │   └── env.ts
│   ├── fixtures/          # Test fixtures
│   │   ├── base.fixture.ts
│   │   ├── pages.fixture.ts
│   │   ├── console.fixture.ts
│   │   └── config.fixture.ts
│   ├── helpers/           # Utility helpers
│   ├── pages/             # Page Object Model classes
│   │   └── fusionww/
│   └── utils/             # Data utilities
│       └── testData.ts
├── tests/
│   └── fusionww/          # FUS-1/2/3 test specifications
├── .github/
│   └── workflows/         # CI/CD pipeline definitions
├── .env                   # Environment variables (not committed)
├── package.json           # Project dependencies and scripts
├── playwright.config.ts   # Playwright configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Framework Architecture

### Core Components

#### 1. Fixtures

The framework implements a modular fixture architecture that provides reusable test dependencies.

**base.fixture.ts**: Central fixture merging page, console, and config fixtures

**pages.fixture.ts**: Creates typed POM instances for each test

**console.fixture.ts**: Collects console messages and provides toHaveNoConsoleErrors matcher

**config.fixture.ts**: Provides config object from environment variables

#### 2. Page Object Model

POMs in `lib/pages/fusionww` encapsulate page-specific locators and expose semantic actions:

- openRegistrationModal()
- clickRegisterNow()
- fillRegistrationForm()
- acceptCookies()
- verifyLandingPage()

#### 3. Test Utilities

**Test Data Generation** (lib/utils/testData.ts):

- uniqueEmail(): Generates unique email addresses
- randomString(): Creates random strings
- readJson(): Reads test data from JSON files

---

## Getting Started

### Prerequisites

- Node.js: Version 16.x or higher
- npm: Node Package Manager
- Git: Version control system

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd learning-playwright-5911873
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Configure environment - create `.env` file:
   ```bash
   BASE_URL=https://www.fusionww.com/
   TEST_ENV=staging
   ```

---

## Configuration and Test Data

### Environment Configuration

**lib/config/env.ts** manages configuration using dotenv:

- BASE_URL: Application base URL
- TEST_ENV: Target environment (dev, staging, production)
- USERNAME: Test user credentials
- PASSWORD: Test user password

**Security Note**: Never commit .env file to version control.

### Test Data Management

**lib/utils/testData.ts** provides helpers:

```typescript
const email = uniqueEmail();
const username = randomString(10);
const testData = readJson("./data/users.json");
```

---

## Test Execution

### Running Tests

```bash
# Run all tests
npm test

# Run tests in Chromium only
npm run test:chromium
npx playwright test --project=chromium

# Run FusionWW tests
npx playwright test tests/fusionww

# Run with custom base URL
BASE_URL=https://www.fusionww.com/ npx playwright test

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run by tag
npx playwright test --grep @smoke
```

### Test Reports

View HTML report:

```bash
npx playwright show-report
```

---

## Registration Flow Testing (FUS-2/FUS-3)

### Test Scenario Overview

The registration flow tests validate the complete user journey from landing page to registration form completion.

### Detailed Test Steps

#### Step 1: Navigate to the Website

Navigate to FusionWW homepage using configured BASE_URL.

#### Step 2: Verify Landing Page

Confirm URL, page title, and essential elements are visible.

#### Step 3: Accept Cookies

Handle cookie consent banner if present.

#### Step 4: Open Registration Modal

Trigger registration modal via account/registration entry point.

#### Step 5: Verify Modal Elements

Assert account button, register button, and modal title are visible.

#### Step 6: Click Modal Title (Optional)

Validate modal header interactions.

#### Step 7: Click "Register Now" Button

Proceed to registration form view.

#### Step 8: Fill in Registration Form

Complete all required fields:

- First Name: Valid name format
- Last Name: Valid name format
- Email Address: Use uniqueEmail() for isolation
- Geographical Region: Select from dropdown (e.g., "Americas")
- Password: Meet complexity requirements
- Confirm Password: Must match password

#### Step 9: Verify Input Fields

Verify:

- Field values are correctly populated
- Input visibility and enabled state
- No validation errors for valid inputs
- Geographical region displays correct value

#### Step 10: Close Modal

Dismiss modal and verify:

- Modal closes successfully
- Page state is preserved
- No console errors logged

### Validation Guidelines

- Validate geographical region via displayed button value
- Focus on visible state over timing-dependent checks
- Test both valid and invalid inputs
- Verify state preservation when reopening modal

### Important Notes

- Always use uniqueEmail() for test isolation
- Include negative test cases for validation errors
- Use POM methods instead of direct Playwright API calls
- Monitor console errors with toHaveNoConsoleErrors matcher
- Consider accessibility checks for WCAG compliance

---

## Best Practices

### Code Quality

**Async/Await Patterns**

- Use async/await with explicit waits tied to UI state
- Avoid fixed timeouts like page.waitForTimeout()

**Resilient Selectors**
Selector priority:

1. Data attributes: [data-testid="register-button"]
2. Role selectors: page.getByRole('button', { name: 'Register' })
3. Text content: page.getByText('Register Now')
4. CSS selectors: button.register-btn (use sparingly)

### Architecture Patterns

**Method Signatures**

- POM methods return Promise<void>
- Avoid hard-coded delays

**Centralized Configuration**

- Store config and test data centrally
- Never hardcode secrets or environment values

**Fixtures Over Hooks**

- Use fixtures for object creation
- Better test isolation and parallel execution

### Testing Strategies

- Test Independence: Each test runs independently
- Data Cleanup: Clean up test data after execution
- Error Handling: Include proper error handling
- Test Documentation: Use descriptive names and comments
- Assertion Specificity: Use specific assertions

---

## Troubleshooting

### Common Issues

**Flaky Tests**

- Use proper wait strategies
- Verify stable selectors
- Check for race conditions
- Add explicit waits for network requests

**Environment Issues**

- Confirm .env configuration
- Verify BASE_URL is correct
- Check environment variables are set
- Validate network access

**Modal Interaction Failures**

- Check for overlay elements blocking clicks
- Ensure animations complete before interactions
- Verify z-index stacking
- Wait for modal 'visible' state

**Console Error Detection**

- Review browser console output
- Filter known warnings
- Configure error matcher patterns
- Check third-party script errors

**CI/CD Pipeline Failures**

- Ensure browsers installed in CI
- Verify environment variables in CI
- Check timezone differences
- Increase timeouts for CI
- Review CI logs for constraints

### Debug Commands

```bash
# Headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Generate traces
npx playwright test --trace on

# View traces
npx playwright show-trace trace.zip

# Verbose output
npx playwright test --reporter=line
```

---

## Conclusion

This framework provides a robust foundation for FusionWW test automation. By following established patterns and best practices, teams can create reliable, readable tests that validate application behavior across browsers and environments.

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Framework Version**: Playwright ^1.40.0

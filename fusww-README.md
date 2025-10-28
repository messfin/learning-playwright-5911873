# FusionWW Test Suite Documentation

## Overview

This documentation covers the FusionWW test suite, which includes two main test specifications (`fus-1.spec.ts` and `fus-2.spec.ts`) that test the FusionWW website functionality using Playwright with Page Object Model (POM) pattern.

## Test Specifications

### fus-1.spec.ts - Header Navigation and Request Quote Flow

**Purpose**: Tests the main header navigation and request quote functionality on the FusionWW website.

**Key Features Tested**:

- Header navigation through key sections (Shop, Industries, Quality, About, Insights)
- Request Quote button functionality
- Basic interaction with Request Quote form fields
- Sign In modal interaction within Request Quote flow
- Cookie consent handling

**Test Flow**:

1. Navigate to FusionWW homepage
2. Accept cookies if present
3. Test header navigation links
4. Click Request Quote button
5. Interact with form fields
6. Test Sign In functionality within the modal
7. Close modal

### fus-2.spec.ts - Registration Flow

**Purpose**: Tests the complete user registration process on the FusionWW website.

**Key Features Tested**:

- Registration modal opening
- Form field validation and interaction
- Geographical region selection
- Password confirmation
- Modal management and closing

**Test Flow**:

1. Navigate to FusionWW homepage
2. Accept cookies if present
3. Open registration modal
4. Fill registration form with test data
5. Select geographical region
6. Verify form field values
7. Close modal

## Folder Structure

```
lib/
├── fixtures/
│   ├── base.fixture.ts          # Main test fixture with merged test/expect
│   ├── console.fixture.ts       # Console logging fixture
│   └── pages.fixture.ts         # Page Object Model fixtures registration
└── pages/
    └── fusionww/
        ├── header.page.ts       # FusionWW header navigation POM
        ├── registration.page.ts # User registration POM
        └── request-quote.page.ts # Request quote form POM

tests/
├── fus-1.spec.ts               # Header navigation and request quote tests
├── fus-2.spec.ts               # Registration flow tests
└── fus-1.README.md             # Detailed fus-1 documentation
```

## Page Object Model (POM) Classes

### FusionHeader (`lib/pages/fusionww/header.page.ts`)

**Purpose**: Handles header navigation and main site interactions.

**Key Methods**:

- `goto()`: Navigates to FusionWW homepage
- `acceptCookiesIfPresent()`: Handles cookie consent banner

**Locators**:

- `acceptAllButton`: Cookie acceptance button
- `shopLink`: Shop navigation link
- `industriesLink`: Industries navigation link
- `qualityLink`: Quality navigation link
- `aboutLink`: About navigation link
- `insightsLink`: Insights navigation link
- `requestQuoteButton`: Request Quote button in header

### RequestQuotePage (`lib/pages/fusionww/request-quote.page.ts`)

**Purpose**: Manages the Request Quote form and modal interactions.

**Key Methods**:

- `acceptCookiesIfPresent()`: Robust cookie consent handling
- `ensureSignInClickable()`: Prepares page by hiding overlays
- `clickSignInSafe()`: Multi-strategy Sign In button clicking

**Locators**:

- Form fields: `firstName`, `lastName`, `email`, `phoneNumber`, `companyName`, `manufacturerPartNumber`, `comments`
- `signInButton`: Sign In button within the form
- `closeModalButton`: Modal close button

**Advanced Features**:

- Multi-strategy Sign In clicking (page, modal, iframe)
- Robust cookie banner dismissal
- Overlay interference handling

### RegistrationPage (`lib/pages/fusionww/registration.page.ts`)

**Purpose**: Handles the complete user registration process.

**Key Methods**:

- `goto()`: Navigates to FusionWW homepage
- `acceptCookiesIfPresent()`: Comprehensive cookie handling
- `openRegistrationModal()`: Opens the registration modal
- `clickRegisterNow()`: Initiates registration process
- `fillFirstName()`, `fillLastName()`, `fillEmail()`: Form field interactions
- `selectGeographicalRegion()`: Dropdown selection
- `fillPassword()`, `fillConfirmPassword()`: Password field handling
- `closeModalTwice()`: Robust modal closing with multiple strategies

**Locators**:

- `accountButton`: Account access button
- `registerButton`: Register button
- `modalTitle`: Modal title element
- `registerNowButton`: Register Now button
- Form inputs: `firstNameInput`, `lastNameInput`, `emailInput`, `passwordInput`, `confirmPasswordInput`
- `geographicalRegionButton`: Region selection dropdown
- `americasOption`: Americas region option
- `closeModalButton`: Modal close button

**Advanced Features**:

- Comprehensive cookie banner dismissal
- Interfering element removal
- Multi-strategy modal closing
- Form validation and interaction

## Fixtures

### Base Fixture (`lib/fixtures/base.fixture.ts`)

**Purpose**: Provides the main test and expect functions by merging page and console fixtures.

**Exports**:

- `test`: Merged test function from page and console fixtures
- `expect`: Merged expect function from page and console fixtures

### Pages Fixture (`lib/fixtures/pages.fixture.ts`)

**Purpose**: Registers all Page Object Model classes as test fixtures.

**Available Fixtures**:

- `loginPage`: LoginPage instance
- `accountPage`: AccountPage instance
- `messagesPage`: MessagesPage instance
- `contactPage`: ContactPage instance
- `fusionHeader`: FusionHeader instance
- `requestQuotePage`: RequestQuotePage instance
- `registrationPage`: RegistrationPage instance

### Console Fixture (`lib/fixtures/console.fixture.ts`)

**Purpose**: Provides console logging capabilities for debugging.

## Execution Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Playwright browsers installed

### Running the Tests

#### Run All Tests

```bash
npx playwright test
```

#### Run Specific Test Files

```bash
# Run fus-1 tests only
npx playwright test tests/fus-1.spec.ts

# Run fus-2 tests only
npx playwright test tests/fus-2.spec.ts

# Run both fus tests
npx playwright test tests/fus-*.spec.ts
```

#### Run with Debugging

```bash
# Run with trace on failure
npx playwright test tests/fus-1.spec.ts --trace=on

# View trace after failure
npx playwright show-trace test-results/<artifact-folder>/trace.zip

# Run in headed mode for visual debugging
npx playwright test tests/fus-1.spec.ts --headed
```

#### Run Specific Browsers

```bash
# Run on specific browser
npx playwright test tests/fus-1.spec.ts --project=chromium
npx playwright test tests/fus-1.spec.ts --project=firefox
npx playwright test tests/fus-1.spec.ts --project=webkit
```

### Test Focus

**Note**: `fus-1.spec.ts` currently uses `test.only` which means only this test will run when executing `npx playwright test`. Remove `test.only` before running broader test suites.

## Troubleshooting

### Common Issues

#### Cookie Banner Interference

- **Problem**: Cookie banners intercept clicks on other elements
- **Solution**: Both POMs include `acceptCookiesIfPresent()` methods with multiple selector strategies
- **Manual Fix**: The methods automatically handle various cookie banner implementations

#### Sign In Button Not Clickable

- **Problem**: Sign In button hidden behind overlays or not accessible
- **Solution**: `clickSignInSafe()` method tries multiple strategies:
  - In-page locators
  - Modal-scoped locators
  - Iframe locators (HubSpot forms)
  - Force clicks after hiding banners

#### Modal Closing Issues

- **Problem**: Modals don't close properly
- **Solution**: `closeModalTwice()` method uses multiple strategies:
  - Various close button selectors
  - Escape key fallback
  - Click outside modal
  - Force removal of modal elements

#### Slow External Site Responses

- **Problem**: FusionWW website may respond slowly
- **Solution**: Tests include appropriate timeouts and retry mechanisms
- **Manual Fix**: Re-run tests; network variance can affect timings

### Debugging Tips

1. **Use Trace**: Run tests with `--trace=on` to capture detailed execution traces
2. **Headed Mode**: Use `--headed` to watch tests run visually
3. **Slow Motion**: Use `--slow-mo=1000` to slow down execution for observation
4. **Console Logs**: Check browser console for any JavaScript errors
5. **Screenshots**: Tests automatically capture screenshots on failure

### Environment Variables

You can set these environment variables for different configurations:

```bash
# Set base URL (if different from default)
export BASE_URL=https://www.fusionww.com/

# Set timeout values
export TIMEOUT=30000

# Enable debug mode
export DEBUG=pw:api
```

## Best Practices

### Writing New Tests

1. **Use POM Pattern**: Always use the existing Page Object Model classes
2. **Extend Existing Classes**: Add new methods to existing POM classes rather than creating new ones
3. **Handle Cookies**: Always call `acceptCookiesIfPresent()` before interacting with elements
4. **Use Robust Selectors**: Prefer role-based and text-based selectors over CSS selectors
5. **Add Proper Waits**: Use `waitFor()` methods instead of fixed timeouts

### Maintaining Tests

1. **Update Selectors**: When UI changes, update locators in POM classes
2. **Test Regularly**: Run tests frequently to catch regressions early
3. **Keep Tests Focused**: Each test should focus on a specific functionality
4. **Clean Up**: Remove `test.only` and debug code before committing

## Dependencies

The test suite relies on the following key dependencies:

```json
{
  "@playwright/test": "^1.40.0",
  "typescript": "^5.0.0"
}
```

## Contributing

When adding new tests or modifying existing ones:

1. Follow the existing POM pattern
2. Add comprehensive error handling
3. Include proper documentation
4. Test your changes thoroughly
5. Update this README if adding new functionality

## Support

For issues or questions regarding the FusionWW test suite:

1. Check the troubleshooting section above
2. Review the test traces and screenshots
3. Check the browser console for errors
4. Verify the FusionWW website is accessible and functioning normally

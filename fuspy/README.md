# FusionWW Python Test Suite

This directory contains Python equivalents of the TypeScript Playwright tests for FusionWW website testing.

## Structure

```
fuspy/
├── fixtures/
│   ├── __init__.py
│   └── base_fixture.py          # Base fixtures for browser, page, and POM objects
├── pages/
│   ├── __init__.py
│   └── fusionww/
│       ├── __init__.py
│       ├── header_page.py       # FusionWW header page object
│       ├── request_quote_page.py # Request quote page object
│       └── registration_page.py # Registration page object
├── fus_1_test.py               # Header navigation and request quote flow test
├── fus_2_test.py               # Registration flow test
├── fus_3_test.py               # Detailed registration flow test (BDD style)
├── requirements.txt            # Python dependencies
├── pytest.ini                 # Pytest configuration
└── README.md                   # This file
```

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Install Playwright browsers:

```bash
playwright install
```

## Running Tests

Run all tests:

```bash
pytest
```

Run specific test:

```bash
pytest fus_1_test.py
pytest fus_2_test.py
pytest fus_3_test.py
```

Run with verbose output:

```bash
pytest -v
```

## Test Descriptions

### fus_1_test.py

- **Purpose**: Tests FusionWW header navigation and request quote flow
- **Features**:
  - Header link navigation (Shop, Industries, About)
  - Request quote modal interaction
  - Form field testing
  - Sign In modal testing

### fus_2_test.py

- **Purpose**: Tests FusionWW registration flow
- **Features**:
  - Registration modal opening
  - Form field filling (name, email, password)
  - Geographical region selection
  - Form validation

### fus_3_test.py

- **Purpose**: Detailed registration flow test with BDD-style structure
- **Features**:
  - Given-When-Then structure
  - Comprehensive form testing
  - Modal interaction testing
  - Form validation and cleanup

## Page Object Model (POM)

The tests use a Page Object Model pattern with the following classes:

- **FusionHeader**: Handles header navigation and cookie acceptance
- **RequestQuotePage**: Manages request quote form interactions
- **RegistrationPage**: Handles registration form and modal interactions

## Fixtures

The test suite uses pytest fixtures for:

- Browser management (session-scoped)
- Context management (function-scoped)
- Page management (function-scoped)
- Page object instantiation (function-scoped)

## Configuration

- **Timeout**: 90 seconds for registration tests
- **Browser**: Chromium with headless=False for debugging
- **Viewport**: 1920x1080
- **Slow motion**: 1000ms for better visibility during debugging



# Learning Playwright Project

## Overview
This project is a test suite built using Playwright for the FusionWW application. It includes automated tests for various functionalities such as registration, login, and homepage interactions. The tests are organized into a structured format, utilizing page objects and fixtures for better maintainability and readability.

## Project Structure
The project is organized as follows:

- **documentation/**: Contains documentation files, including the registration flow.
- **pages/**: Contains page object files that encapsulate the interactions with different pages of the application.
- **tests/**: Contains test files that define the test cases for various functionalities.
- **fixtures/**: Contains fixture files that provide common setup and teardown functionality for tests.
- **.github/**: Contains GitHub Actions workflows for CI/CD integration.
- **package.json**: Lists project dependencies and scripts.
- **playwright.config.ts**: Configuration settings for Playwright.
- **tsconfig.json**: TypeScript configuration file.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- npm (Node Package Manager).

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd learning-playwright-5911873
   ```
3. Install dependencies:
   ```
   npm ci
   npx playwright install
   ```

### Running Tests
To run the full test suite, use the following command:
```
npx playwright test
```

To run tests for a specific project (e.g., Chromium):
```
npx playwright test --project=chromium
```

### Documentation
- **Registration Flow**: Detailed steps for the registration process can be found in `documentation/registration-flow.md`.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
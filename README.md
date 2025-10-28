# Learning Playwright

## FusionWW E2E Test Framework

This repository now includes a scalable Playwright framework for FusionWW scenarios (FUS-1, FUS-2, FUS-3) using fixtures and Page Object Model (POM).

### Folder Structure

```
lib/
  config/
    env.ts                 # environment loader and shared runtime config
  fixtures/
    base.fixture.ts        # merges page, console and config fixtures
    pages.fixture.ts       # exposes POMs per test via fixtures
    console.fixture.ts     # console collection + custom matcher
    config.fixture.ts      # injects FrameworkConfig into tests
  helpers/
  pages/
    fusionww/
      header.page.ts
      request-quote.page.ts
      registration.page.ts
  utils/
    testData.ts            # utilities for data, unique emails, json loader

tests/
  fusionww/
    fus-1.spec.ts          # header nav + request quote flow
    fus-2.spec.ts          # registration flow
    fus-3.spec.ts          # optional: advanced registration assertions
```

### Run

- `npm test` – run all
- `npm run test:chromium` – chromium only
- `BASE_URL=https://www.fusionww.com/ npx playwright test tests/fusionww`

### Conventions

- Async/await everywhere, explicit test timeouts for long flows
- POMs encapsulate locators and actions; tests focus on intent
- Fixtures provide typed access to POMs and shared `config`
- Keep selectors resilient and descriptive; avoid brittle nth-child

This is the repository for the LinkedIn Learning course `learning-playwright`. The full course is available from [LinkedIn Learning][lil-course-url].

![learning-playwright][lil-thumbnail-url]

## Course Description

It’s no surprise that Playwright has joined the ranks of other top-rated open-source automation tools. Playwright’s comprehensive feature set allows testers and developers to quickly create new test automation projects without having to combine multiple libraries and other tools. Whether you’re a manual tester, a quality assurance specialist, a software developer, or a seasoned automation engineer, this course offers hands-on, practical experience with using some of the most important features of Playwright. Join instructor Butch Mayhew as he takes you through the essentials and prepares you to start writing, running, analyzing, and debugging your first test.

_See the readme file in the main branch for updated instructions and information._

## Instructions

This repository has branches for each of the videos in the course. You can use the branch pop up menu in github to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.

## Branches

The branches are structured to correspond to the videos in the course. The naming convention is `CHAPTER#_MOVIE#`. As an example, the branch named `02_03` corresponds to the second chapter and the third video in that chapter.
Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie. The `main` branch holds the final state of the code when in the course.

When switching from one exercise files branch to the next after making changes to the files, you may get a message like this:

    error: Your local changes to the following files would be overwritten by checkout:        [files]
    Please commit your changes or stash them before you switch branches.
    Aborting

To resolve this issue:
Add changes to git using this command: git add .
Commit changes using this command: git commit -m "some message"

## Using the Course Repository

1. To use these exercise files, you must have the following installed:
   - Current, Active, or Maintenance version of [node](https://nodejs.org/en/about/previous-releases) | [node installer](https://nodejs.org/en/download/prebuilt-installer)
   - [GIT](https://github.com/git-guides/install-git) for command line only or [GitHub Desktop](https://github.com/apps/desktop) for a GUI experience.
   - [VS Code](https://code.visualstudio.com/) Code Editor
   - [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
   - The rest of the steps are covered in the course
2. Clone this repository into your local machine using the terminal (Mac), CMD (Windows), or a GUI tool like SourceTree.
3. Utilize the [RESOURCES.md](./RESOURCES.md) file to follow along with all the links to the course.

## Project structure (this repo)

The key folders you will use when running tests in this project:

- `tests/`: All Playwright specs
  - `tests/fus-1.spec.ts`: FusionWW header navigation and Request Quote flow (focused with `test.only`)
- `lib/fixtures/`: Custom Playwright fixtures
  - `lib/fixtures/base.fixture.ts`: Exports `test`/`expect` used by specs, wires in base test behavior
  - `lib/fixtures/pages.fixture.ts`: Registers page objects so specs can inject them as fixtures
- `lib/pages/`: Page Objects (POM)
  - `lib/pages/fusionww/header.page.ts`: POM for the FusionWW global header (nav links, Request Quote button, cookie accept)
  - `lib/pages/fusionww/request-quote.page.ts`: POM for the Request Quote page/modal (form fields, Sign In flow, cookie/overlay handling)
- `playwright.config.ts`: Global Playwright configuration (projects, retries, report, etc.)
- `package.json`: Scripts to run tests, linting, etc.

### Execution flow for `tests/fus-1.spec.ts`

- The spec imports `test` from `@fixtures/base.fixture`, which chains into `lib/fixtures/pages.fixture.ts` to provide fixtures.
- Fixture injection provides these POM instances to the test:
  - `fusionHeader` → `lib/pages/fusionww/header.page.ts`
  - `requestQuotePage` → `lib/pages/fusionww/request-quote.page.ts`
- High-level steps the test performs:
  1. `fusionHeader.goto()` navigates to `https://www.fusionww.com/`.
  2. `fusionHeader.acceptCookiesIfPresent()` closes cookie consent if visible.
  3. Clicks header links (Shop, Industries, Quality, About, Insights).
  4. Clicks `fusionHeader.requestQuoteButton` to open Request Quote.
  5. Interacts with form fields on `requestQuotePage`.
  6. Calls `requestQuotePage.clickSignInSafe()` which:
     - Dismisses cookie/consent banners.
     - Tries to click Sign In in-page, inside modals, or inside iframes (e.g., HubSpot forms), with safe fallbacks.
  7. Closes the modal via `requestQuotePage.closeModalButton` if needed.

### Running just the fus-1 spec

- The test is currently focused with `test.only`, so running the test runner will execute it by itself:

```bash
npx playwright test
```

If you remove `test.only`, you can run it directly by path:

```bash
npx playwright test tests/fus-1.spec.ts
```

## Instructor

Butch Mayhew

Playwright Ambassador

Check out my other courses on [LinkedIn Learning](https://www.linkedin.com/learning/instructors/butch-mayhew?u=104).

[0]: # "Replace these placeholder URLs with actual course URLs"
[lil-course-url]: https://www.linkedin.com/learning/learning-playwright/
[lil-thumbnail-url]: https://media.licdn.com/dms/image/v2/D4D0DAQH9KXFauT3_nw/learning-public-crop_675_1200/learning-public-crop_675_1200/0/1730827611420?e=2147483647&v=beta&t=Hgonc3KqLVcsREG50BjKBFZ07NP2DY-pksa9-Oweu7Q

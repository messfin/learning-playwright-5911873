## FusionWW Request Quote flow — fus-1.spec.ts

### What this test covers
- Header navigation through key sections (Shop, Industries, Quality, About, Insights)
- Opening Request Quote from the header
- Basic interaction with Request Quote fields
- Invoking Sign In within the Request Quote modal with robust cookie/overlay handling

### Files involved
- Spec
  - `tests/fus-1.spec.ts`

- Fixtures
  - `lib/fixtures/base.fixture.ts` — exports `test`/`expect`
  - `lib/fixtures/pages.fixture.ts` — registers POM fixtures used by the spec

- Page Objects (POM)
  - `lib/pages/fusionww/header.page.ts`
    - `goto()`: navigates to `https://www.fusionww.com/`
    - `acceptCookiesIfPresent()`: dismisses cookie banner
    - `shopLink`, `industriesLink`, `qualityLink`, `aboutLink`, `insightsLink`
    - `requestQuoteButton`
  - `lib/pages/fusionww/request-quote.page.ts`
    - Field locators for First Name, Last Name, Email, Phone Number, Company Name, Manufacturer Part Number, Comments
    - `acceptCookiesIfPresent()`: robust cookie consent dismissal
    - `ensureSignInClickable()`: prepares page by hiding overlays
    - `clickSignInSafe()`: attempts Sign In via page, modal, and iframe strategies
    - `closeModalButton`: closes the modal

### Execution flow
1) `fusionHeader.goto()` and `fusionHeader.acceptCookiesIfPresent()`
2) Click header links (Shop → Industries → Quality → About → Insights)
3) Click `fusionHeader.requestQuoteButton`
4) Tap Request Quote fields (focus interactions)
5) `requestQuotePage.clickSignInSafe()` tries to click Sign In with:
   - In-page locators
   - Modal-scoped locators
   - Common iframe (HubSpot/form) locators
   - Force clicks after hiding common banners if needed
6) Close the modal if applicable

### How to run
- This spec is currently focused via `test.only`, so simply run:

```bash
npx playwright test
```

- To run by path (after removing `test.only`):

```bash
npx playwright test tests/fus-1.spec.ts
```

- To capture and inspect traces on failure:

```bash
npx playwright test tests/fus-1.spec.ts --trace=on
npx playwright show-trace test-results/<artifact-folder>/trace.zip
```

### Troubleshooting
- Cookie/consent banner intercepts clicks
  - Handled by `acceptCookiesIfPresent()` in both header and request-quote POMs
- Sign In not clickable / hidden in overlays
  - `clickSignInSafe()` hides common banners and tries candidates across page, modals, and iframes
- Slow external site responses
  - Re-run; network variance can affect timings

### Notes
- Keep `test.only` while iterating locally. Remove it before broader runs/CI.


# Fix: "require() cannot be used on an ESM graph with top-level await"

## Summary

A Playwright test file (`tests/test-1.spec.ts`) contained `await` expressions at the top-level (outside of any async function). Top-level `await` makes Node treat the module as ESM, but the test runner and some transforms in this repo expect CommonJS/`require()` loading. This caused the runtime error:

"Error: require() cannot be used on an ESM graph with top-level await. Use import() instead."

## Root cause

- `await` was used outside the `test(...)` callback, which is a top-level await.
- When Node sees top-level await it marks the module as ESM-only. The rest of the test tooling (and the Playwright transformer) attempted to `require()` the file under CommonJS which fails when the module graph contains a top-level await.

## What I changed

File modified:

- `tests/test-1.spec.ts`

Change summary:

- Moved all `await` calls into the `async ({ page }) => { ... }` test function body.
- Removed any standalone top-level `await` expressions.
- Gave the test a descriptive name and added brief comments for clarity.

This preserves the original interactions but ensures the file no longer contains top-level await, so it can be loaded via `require()`/CommonJS and run with the existing ts-node/Playwright setup.

## Why this fixes the problem

Top-level `await` forces ESM semantics for the whole module. By removing top-level awaits and placing asynchronous actions inside the `async` test callback, the file remains compatible with CommonJS-style require() used by parts of the toolchain.

## How I verified it

Run the single test file locally (PowerShell):

```powershell
npx playwright test tests/test-1.spec.ts -j 1
```

Expected outcome: the test file loads and runs. In the environment where the fix was applied, the test run completed successfully (tests passed).

## Suggested follow-ups

- Search the `tests/` and `testsm/` folders for any other files that use top-level `await` and fix them similarly.
- Replace fragile `click()`-only interactions with `.fill()` and `expect()` assertions to make tests more robust and meaningful.
- Prefer stable selectors (data-test attributes) over auto-generated class names where possible.
- Add a CI check to fail early if a test file contains `await` outside an async function (optional lint rule or custom script).

## Quick grep command to find top-level awaits in test files

```powershell
Select-String -Path "tests\**\*.ts","testsm\**\*.ts" -Pattern "^\s*await\s+" -List
```

This finds lines that start with `await` — not perfect, but it helps spot obvious top-level await usages.

## Commit / PR

I edited `tests/test-1.spec.ts` and verified the tests run. If you want, I can:

- Create a dedicated branch and open a PR with the change and this document.
- Search and fix other top-level-await occurrences automatically.

Let me know which follow-up you'd like next.

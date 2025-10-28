import { mergeExpects, mergeTests } from "@playwright/test";
import {
  test as pageTest,
  expect as pageExpect,
} from "@fixtures/pages.fixture";

import {
  test as consoleTest,
  expect as consoleExpect,
} from "@fixtures/console.fixture";
import {
  test as configTest,
  expect as configExpect,
} from "@fixtures/config.fixture";

export const test = mergeTests(pageTest, consoleTest, configTest);
export const expect = mergeExpects(pageExpect, consoleExpect, configExpect);

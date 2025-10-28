import { test as baseTest } from "@playwright/test";
import {
  loadFrameworkConfig,
  type FrameworkConfig,
} from "@pages/../config/env";

export const test = baseTest.extend<{ config: FrameworkConfig }>({
  config: async ({}, use) => {
    const config = loadFrameworkConfig();
    await use(config);
  },
});

export { expect } from "@playwright/test";



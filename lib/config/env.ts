import dotenv from "dotenv";

dotenv.config();

export type TestEnvironment = "dev" | "qa" | "staging" | "prod";

export type FrameworkConfig = {
  baseUrl: string;
  env: TestEnvironment;
  headless: boolean;
  trace: "on" | "off" | "retain-on-failure";
  users: {
    customerEmail?: string;
    customerPassword?: string;
    adminEmail?: string;
    adminPassword?: string;
  };
};

function getBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

export function loadFrameworkConfig(): FrameworkConfig {
  const env = (process.env.TEST_ENV as TestEnvironment) || "dev";
  const baseUrl =
    process.env.BASE_URL ||
    (env === "prod"
      ? "https://www.fusionww.com/"
      : "https://www.fusionww.com/");

  return {
    baseUrl,
    env,
    headless: getBoolean(process.env.HEADLESS, true),
    trace:
      (process.env.PW_TRACE as FrameworkConfig["trace"]) || "retain-on-failure",
    users: {
      customerEmail: process.env.CUSTOMER_EMAIL,
      customerPassword: process.env.CUSTOMER_PASSWORD,
      adminEmail: process.env.ADMIN_EMAIL,
      adminPassword: process.env.ADMIN_PASSWORD,
    },
  };
}



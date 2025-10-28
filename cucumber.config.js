module.exports = {
  default: {
    paths: [
      "tests/mestest/features/**/*.feature",
      "tests/features/**/*.feature",
      "features/**/*.feature",
    ],
    require: [
      "ts-node/register",
      "testsm/loginsteps/loginSteps.ts",
      "testsm/registrationSteps.ts",
    ],
    format: ["progress", "json:reports/cucumber_report.json"],
    formatOptions: {
      snippetInterface: "async-await",
    },
  },
};

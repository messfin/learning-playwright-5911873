module.exports = {
  default: {
    require: [
      'ts-node/register',
      'loginsteps/loginSteps.ts'
    ],
    format: ['progress', 'json:reports/cucumber_report.json'],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};



























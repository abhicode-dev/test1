import { join } from 'node:path';

export const config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  maxInstances: 1,
  baseUrl: 'https://www.lhh.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'cucumber',
  injectGlobals: true,
  services: [ ],
  reporters: [
    'spec',
    ['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: true
    }]
],
  cucumberOpts: {
    require: ['./features/step-definitions/**/*.js', './features/support/**/*.js'],
    timeout: 60000,
    failFast: false,
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failAmbiguousDefinitions: true,
    ignoreUndefinedDefinitions: false,
    snippets: true,
    source: true,
    strict: true,
    tagExpression: ''
  },
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--window-size=1440,1000']
    }
  }],
  onPrepare() {
    console.log('Starting LHH header navigation tests...');
  }
};

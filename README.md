# WebdriverIO + Cucumber + Page Object Model: LHH Header Navigation

This starter project uses WebdriverIO, Cucumber feature files, and the Page Object Model (POM).

## What it tests

1. Opens the LHH Luxembourg Insights page.
2. Clicks each header dropdown: Job Seekers, Organisations, Executives, Insights, and About.
3. Checks that visible menu links appear.
4. Opens each known Job Seekers submenu link and checks that navigation reaches the expected destination.

The HTML snapshot supplied for this exercise exposed the expanded Job Seekers menu only. The other four dropdowns are tested for opening, but their individual submenu URLs are not guessed. Add those destinations after inspecting the live menu.

## Requirements

- Node.js LTS
- Google Chrome
- Internet access to the target website

## Install and run

```bash
npm install
npm test
```

Run only this feature:

```bash
npm run test:header
```

The WebdriverIO ChromeDriver service manages ChromeDriver for the local test run. If your environment requires a separately installed ChromeDriver, follow the WebdriverIO service documentation for your installed versions.

## Project structure

```text
wdio-cucumber-header-framework/
├── features/
│   ├── header-navigation.feature
│   ├── step-definitions/
│   │   └── header.steps.js
│   └── support/
├── pageobjects/
│   ├── BasePage.js
│   └── HeaderPage.js
├── package.json
├── wdio.conf.js
└── README.md
```

## Page Object design

- `BasePage.js`: reusable navigation to the starting page.
- `HeaderPage.js`: locators and actions for the header dropdowns and known Job Seekers links.
- `header-navigation.feature`: readable business scenarios and examples.
- `header.steps.js`: connects Cucumber steps to page-object methods.

## Locator note

The captured IDs include GUID-like suffixes. The page object uses the stable-looking prefix before that suffix, for example `starts-with(@id, 'insights-btn-')`, rather than hard-coding the entire ID. This still needs to be checked against the live site because frontend markup can change.

The `Contact Us` link is intentionally not treated as a dropdown button. Its XPath from the captured HTML was `//a[normalize-space(.)='Contact Us']`.

## Adding other dropdown destinations

After opening Organisations, Executives, Insights, or About in the browser, inspect the visible links and record each link's exact label and `href`. Then add the label-to-URL mapping and page-object method(s), and add a Cucumber Scenario Outline with examples. Avoid guessing URLs.

import { Given, When, Then } from '@wdio/cucumber-framework';
import { browser, expect } from '@wdio/globals';
import HeaderPage from '../../pageobjects/HeaderPage.js';

const headerPage = new HeaderPage();


Given('I open the LHH Insights page', async () => {
  await headerPage.open();
});

When('I click the {string} dropdown button', async (heading) => {
  await headerPage.openDropdown(heading);
});

Then('the dropdown menu should display links', async () => {
  await headerPage.expectDropdownHasLinks();
});

// When('I select the {string} menu link', async (label) => {
//   await headerPage.clickJobSeekerLink(label);
// });
// When('I select the {string} menu link', async (label) => {
//   console.log('WHEN STEP EXECUTED:', label);

//   await headerPage.clickJobSeekerLink(label);

//   console.log('URL AFTER PAGE OBJECT:', await browser.getUrl());
// });
// When('I select the {string} menu link', async (label) => {
//   console.log('STEP STARTED:', label);

//   await headerPage.clickJobSeekerLink(label);

//   console.log('STEP FINISHED');
//   console.log('URL AFTER CLICK:', await browser.getUrl());
//   console.log('ALL TABS:', await browser.getWindowHandles());
// // });
// When('I select the {string} menu link', async (label) => {
//   const oldHandles = await browser.getWindowHandles();

//   await headerPage.clickJobSeekerLink(label);

//   // Wait for the new tab
//   await browser.waitUntil(
//       async () => (await browser.getWindowHandles()).length > oldHandles.length,
//       {
//           timeout: 10000,
//           timeoutMsg: 'New tab was not opened'
//       }
//   );

//   // Find the newly opened tab
//   const newHandles = await browser.getWindowHandles();

//   const newTab = newHandles.find(
//       handle => !oldHandles.includes(handle)
//   );

//   // Switch to the new tab
//   await browser.switchToWindow(newTab);

//   // Wait for navigation to finish
//   await browser.waitUntil(
//       async () => (await browser.getUrl()).includes('salesforce-sites.com'),
//       {
//           timeout: 15000,
//           timeoutMsg: 'Salesforce page did not load'
//       }
//   );

//   console.log('URL AFTER SWITCH:', await browser.getUrl());
// });
When('I select the {string} menu link', async (label) => {
  await headerPage.clickJobSeekerLink(label);
});

// Then('the browser URL should be the expected destination for {string}', async (label) => {
//   const expectedUrl = headerPage.expectedJobSeekerUrl(label);
//   await browser.waitUntil(async () => (await browser.getUrl()).startsWith(expectedUrl), {
//     timeout: 15000,
//     timeoutMsg: `Expected URL to start with ${expectedUrl}, but current URL is ${await browser.getUrl()}`
//   });
//   expect(await browser.getUrl()).toContain(expectedUrl);
// });
// Then('the browser URL should be the expected destination for {string}', async (label) => {

//   const expectedUrl = headerPage.expectedJobSeekerUrl(label);

//   await browser.waitUntil(
//       async () => (await browser.getUrl()).startsWith(expectedUrl),
//       {
//           timeout: 15000,
//           timeoutMsg: `Expected URL: ${expectedUrl}, Actual URL: ${await browser.getUrl()}`
//       }
//   );

//   const actualUrl = await browser.getUrl();

//   expect(actualUrl).toContain(expectedUrl);
// });
Then('the browser URL should be the expected destination for {string}', async (label) => {
  const expectedUrl = headerPage.expectedJobSeekerUrl(label);
  const actualUrl = await browser.getUrl();

  console.log('EXPECTED URL:', expectedUrl);
  console.log('ACTUAL URL:', actualUrl);

  expect(actualUrl).toContain(expectedUrl);
});

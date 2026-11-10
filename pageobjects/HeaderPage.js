
import { $, $$, browser, expect } from '@wdio/globals';
import BasePage from './BasePage.js';

const dropdownSlugs = {
    'Job Seekers': 'job seekers',
    'Organisations': 'organisations',
    'Executives': 'executives',
    'Insights': 'insights',
    'About': 'about'
};

const knownJobSeekerLinks = {
    'For Job Seekers': '/en-lu/job-seekers',
    'Search Open Jobs': '/en-lu/search-jobs',
    'Submit CV': 'https://foeurope.my.salesforce-sites.com/jobboard/JobRegisterForm?JobId=a1hSa000001bbxkIAA',
    'Start Your Outplacement Programme': '/en-lu/job-seekers/register-for-career-support',
    'Upskill your capabilities': '/en-lu/job-seekers/upskill-your-capabilities'
};

export default class HeaderPage extends BasePage {

    dropdownButton(label) {
        const slug = dropdownSlugs[label];

        if (!slug) {
            throw new Error(`Unknown dropdown heading: ${label}`);
        }

        return $(
            `//div[contains(@id,'-btn-') and starts-with(@id, ${JSON.stringify(`${slug}-btn-`)})]`
        );
    }

    async openDropdown(label) {
        await this.handleCookiePopup();

        const button = await this.dropdownButton(label);

        await button.waitForDisplayed();
        await button.click();
    }

    async getVisibleDropdownLinks() {
        const links = await $$('//a[contains(@class,"megamenu-link")]');
        const visible = [];

        for (const link of links) {
            if (await link.isDisplayed()) {
                visible.push(link);
            }
        }

        return visible;
    }

    async expectDropdownHasLinks() {
        await browser.waitUntil(
            async () => (await this.getVisibleDropdownLinks()).length > 0,
            {
                timeout: 10000,
                timeoutMsg: 'No visible dropdown links appeared'
            }
        );

        expect((await this.getVisibleDropdownLinks()).length)
            .toBeGreaterThan(0);
    }

    //async clickJobSeekerLink(label) {
        // if (!knownJobSeekerLinks[label]) {
        //     throw new Error(`No expected URL is configured for: ${label}`);
        // }

        // await this.handleCookiePopup();

        // const link = await $(
        //     `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
        // );

        // await link.waitForDisplayed();
        // await link.waitForClickable();
        
        // console.log('Link text:', await link.getText());
        // console.log('Link href:', await link.getAttribute('href'));
        // console.log('Link target:', await link.getAttribute('target'));
        
        // const oldHandles = await browser.getWindowHandles();
        
        // console.log('Before click URL:', await browser.getUrl());
        
        // await link.click();
        
        // await browser.pause(3000);
        
        // const newHandles = await browser.getWindowHandles();
        
        // console.log('Old handles:', oldHandles);
        // console.log('New handles:', newHandles);
        
        // for (const handle of newHandles) {
        //     await browser.switchToWindow(handle);
        //     console.log('Tab URL:', await browser.getUrl());
        // }
  
//         async clickJobSeekerLink(label) {
//           console.log('NEW PAGE OBJECT METHOD EXECUTED');
//           if (!knownJobSeekerLinks[label]) {
//               throw new Error(`No expected URL is configured for: ${label}`);
//           }
      
//           await this.handleCookiePopup();
      
//           const link = await $(
//               `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
//           );
      
//           await link.waitForDisplayed();
//           await link.waitForClickable();
      
//           console.log('Link href:', await link.getAttribute('href'));
//           console.log('Link target:', await link.getAttribute('target'));
      
//           const oldHandles = await browser.getWindowHandles();
      
//           await link.click();
//           console.log('UPDATED clickJobSeekerLink METHOD EXECUTED');
//           console.log('CLICK EXECUTED');

// await browser.pause(2000);

// const handles = await browser.getWindowHandles();

// console.log('TOTAL TABS:', handles.length);

// for (const handle of handles) {
//     await browser.switchToWindow(handle);

//     console.log('TAB URL:', await browser.getUrl());
// }
      
//           // Wait until a new browser tab opens
//           await browser.waitUntil(
//               async () => (await browser.getWindowHandles()).length > oldHandles.length,
//               {
//                   timeout: 10000,
//                   timeoutMsg: 'New browser tab did not open'
//               }
//           );
      
//           const newHandles = await browser.getWindowHandles();
      
//           // Identify the newly opened tab
//           const newTab = newHandles.find(
//               handle => !oldHandles.includes(handle)
//           );
      
//           // Switch to the new tab
//           await browser.switchToWindow(newTab);
      
//           // Wait for the expected destination
//           const expectedUrl = knownJobSeekerLinks[label];
      
//           await browser.waitUntil(
//               async () => (await browser.getUrl()).startsWith(expectedUrl),
//               {
//                   timeout: 15000,
//                   timeoutMsg: `Expected URL ${expectedUrl}, but got ${await browser.getUrl()}`
//               }
//           );
      
//           console.log('Navigated URL:', await browser.getUrl());
//             }    
// async clickJobSeekerLink(label) {
//   console.log('PAGE OBJECT METHOD EXECUTED:', label);

//   if (!knownJobSeekerLinks[label]) {
//       throw new Error(`No expected URL is configured for: ${label}`);
//   }

//   await this.handleCookiePopup();

//   const link = await $(
//       `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
//   );

//   await link.waitForDisplayed();
//   await link.waitForClickable();

//   console.log('Link href:', await link.getAttribute('href'));
//   console.log('Link target:', await link.getAttribute('target'));
//   console.log('URL BEFORE CLICK:', await browser.getUrl());

//   // Store the existing browser tabs
//   const oldHandles = await browser.getWindowHandles();

//   // Click the actual menu link
//   await link.click();
//   await browser.pause(3000);

// console.log('URL AFTER CLICK:', await browser.getUrl());

//   // Wait for a new tab to open
//   await browser.waitUntil(
//       async () => (await browser.getWindowHandles()).length > oldHandles.length,
//       {
//           timeout: 10000,
//           timeoutMsg: 'New browser tab did not open after clicking the link'
//       }
//   );

//   // Identify the new tab
//   const newHandles = await browser.getWindowHandles();
//   const newTab = newHandles.find(handle => !oldHandles.includes(handle));

//   // Switch to the new tab
//   await browser.switchToWindow(newTab);

//   console.log('CURRENT URL AFTER SWITCH:', await browser.getUrl());
// }
async clickJobSeekerLink(label) {
    console.log('PAGE OBJECT METHOD EXECUTED:', label);

    if (!knownJobSeekerLinks[label]) {
        throw new Error(`No expected URL is configured for: ${label}`);
    }

    await this.handleCookiePopup();

    const link = await $(
        `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
    );

    await link.waitForDisplayed();
    await link.waitForClickable();

    const oldUrl = await browser.getUrl();
    const oldHandles = await browser.getWindowHandles();

    await link.click();

    // Wait until either the URL changes or a new tab opens
    await browser.waitUntil(
        async () => {
            const currentUrl = await browser.getUrl();
            const currentHandles = await browser.getWindowHandles();

            return currentUrl !== oldUrl ||
                   currentHandles.length > oldHandles.length;
        },
        {
            timeout: 15000,
            timeoutMsg: `Navigation did not happen after clicking: ${label}`
        }
    );

    // Check whether a new tab was opened
    const newHandles = await browser.getWindowHandles();

    const newTab = newHandles.find(
        handle => !oldHandles.includes(handle)
    );

    // Switch only if a new tab exists
    if (newTab) {
        await browser.switchToWindow(newTab);
    }

    // Wait for the expected destination
    const expectedUrl = this.expectedJobSeekerUrl(label);

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes(expectedUrl),
        {
            timeout: 15000,
            timeoutMsg: `Expected URL was not loaded: ${expectedUrl}`
        }
    );

    console.log('FINAL URL:', await browser.getUrl());
}

    expectedJobSeekerUrl(label) {
        const pathOrUrl = knownJobSeekerLinks[label];

        return pathOrUrl.startsWith('http')
            ? pathOrUrl
            : `${browser.options.baseUrl}${pathOrUrl}`;
    }
  }

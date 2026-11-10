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
    if (!slug) throw new Error(`Unknown dropdown heading: ${label}`);
    // Avoids hard-coding the full GUID-like part of the ID from the captured HTML.
    return $(`//div[contains(@id,'-btn-') and starts-with(@id, ${JSON.stringify(`${slug}-btn-`)})]`);
  }
//   async handleCookiePopup() {
//     const strictlyNecessaryButton = await $('#onetrust-reject-all-handler');

//     // if (await strictlyNecessaryButton.isDisplayed()) {
//     //     await strictlyNecessaryButton.click();

//     //     await strictlyNecessaryButton.waitForDisplayed({
//     //         reverse: true,
//     //         timeout: 10000
//     //     });
//     // }

//     const overlay = await $('.onetrust-pc-dark-filter');

//     try {
//         await strictlyNecessaryButton.waitForDisplayed({
//             timeout: 5000
//         });
//     } catch (error) {
//         if (await overlay.isDisplayed()) {
//             throw new Error(
//                 'Cookie overlay is visible, but Strictly necessary button was not found.'
//             );
//         }

//         return;
//     }

//     await strictlyNecessaryButton.click();

//     await overlay.waitForDisplayed({
//         reverse: true,
//         timeout: 10000
//     });

//     console.log('Cookie popup handled successfully.');
// }

async handleCookiePopup() {
  const button = await $('#onetrust-reject-all-handler');

  try {
      await button.waitForDisplayed({
          timeout: 5000
      });

      await button.click();

      console.log('Strictly necessary button clicked');

  } catch (error) {
      console.log('Cookie button not displayed:', error.message);
  }
}




  async openDropdown(label) {
    await this.handleCookiePopup();
   const button = await this.dropdownButton(label);
   await button.waitForDisplayed();
    await button.click();
  }
  // async openDropdown(label) {
  //   await this.handleCookiePopup();
  //   const overlay = await $('.onetrust-pc-dark-filter');

  //   console.log('Overlay exists:', await overlay.isExisting());
    
  //   console.log(
  //       'Overlay class:',
  //       await browser.execute((selector) => {
  //           const element = document.querySelector(selector);
  //           return element ? element.className : 'Not found';
  //       }, '.onetrust-pc-dark-filter')
  //   );
    
  //   console.log(
  //       'Overlay display:',
  //       await browser.execute((selector) => {
  //           const element = document.querySelector(selector);
  //           return element ? getComputedStyle(element).display : 'Not found';
  //       }, '.onetrust-pc-dark-filter')
  //   );
  
  //   const button = await this.dropdownButton(label);
  
  //   await button.waitForDisplayed();
  //   await button.waitForClickable();
  //   await button.click();
  // }

  async getVisibleDropdownLinks() {
    const links = await $$('//a[contains(@class,"megamenu-link")]');
    const visible = [];
    for (const link of links) {
      if (await link.isDisplayed()) visible.push(link);
    }
    return visible;
  }

  async expectDropdownHasLinks() {
    await browser.waitUntil(async () => (await this.getVisibleDropdownLinks()).length > 0, {
      timeout: 10000,
      timeoutMsg: 'No visible dropdown links appeared after clicking the menu heading'
    });
    expect((await this.getVisibleDropdownLinks()).length).toBeGreaterThan(0);
  }
//   async clickJobSeekerLink(label) {
//     if (!knownJobSeekerLinks[label]) {
//         throw new Error(`No expected URL is configured for Job Seekers link: ${label}`);
//     }
//     await this.handleCookiePopup();
//     const link = await $(
//         `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
//     );

//     console.log('Link href:', await link.getAttribute('href'));
//     console.log('Target:', await link.getAttribute('target'));

//     const oldHandles = await browser.getWindowHandles();

//     await link.waitForDisplayed();
//     await link.click();

//     await browser.pause(3000);
//     console.log('All browser tabs:', await browser.getWindowHandles());
// console.log('Current URL:', await browser.getUrl());

// //     const newHandles = await browser.getWindowHandles();

// //     console.log('Old handles:', oldHandles);
// //     console.log('New handles:', newHandles);
// //     console.log('Current URL:', await browser.getUrl());
//  }
async clickJobSeekerLink(label) {
  await this.handleCookiePopup();

  const link = await $(
      `//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`
  );

  await link.waitForDisplayed();
  await link.waitForClickable();

  console.log('Link href:', await link.getAttribute('href'));
  console.log('Link target:', await link.getAttribute('target'));

  const oldHandles = await browser.getWindowHandles();

  await link.click();

  await browser.pause(2000);

  const newHandles = await browser.getWindowHandles();

  console.log('Old window handles:', oldHandles);
  console.log('New window handles:', newHandles);
  console.log('Current URL:', await browser.getUrl());
}
  expectedJobSeekerUrl(label) {
    const pathOrUrl = knownJobSeekerLinks[label];
    return pathOrUrl.startsWith('http') ? pathOrUrl : `${browser.options.baseUrl}${pathOrUrl}`;
  }


  async getVisibleDropdownLinks() {
    const links = await $$('//a[contains(@class,"megamenu-link")]');
    const visible = [];
    for (const link of links) {
      if (await link.isDisplayed()) visible.push(link);
    }
    return visible;
  }

  async expectDropdownHasLinks() {
    await browser.waitUntil(async () => (await this.getVisibleDropdownLinks()).length > 0, {
      timeout: 10000,
      timeoutMsg: 'No visible dropdown links appeared after clicking the menu heading'
    });
    expect((await this.getVisibleDropdownLinks()).length).toBeGreaterThan(0);
  }

//   async clickJobSeekerLink(label) {
//     const overlay = await $('.onetrust-pc-dark-filter');


// if (await overlay.isExisting()) {
//     console.log('Overlay class:', await overlay.getAttribute('class'));
// }
//     if (!knownJobSeekerLinks[label]) {
//       throw new Error(`No expected URL is configured for Job Seekers link: ${label}`);
//     }
//     const link = await $(`//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`);
//     await link.waitForDisplayed();
//     await link.click();
//   }

  expectedJobSeekerUrl(label) {
    const pathOrUrl = knownJobSeekerLinks[label];
    return pathOrUrl.startsWith('http') ? pathOrUrl : `${browser.options.baseUrl}${pathOrUrl}`;
  }


    
  
    async getVisibleDropdownLinks() {
      const links = await $$('//a[contains(@class,"megamenu-link")]');
      const visible = [];
      for (const link of links) {
        if (await link.isDisplayed()) visible.push(link);
      }
      return visible;
    }
  
    async expectDropdownHasLinks() {
      await browser.waitUntil(async () => (await this.getVisibleDropdownLinks()).length > 0, {
        timeout: 10000,
        timeoutMsg: 'No visible dropdown links appeared after clicking the menu heading'
      });
      expect((await this.getVisibleDropdownLinks()).length).toBeGreaterThan(0);
    }
  
    async clickJobSeekerLink(label) {
      if (!knownJobSeekerLinks[label]) {
        throw new Error(`No expected URL is configured for Job Seekers link: ${label}`);
      }
      const link = await $(`//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`);
      await link.waitForDisplayed();
      await browser.debug();
      await link.click();
    }
  
    expectedJobSeekerUrl(label) {
      const pathOrUrl = knownJobSeekerLinks[label];
      return pathOrUrl.startsWith('http') ? pathOrUrl : `${browser.options.baseUrl}${pathOrUrl}`;
    }
  
  
  async getVisibleDropdownLinks() {
    const links = await $$('//a[contains(@class,"megamenu-link")]');
    const visible = [];
    for (const link of links) {
      if (await link.isDisplayed()) visible.push(link);
    }
    return visible;
  }

  async expectDropdownHasLinks() {
    await browser.waitUntil(async () => (await this.getVisibleDropdownLinks()).length > 0, {
      timeout: 10000,
      timeoutMsg: 'No visible dropdown links appeared after clicking the menu heading'
    });
    expect((await this.getVisibleDropdownLinks()).length).toBeGreaterThan(0);
  }

  async clickJobSeekerLink(label) {
    if (!knownJobSeekerLinks[label]) {
      throw new Error(`No expected URL is configured for Job Seekers link: ${label}`);
    }
    console.log('Received label:', label);
    const link = await $(`//a[contains(@class,'megamenu-link') and normalize-space(.)=${JSON.stringify(label)}]`);
    await link.waitForDisplayed();
    
console.log('Found link text:', await link.getText());
console.log('Found link URL:', await link.getAttribute('href'));
   
    await link.click();

console.log('Expected URL:', this.expectedJobSeekerUrl(label));
  }

  expectedJobSeekerUrl(label) {
    const pathOrUrl = knownJobSeekerLinks[label];
    return pathOrUrl.startsWith('http') ? pathOrUrl : `${browser.options.baseUrl}${pathOrUrl}`;
  }
}

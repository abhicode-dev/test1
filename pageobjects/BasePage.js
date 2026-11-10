import { $,browser } from '@wdio/globals';

export default class BasePage {
  async open(path = '/en-lu/insights/badenoch-and-clark-and-spring-professional-are-now-lhh') {
    await browser.url(path);
    await this.handleCookiePopup();
  }

  async currentUrl() {
    return browser.getUrl();
  }
  // async handleCookiePopup() {

  //   const button = await $('#onetrust-reject-all-handler');

  //   try {

  //       await button.waitForDisplayed({
  //           timeout: 5000
  //       });

  //       await button.click();
  //       console.log('Strictly necessary button clicked');

  //     } catch (error) {
  //         console.log('Cookie button not displayed:', error.message);
  //     }

async handleCookiePopup() {
  const button = await $('#onetrust-reject-all-handler');

  try {
      await button.waitForDisplayed({
          timeout: 10000
      });

  } catch (error) {

      if (error.message.includes('still not displayed')) {
          console.log('Cookie popup did not appear. Continuing test...');
          return;
      }

      throw error;
  }

  // This runs only when the button is displayed.
  await button.click();

  //console.log('Reject All cookie button clicked successfully'); 
   await button.waitForDisplayed({
    reverse: true,
    timeout: 10000
});

console.log('Cookie popup dismissed successfully');

}


    //     console.log('Cookie button clicked');

    // } catch (error) {

    //     if (error.name === 'WaitUntilTimeoutError') {

    //         console.log('Cookie popup did not appear');

    //     } else {

    //         throw error;

    //     }
    
}

// async handleCookiePopup() {
//   const acceptAllButton = await $('#onetrust-accept-btn-handler');
//   const privacyCenterAcceptButton = await $('#accept-recommended-btn-handler');

//   if (await acceptAllButton.isDisplayed().catch(() => false)) {
//     await acceptAllButton.click();
//   } else if (await privacyCenterAcceptButton.isDisplayed().catch(() => false)) {
//     await privacyCenterAcceptButton.click();
//   }

//   const overlay = await $('.onetrust-pc-dark-filter');

//   await browser.waitUntil(
//     async () => !(await overlay.isDisplayed().catch(() => false)),
//     {
//       timeout: 10000,
//       timeoutMsg: 'OneTrust privacy overlay is still visible'
//     }
//   );
// }
// async handleCookiePopup() {
//   const acceptAllButton = await $('#accept-recommended-btn-handler');

//   const isVisible = await acceptAllButton
//       .isDisplayed()
//       .catch(() => false);

//   if (isVisible) {
//       await acceptAllButton.waitForClickable({ timeout: 10000 });
//       await acceptAllButton.click();

//       const overlay = await $('.onetrust-pc-dark-filter');

//       await overlay.waitForDisplayed({
//           reverse: true,
//           timeout: 10000
//       });
//   }


//}


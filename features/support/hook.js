import { AfterStep } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';

AfterStep(async function () {

    const screenshot = await browser.takeScreenshot();

    allure.addAttachment(
        'Screenshot after step',
        Buffer.from(screenshot, 'base64'),
        'image/png'
    );

});
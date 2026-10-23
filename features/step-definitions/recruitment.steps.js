
const { Given, Then } = require('@wdio/cucumber-framework');
const assert = require('node:assert/strict');

const PAGE_URL =
    'https://www.lhh.com/en-lu/organisations/recruitment-solutions';

Given('I open the LHH recruitment solutions page', async () => {
    await browser.url(PAGE_URL);
});

Then('the page should load successfully', async () => {
    await browser.waitUntil(
        async () => {
            return await browser.execute(
                () => document.readyState === 'complete'
            );
        },
        {
            timeout: 30000,
            timeoutMsg: 'Page did not finish loading'
        }
    );

    const currentUrl = new URL(await browser.getUrl());

    assert.equal(
        currentUrl.pathname,
        '/en-lu/organisations/recruitment-solutions'
    );
});

Then('the page title should not be empty', async () => {
    await browser.waitUntil(
        async () => (await browser.getTitle()).trim().length > 0,
        { timeout: 20000 }
    );

    assert.ok(
        (await browser.getTitle()).trim().length > 0,
        'Page title is empty'
    );
});

Then(
    'the recruitment page should contain visible content',
    async () => {
        const body = await $('body');
        await body.waitForDisplayed({ timeout: 20000 });

        const text = await body.getText();

        assert.ok(
            text.trim().length > 0,
            'Page body contains no visible text'
        );
    }
);

Then(
    'the page should contain valid navigation destinations',
    async () => {
        const links = await browser.execute(() =>
            Array.from(document.querySelectorAll('a[href]'))
                .filter(a => a.innerText.trim().length > 0)
                .map(a => a.href)
        );

        assert.ok(links.length > 0, 'No text links found');

        for (const href of links) {
            const url = new URL(href);

            assert.ok(
                ['http:', 'https:'].includes(url.protocol),
                `Unexpected link protocol: ${href}`
            );

            assert.ok(url.hostname, `Missing hostname: ${href}`);
        }
    }
);

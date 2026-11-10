
import { Given, Then } from '@wdio/cucumber-framework';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import contentPage from '../../pageobjects/ContentPage.js';
import { normalizeText } from '../../utils/textUtils.js';

const pageData = JSON.parse(
    readFileSync(
        new URL('../../test-data/pageContentData.json', import.meta.url),
        'utf8'
    )
);

// // Open LHH Insights page
// Given('I open the LHH Insights page', async function () {

//     await browser.url(pageData.insights.url);

// });

// Validate article title
Then('the article title should match the expected text', async function () {

    const actual = await contentPage.getArticleTitle();
 

    console.log("Actual article:", actual);

    const expected = pageData.insights.articleTitle;

    assert.equal(
        normalizeText(actual),
        normalizeText(expected),
        'Article title does not match'
    );

});

// Validate introductory paragraph
Then('the introductory paragraph should match the expected text', async function () {

    const actual = await contentPage.getIntroParagraph();

    const expected = pageData.insights.introParagraph;

    assert.equal(
        normalizeText(actual),
        normalizeText(expected),
        'Introduction paragraph does not match'
    );

});

// Validate reading time
Then('the reading time should match the expected text', async function () {

    const actual = await contentPage.getReadingTime();

    const expected = pageData.insights.readingTime;

    assert.equal(
        normalizeText(actual),
        normalizeText(expected),
        'Reading time does not match'
    );

});

// Validate posted date and author
Then('the posted date and author should match the expected text', async function () {

    const actual = await contentPage.getPostedDateAndAuthor();

    const expected = pageData.insights.postedDateAndAuthor;

    assert.equal(
        normalizeText(actual),
        normalizeText(expected),
        'Posted date and author do not match'
    );

});
// Then('the article text should be readable before handling cookies', async function () {

//     const isReadable = await contentPage.checkArticleTextReadable();

//     assert.equal(isReadable, true, 'Article text is not readable before cookie handling');

// });

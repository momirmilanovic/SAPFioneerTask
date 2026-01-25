import { test, expect } from '@playwright/test';


export class Page {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Assert that the text content of the given locator equals the expected text
     * @param {import('@playwright/test').Locator} locator to be used!
     * @param {string} expectedText
     */
    async assertTextOnElement(locator, expectedText) {
        console.log(`Asserting that element has text: ${expectedText}`);
        await expect(locator).toHaveText(expectedText);
        
    }

}

module.exports
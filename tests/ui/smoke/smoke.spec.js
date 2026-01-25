// @ts-check

import { test, expect } from '@playwright/test';
import { AmazonMainPage } from '../../../pages/amazon/amazonMainPage.js';
import { getSearchTerm } from '../../../utils/searchTerms/searchterms.js';
const  Config  = require('../../../utils/config.js'); // both approaches of using config shown with intenttion
const  config = require ('../../../config.js');


let context;
let page;
let amazonMainPage;
// const config = new Config(); cannot initialize like this, because some methods are static

test.describe.serial('Smoke Tests Suite', () => {

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    amazonMainPage = new AmazonMainPage(page);
    console.log("This is before all tests");
    await page.goto(Config.getUrl('amazonUrl'));
  })

  test('Search products on default All departments', async () => {
    await amazonMainPage.searchForTerm(getSearchTerm('mainSearchTerm'));
    await amazonMainPage.assertTitlesInfoElementsExist();
    await page.waitForTimeout(5000);
  });
  

});

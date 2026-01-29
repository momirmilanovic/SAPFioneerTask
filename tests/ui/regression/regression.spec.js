// @ts-check

import { test, expect } from '@playwright/test';
import { AmazonMainPage } from '../../../pages/amazon/amazonMainPage.js';
import { getSearchTerm } from '../../../utils/searchTerms/searchterms.js';
const  Config  = require('../../../utils/config.js'); // both approaches of using config shown with intenttion


let context;
let page;
let amazonMainPage;


test.describe.serial('Regression Tests Suite', () => {

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    amazonMainPage = new AmazonMainPage(page);
    await page.goto(Config.getUrl('amazonUrl'));
  })

  test('Search products on default All departments', async () => {
    await amazonMainPage.searchForTerm(getSearchTerm('nonExistingProductSearhTerm'));
    await amazonMainPage.verifyNoSearchResults();
    
  });
  
});

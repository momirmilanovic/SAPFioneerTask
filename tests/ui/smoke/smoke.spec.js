// @ts-check

import { test, expect } from '@playwright/test';
import { AmazonMainPage } from '../../../pages/amazon/amazonMainPage.js';
import { getSearchTerm } from '../../../utils/searchTerms/searchterms.js';
const  Config  = require('../../../utils/config.js'); // both approaches of using config shown with intenttion


let context;
let page;
let amazonMainPage;


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
    await amazonMainPage.verifySearchResultsPage();
    
  });

  test('Search products in defined department', async () => {
    await amazonMainPage.searchForTermInDepartment(getSearchTerm('department'), getSearchTerm('secondSearchTerm'));
    await amazonMainPage.verifyTitlesInfoElementsExist()  // No related search on department level, reported bug
    await amazonMainPage.verifyNumberOfSearchResults();
  });

  test('Check product data accuracy', async () => {
   await amazonMainPage.searchForTerm(getSearchTerm('accurateDataSearchTerm'));
    await amazonMainPage.verifyProductDataAccuracy();
  });
  
});

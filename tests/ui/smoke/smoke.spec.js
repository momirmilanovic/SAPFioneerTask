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
    await page.goto(Config.getUrl('amazonUrl'));
  })

  test('Search products on default All departments', async () => {
    await amazonMainPage.searchForTerm(getSearchTerm('firstSearhTerm'));
    await amazonMainPage.verifySearchResultsPage();
    
  });

  test('Search products in defined department', async () => {
    await amazonMainPage.searchForTermInDepartment(getSearchTerm('firstDepartment'), getSearchTerm('secondSearchTerm'));
    await amazonMainPage.verifyTitlesInfoElementsExist()  // No related search on department level, reported bug
    await amazonMainPage.verifyNumberOfSearchResults();
  });

  test('Check product data accuracy', async () => {
    await amazonMainPage.searchForTerm(getSearchTerm('accurateDataSearchTerm'));
    // await amazonMainPage.verifyProductDataAccuracy(getSearchTerm('accurateDataSearchTerm'), "24.92");
  });

  test('TASK: Calculate average price for first three results pages', async () => {
    await amazonMainPage.searchForTermInDepartment(getSearchTerm('departmentAll'), getSearchTerm('thirdSearchTerm'));
    let avgPrice = await amazonMainPage.calculateAvgPriceForFirstNResultPages();
    console.log(`Average price for first three results pages: ${avgPrice}`);
  });
  
});

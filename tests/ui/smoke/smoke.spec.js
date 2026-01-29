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
    await amazonMainPage.searchForTermInDepartment({ department: getSearchTerm('firstDepartment'), searchTerm: getSearchTerm('secondSearchTerm') });
    await amazonMainPage.verifyTitlesInfoElementsExist()  // No related search on department level, reported bug, even maybe is desired behavior
    await amazonMainPage.verifyNumberOfSearchResults(11);   // this 3 methods can be wrapped in one method
    await amazonMainPage.verifySideFiltersVisible();
    await amazonMainPage.verifySearchSummary({ expectedSummary: '1-12 of over 10,000 results for', searchTerm: getSearchTerm('secondSearchTerm') }); // expectedSummary can be get or defined other ways
  });

  test('Check product data accuracy', async () => {
    await amazonMainPage.searchForTermInDepartment({ department: getSearchTerm('departmentAll'), searchTerm: getSearchTerm('accurateDataSearchTerm') });
    await amazonMainPage.verifyProductDataAccuracy(getSearchTerm('accurateDataSearchTerm'), { price: "$64.34", ages: '7 years and up' });  // can be extended to any of data of search results product
  });                                                                                                                                      // expected values can be get from api or db

  test('TASK: Calculate average price for first three results pages', async () => { // separated in test to be more visible
    await amazonMainPage.searchForTerm(getSearchTerm('thirdSearchTerm'));
    let avgPrice = await amazonMainPage.calculateAvgPriceForFirstNResultPages();
    console.log(`Average price for first three results pages: ${avgPrice}`);
  });
  
});

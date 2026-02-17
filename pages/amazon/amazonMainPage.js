const { expect } = require('@playwright/test');
const { Page } = require('../Page');

/**
 * Amazon Main Page
 * Page: https://www.amazon.com/
 * This class encapsulates all selectors and methods for the Amazon main page
 */
class AmazonMainPage extends Page {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.page = page;
  }

  get searchInput() {
    return this.page.locator('id=twotabsearchtextbox');
  }

  get searchButton() {
    return this.page.locator('id=nav-search-submit-button');
  }

  get resultsTitle() {
    return this.page.locator('//h2[contains(@class, "a-size-medium-plus")][text()="Results"]');
  }

  get noResultsTitle() {
    return this.page.locator('//h2/span[contains(@class, "a-size-medium") and contains(@class, "a-text-normal")][contains(text(), "No results for your search query")]');
  }

  get checkEachProductInfo() {
    return this.page.locator('//span[text()="Check each product page for other buying options."]');
  }

  get tryCheckingInfo() {
    return this.page.locator('//span[text()="Try checking your spelling or use more general terms"]');
  }

  get relatedSearchesTitle() {
    return this.page.locator('//h2[contains(@class, "a-size-medium-plus")][text()="Related searches"]');
  }

  get singleSearchResult() {
    return this.page.locator('//div[@role="listitem"][@data-component-type="s-search-result"]');
  }

  get sideFilters() {
    return this.page.locator('//span[@data-component-type="s-filters-panel-view"]');
  }

  get singleSearchSuggestion() {
    return this.page.locator('div.a-box.a-first.textref-border.textref-box-first[role="listitem"]');  // different approach wiith intention
  }

  get relatedSearchesSuggestions() {
    return this.page.locator('//span[@data-component-type="text-reformulation-widget"]');
  }

  get productPrice() {
    return this.page.locator('span.a-price > span.a-offscreen');
  }

  get departmentDropdown() {
    return this.page.locator('id=searchDropdownBox');
  }

  get nextPageButton() {
    return this.page.locator('//a[@role="button"][contains(@class, "s-pagination-next")]');
  }

  searchSummary(searchTerm) {
    return this.page.locator(`//span[text() = "${searchTerm}"]`);
  }

  searchTermInSummary(searchTerm) {
    return this.page.locator(`//span[text() = "${searchTerm}" and @class="a-color-state a-text-bold"]`);
  }

  /**
   * Searches for a term in department
   * @param {string} department - The department to search in
   * @param {string} searchTerm - The term to search for
   */
  async searchForTermInDepartment({ department, searchTerm }) {
    await this.selectDepartment(department);
    await this.searchForTerm(searchTerm);
  }

  /**
   * Searches for a term on Amazon
   * @param {string} searchTerm - The term to search for
   */
  async searchForTerm(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForLoadState('load');  // for 'load', 'domcontentloaded' etc can be created enum like object since JS does not have enums
    // changeCountryPopup.toBeVisible() ? this.dimissChangeCountryPopup() : null; // can be added handling popup if appears
    }

  
/**
   * @param {integer} department - Number of pages to be checked for calculation
   */
  async calculateAvgPriceForFirstNResultPages(N = 3) {
    let allPrices = [];
    let results = {};

    for (let page = 1; page <= N; page++) {
      const count = await this.singleSearchResult.count(); 
 
      for (let i = 0; i < count; i++) {
        let price = await this.productPrice.nth(i).innerText();
        price = parseFloat(price.substring(1).replace(/,/g, ''));
        !isNaN(price) ? allPrices.push(price) : null;
        const avgPagePrice = parseFloat((allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length).toFixed(2));
        results[`page: ${page}`] = avgPagePrice;
        allPrices = [];
      }
      await this.nextPageButton.click();
      await this.page.waitForLoadState('load'); 
    }
    
    return results;
  }


/**
   * Verifies product search results and page
   */
  async verifySearchResultsPage() {              // can be extened e.g : to check taht search resuls has image, title, text etc, and size
    await this.verifyTitlesInfoElementsExist();  // can be parametrizes multiple ways: to check for specific elements, to provide expected searh  results etc
    await this.verifyNumberOfSearchResults();
    await this.verifyRelatedSearchesExists();
    await this.verifySideFiltersVisible();
  }

  /**
   * Verifies that all search result elements exist on the page
   */
  async verifyTitlesInfoElementsExist() {
    await this.verifyResultsExists();
    await this.verifyCheckEachProductInfoExists();
  }

  /**
   * Verifies that Results element exists on the page
   */
  async verifyResultsExists() {
    await expect(this.resultsTitle).toBeVisible();
  }

  /**
   * Verifies that a product with specific title and price exists in search results
   * @param {string} title - The product title to search for
   * @param {string} price - The price to search for
   */
  async verifyProductDataAccuracy(title, data) {
    let searchedResult = this.singleSearchResult.nth(0)
    const productText = await searchedResult.textContent();
    await this.page.waitForTimeout(10_000);
    Object.entries(data).forEach(([key, value]) => {
      expect(productText).toContain(`${value}`);
    });

  }

  /**
   * Select department from dropdown
   */
  async selectDepartment(department) {
    await this.departmentDropdown.selectOption(department);
  }

  /**
   * Verifies that "Check each product page for other buying options" element exists on the page
   */
  async verifyCheckEachProductInfoExists() {
    await expect(this.checkEachProductInfo).toBeVisible();
  }
  

  /**
   * Verifies that "Related searches" element exists on the page
   */
  async verifyRelatedSearchesExists() {
    await expect(this.relatedSearchesTitle).toBeVisible();
    await expect(this.relatedSearchesSuggestions).toBeVisible();  // 
  }

  /**
   * Verify that there are more than N products on the page
   */
  async verifyNumberOfSearchResults(n = 10) {
    const count = await this.singleSearchResult.count();    // n should be set to config too
    expect(count).toBeGreaterThan(n);
  }


  /**
   * Verifies Related Searches exists
   */
  async verifySearchSuggestionsExist() {
     await expect(this.relatedSearchesSuggestions).toBeVisible();
  }

  /**
   * Verifies expected information when no results of search
   */
  async verifyNoSearchResults() {
    await expect(this.noResultsTitle).toBeVisible();
    await expect(this.tryCheckingInfo).toBeVisible();
  }

  /**
   * Verifies that side filters are visible on the page
   */
  async verifySideFiltersVisible() {
    await expect(this.sideFilters).toBeVisible();
  }


  async verifySearchSummary({expectedSummary, searchTerm}) {
    await expect(this.searchSummary(expectedSummary)).toBeVisible();
    // await expect(this.searchTermInSummary(searchTerm)).toBeVisible();
  }
}

module.exports = { AmazonMainPage };

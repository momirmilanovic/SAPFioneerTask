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
    return this.page.locator('//span[contains(normalize-space(),"No results for your search query")]');
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

  /**
   * Searches for a term in department
   * @param {string} department - The department to search in
   * @param {string} searchTerm - The term to search for
   */
  async searchForTermInDepartment(department, searchTerm) {
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
    // changeCountryPopup.toBeVisible() ? this.dimissChangeCountryPopup() : null; // example of handling popup if appears
    }

  
  async calculateAvgPriceForFirstNResultPages(N = 3) {
    let allPrices = [];

    for (let page = 1; page <= N; page++) {
      const count = await this.singleSearchResult.count(); 
 
      for (let i = 0; i < count; i++) {
        let price = await this.productPrice.nth(i).innerText();
        price = parseFloat(price.substring(1).replace(/,/g, ''));
        !isNaN(price) ? allPrices.push(price) : null;
      }      
      await this.nextPageButton.click();
      await this.page.waitForLoadState('load'); 
    }
    
    const averagePrice = parseFloat((allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length).toFixed(2));
  
    return averagePrice;
  }


/**
   * Verifies product search results and page
   */
  async verifySearchResultsPage() {              // can be extened e.g : to check taht search resuls has image, title, text et
    await this.verifyTitlesInfoElementsExist();
    await this.verifyNumberOfSearchResults();
    await this.verifyRelatedSearchesExists();
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
   * @returns {Promise<boolean>} True if product with matching title and price is found
   */
  async verifyProductDataAccuracy(title, price) {
    const productElements = this.singleSearchResult;
    const count = await productElements.count();
    
    for (let i = 0; i < count; i++) {
      const product = productElements.nth(i);
      const productText = await product.textContent();
      
      // Check if both title and price exist in the product element
      if (productText.includes(title) && productText.includes(price)) {
        return true;
      }
    }
    
    // If no matching product found, throw error
    throw new Error(`Product with title "${title}" and price "${price}" not found in search results`);
  }

  /**
   * Asserts that a product with specific title and price exists in search results
   * @param {string} title - The product title to search for
   * @param {string} price - The price to search for
   */
  async assertProductDataAccuracy(title, price) {
    const result = await this.verifyProductDataAccuracy(title, price);
    expect(result).toBe(true);
  }

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
    await expect(this.relatedSearchesSuggestions).toBeVisible();
  }

  /**
   * Verify that there are more than N products on the page
   */
  async verifyNumberOfSearchResults(n = 1) {
    const count = await this.singleSearchResult.count();    // n should be set to config too
    expect(count).toBeGreaterThan(n);
  }


  /**
   * Verifies Related Searches exists
   */
  async verifySearchSuggestionsExist() {
     await expect(this.relatedSearchesSuggestions).toBeVisible();
  }

  async verifyNoSearchResults() {
    await expect(this.noResultsTitle).toBeVisible();
    await expect(this.tryCheckingInfo).toBeVisible();
  }

}

module.exports = { AmazonMainPage };

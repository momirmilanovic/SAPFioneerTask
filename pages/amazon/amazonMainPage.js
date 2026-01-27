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

  get checkEachProductInfo() {
    return this.page.locator('//span[text()="Check each product page for other buying options."]');
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

  get departmentDropdown() {
    return this.page.locator('id=searchDropdownBox');
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
  }

  async selectDepartment(department) {
    await this.departmentDropdown.selectOption(department);
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

  async verifyProductDataAccuracy() {
    await expect(this.singleSearchResult).toBeVisible();
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
    await expect(count).toBeGreaterThan(n);
  }


  /**
   * Verifies Related Searches exists
   */
  async verifySearchSuggestionsExist() {
     await expect(this.relatedSearchesSuggestions).toBeVisible();
  }

}

module.exports = { AmazonMainPage };

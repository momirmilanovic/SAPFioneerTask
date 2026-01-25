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

  get searchResults() {
    return this.page.locator('.s-search-results');
  }

  get resultsTitle() {
    return this.page.locator('//h2[contains(@class, "a-size-medium-plus") and contains(text(), "Results")]');
  }

  get checkOtherProductsInfi() {
    return this.page.locator('//span[contains(text(), "Check each product page for other buying options")]');
  }

  get relatedSearchTitle() {
    return this.page.locator('//h2[contains(@class, "a-size-medium-plus") and contains(text(), "Related searches")]');
  }

  get singleProduct() {
    return this.page.locator('//div[role="listitem"]');
  }

  /**
   * Searches for a term on Amazon
   * @param {string} searchTerm - The term to search for
   */
  async searchForTerm(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }


/**
   * Asserts product search results and page
   */
  async assertSearchResultsPage() {
    await this.assertTitlesInfoElementsExist();
    await this.assertMoreThanNProductsExist(10); // can be defined in some config too
  }

  /**
   * Asserts that all search result elements exist on the page
   */
  async assertTitlesInfoElementsExist() {
    await this.assertResultsExists();
    await this.assertOtherBuyingOptionsExists();
    await this.assertRelatedSearchesExists();
  }

  /**
   * Asserts that Results element exists on the page
   */
  async assertResultsExists() {
    await expect(this.resultsTitle).toBeVisible();

  }

  /**
   * Asserts that "Check each product page for other buying options" element exists on the page
   */
  async assertOtherBuyingOptionsExists() {
    await expect(this.checkOtherProductsInfi).toBeVisible();
  }

  /**
   * Asserts that "Related searches" element exists on the page
   */
  async assertRelatedSearchesExists() {
    await expect(this.relatedSearchTitle).toBeVisible();
  }

  /**
   * Asserts that there are more than N products on the page
   */
  async assertMoreThanNProductsExist(n = 10) {
    const count = await this.singleProduct.count();
    await expect(count).toBeGreaterThan(n);
  }

}

module.exports = { AmazonMainPage };

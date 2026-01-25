const searchTerms = require('./searchTermsData');

/**
 * Gets a search term by key
 * @param {string} key - The key of the search term
 * @returns {string} The search term value
 */
function getSearchTerm(key) {
  if (!searchTerms.hasOwnProperty(key)) {
    throw new Error(`Search term key "${key}" not found`);
  }
  return searchTerms[key];
}

/**
 * Gets all available search terms
 * @returns {object} All search terms
 */
function getAllSearchTerms() {
  return searchTerms;
}

module.exports = { searchTerms, getSearchTerm, getAllSearchTerms };

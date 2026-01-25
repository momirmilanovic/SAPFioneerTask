const config = require('../config');

export class Config {
  static getUrl(url) {
    if (!config.urls[url]) {
      throw new Error(`URL for key "${url}" not found in config`);
    }
    // return config.urls[key];
    return config.urls[url];
  }

}

module.exports = Config;
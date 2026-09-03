const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url, options = {}) {
    const defaultOptions = { waitUntil: 'networkidle', timeout: 60000 };
    await this.page.goto(url, { ...defaultOptions, ...options });
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async waitForURL(pattern, options = {}) {
    await this.page.waitForURL(pattern, options);
  }

  async expectURL(pattern) {
    await expect(this.page).toHaveURL(pattern);
  }
}

module.exports = { BasePage };

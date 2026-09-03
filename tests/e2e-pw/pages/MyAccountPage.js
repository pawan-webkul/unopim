const { BasePage } = require('./BasePage');

class MyAccountPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.page.goto('/admin/account', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForLoad();
  }
}

module.exports = { MyAccountPage };

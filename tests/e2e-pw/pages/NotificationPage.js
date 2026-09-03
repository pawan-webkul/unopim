const { BasePage } = require('./BasePage');

class NotificationPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Search').first();
  }

  async openListing() {
    await this.navigateTo('notifications');
    await this.waitForLoad();
  }
}

module.exports = { NotificationPage };

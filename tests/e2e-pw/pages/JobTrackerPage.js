const { BasePage } = require('./BasePage');

class JobTrackerPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.page.goto('/admin/data-transfer/job-tracker', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForLoad();
  }
}

module.exports = { JobTrackerPage };

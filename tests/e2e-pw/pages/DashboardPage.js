const { BasePage } = require('./BasePage');
const { ROUTES } = require('../utils/helpers');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async navigateTo(route) {
    const url = ROUTES[route];
    if (!url) throw new Error(`Unknown route: "${route}". Available: ${Object.keys(ROUTES).join(', ')}`);
    await this.goto(url);
  }

  async openDashboard() {
    await this.navigateTo('dashboard');
  }

  async openProducts() {
    await this.navigateTo('products');
  }

  async openCategories() {
    await this.navigateTo('categories');
  }

  async openAttributes() {
    await this.navigateTo('attributes');
  }

  async openAttributeGroups() {
    await this.navigateTo('attributeGroups');
  }

  async openAttributeFamilies() {
    await this.navigateTo('attributeFamilies');
  }

  async openCategoryFields() {
    await this.navigateTo('categoryFields');
  }

  async openChannels() {
    await this.navigateTo('channels');
  }

  async openCurrencies() {
    await this.navigateTo('currencies');
  }

  async openLocales() {
    await this.navigateTo('locales');
  }

  async openRoles() {
    await this.navigateTo('roles');
  }

  async openUsers() {
    await this.navigateTo('users');
  }

  async openIntegrations() {
    await this.navigateTo('integrations');
  }

  async openWebhooks() {
    await this.navigateTo('webhook');
  }

  async openExports() {
    await this.navigateTo('exports');
  }

  async openImports() {
    await this.navigateTo('imports');
  }

  async openJobTracker() {
    await this.goto('/admin/data-transfer/job-tracker');
  }

  async openNotifications() {
    await this.navigateTo('notifications');
  }

  async openConfiguration() {
    await this.navigateTo('configuration');
  }
}

module.exports = { DashboardPage };

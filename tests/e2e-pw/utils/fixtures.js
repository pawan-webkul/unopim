/**
 * Extended Playwright fixtures for UnoPim E2E tests.
 *
 * Usage in spec files:
 *   const { test, expect } = require('../../utils/fixtures');
 *
 * Available fixtures:
 *   - adminPage        : pre-authenticated browser page (existing)
 *   - attributePage    : AttributePage POM
 *   - attributeFamilyPage
 *   - attributeGroupPage
 *   - categoryPage
 *   - categoryFieldPage
 *   - productPage
 *   - channelPage
 *   - currencyPage
 *   - localePage
 *   - rolePage
 *   - userPage
 *   - integrationPage
 *   - webhookPage
 */

const { test: base, expect } = require('@playwright/test');
const path = require('path');

const { AttributePage } = require('../pages/AttributePage');
const { AttributeFamilyPage } = require('../pages/AttributeFamilyPage');
const { AttributeGroupPage } = require('../pages/AttributeGroupPage');
const { CategoryPage } = require('../pages/CategoryPage');
const { CategoryFieldPage } = require('../pages/CategoryFieldPage');
const { ProductPage } = require('../pages/ProductPage');
const { ChannelPage } = require('../pages/ChannelPage');
const { CurrencyPage } = require('../pages/CurrencyPage');
const { LocalePage } = require('../pages/LocalePage');
const { RolePage } = require('../pages/RolePage');
const { UserPage } = require('../pages/UserPage');
const { IntegrationPage } = require('../pages/IntegrationPage');
const { WebhookPage } = require('../pages/WebhookPage');
const { LoginPage } = require('../pages/LoginPage');
const { CompletenessPage } = require('../pages/CompletenessPage');
const { DashboardPage } = require('../pages/DashboardPage');

const STORAGE_STATE = path.resolve(__dirname, '../.state/admin-auth.json');

const test = base.extend({
  /** Pre-authenticated admin page, navigated to /admin/dashboard. */
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await context.newPage();
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');
    await use(page);
    await page.close();
    await context.close();
  },

  /** AttributePage POM — depends on adminPage. */
  attributePage: async ({ adminPage }, use) => {
    await use(new AttributePage(adminPage));
  },

  attributeFamilyPage: async ({ adminPage }, use) => {
    await use(new AttributeFamilyPage(adminPage));
  },

  attributeGroupPage: async ({ adminPage }, use) => {
    await use(new AttributeGroupPage(adminPage));
  },

  categoryPage: async ({ adminPage }, use) => {
    await use(new CategoryPage(adminPage));
  },

  categoryFieldPage: async ({ adminPage }, use) => {
    await use(new CategoryFieldPage(adminPage));
  },

  productPage: async ({ adminPage }, use) => {
    await use(new ProductPage(adminPage));
  },

  channelPage: async ({ adminPage }, use) => {
    await use(new ChannelPage(adminPage));
  },

  currencyPage: async ({ adminPage }, use) => {
    await use(new CurrencyPage(adminPage));
  },

  localePage: async ({ adminPage }, use) => {
    await use(new LocalePage(adminPage));
  },

  rolePage: async ({ adminPage }, use) => {
    await use(new RolePage(adminPage));
  },

  userPage: async ({ adminPage }, use) => {
    await use(new UserPage(adminPage));
  },

  integrationPage: async ({ adminPage }, use) => {
    await use(new IntegrationPage(adminPage));
  },

  webhookPage: async ({ adminPage }, use) => {
    await use(new WebhookPage(adminPage));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  completenessPage: async ({ adminPage }, use) => {
    await use(new CompletenessPage(adminPage));
  },

  dashboardPage: async ({ adminPage }, use) => {
    await use(new DashboardPage(adminPage));
  },
});

module.exports = { test, expect };

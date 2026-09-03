const { test, expect, percySnapshot } = require('../../utils/fixtures');
const { DashboardPage } = require('../../pages');

test.describe('UnoPim Dashboard Navigation', () => {
  let dashboardPage;

  test.beforeEach(async ({ adminPage }) => {
    dashboardPage = new DashboardPage(adminPage);
  });

  test('Shows Dashboard link and goes to dashboard Page', async ({ adminPage }) => {
    await dashboardPage.navigateTo('dashboard');
    await expect(adminPage).toHaveURL(/\/admin\/dashboard/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Dashboard');
  });

  test('Goes to Products Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('products');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/products/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Product Listing');
  });

  test('Goes to Categories Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('categories');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/categories/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Category Listing');
  });

  test('Goes to Category field Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('categoryFields');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/category-fields/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Category Fields');
  });

  test('Goes to Attribute Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('attributes');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/attributes/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Attribute Listing');
  });

  test('Goes to Attribute Group Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('attributeGroups');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/attribute-groups/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Attribute Group Listing');
  });

  test('Goes to Attribute Families Page under Catalog', async ({ adminPage }) => {
    await dashboardPage.navigateTo('attributeFamilies');
    await expect(adminPage).toHaveURL(/\/admin\/catalog\/attribute-families/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Attribute Family Listing');
  });

  test('Goes to Job Tracker under Data Transfer', async ({ adminPage }) => {
    await adminPage.goto('/admin/data-transfer/job-tracker', { waitUntil: 'domcontentloaded' });
    await adminPage.waitForLoadState('networkidle');
    await expect(adminPage).toHaveURL(/\/admin\/data-transfer\/job-tracker/);
    await percySnapshot(adminPage, 'Job Tracker');
  });

  test('Goes to Import under Data Transfer', async ({ adminPage }) => {
    await dashboardPage.navigateTo('imports');
    await expect(adminPage).toHaveURL(/\/admin\/data-transfer\/imports/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Import Listing');
  });

  test('Goes to Export under Data Transfer', async ({ adminPage }) => {
    await dashboardPage.navigateTo('exports');
    await expect(adminPage).toHaveURL(/\/admin\/data-transfer\/exports/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Export Listing');
  });

  test('Goes to Locales Page under Settings', async ({ adminPage }) => {
    await dashboardPage.navigateTo('locales');
    await expect(adminPage).toHaveURL(/\/admin\/settings\/locales/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Locale Listing');
  });

  test('Goes to Currencies Page under Settings', async ({ adminPage }) => {
    await dashboardPage.navigateTo('currencies');
    await expect(adminPage).toHaveURL(/\/admin\/settings\/currencies/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Currency Listing');
  });

  test('Goes to Channels Page under Settings', async ({ adminPage }) => {
    await dashboardPage.navigateTo('channels');
    await expect(adminPage).toHaveURL(/\/admin\/settings\/channels/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Channel Listing');
  });

  test('Goes to Users Page under Settings', async ({ adminPage }) => {
    await dashboardPage.navigateTo('users');
    await expect(adminPage).toHaveURL(/\/admin\/settings\/users/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'User Listing');
  });

  test('Goes to Roles Page under Settings', async ({ adminPage }) => {
    await dashboardPage.navigateTo('roles');
    await expect(adminPage).toHaveURL(/\/admin\/settings\/roles/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Role Listing');
  });

  test('Goes to Magic AI Page under Configuration', async ({ adminPage }) => {
    await adminPage.goto('/admin/magic-ai/platforms', { waitUntil: 'domcontentloaded' });
    await adminPage.waitForLoadState('networkidle');
    await expect(adminPage).toHaveURL(/\/admin\/magic-ai\/platforms/);
    await percySnapshot(adminPage, 'Magic AI Platforms');
  });

  test('Goes to Integrations Page under Configuration', async ({ adminPage }) => {
    await dashboardPage.navigateTo('integrations');
    await expect(adminPage).toHaveURL(/\/admin\/configuration\/integrations/);
    await adminPage.waitForLoadState('networkidle').catch(() => {});
    await percySnapshot(adminPage, 'Integration Listing');
  });
});

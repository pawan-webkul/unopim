/**
 * Role spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { role: r } = testData;

test.describe('UnoPim Administrator Role', () => {
  test('Create role with empty permission field', async ({ rolePage }) => {
    await rolePage.gotoCreate();
    await rolePage.selectPermissionType('Custom');
    await rolePage.fillName(r.adminName);
    await rolePage.fillDescription(r.adminDescription);
    await rolePage.save();
    await expect(rolePage.page.getByText(/The Permissions field is required/i)).toBeVisible();
  });

  test('Create role with empty Name field', async ({ rolePage }) => {
    await rolePage.gotoCreate();
    await rolePage.selectPermissionType('All');
    await rolePage.fillName('');
    await rolePage.fillDescription(r.adminDescription);
    await rolePage.save();
    await expect(rolePage.page.getByText(/The Name field is required/i)).toBeVisible();
  });

  test('Create role with empty description field', async ({ rolePage }) => {
    await rolePage.gotoCreate();
    await rolePage.selectPermissionType('All');
    await rolePage.fillName(r.adminName);
    await rolePage.fillDescription('');
    await rolePage.save();
    await expect(rolePage.page.getByText(/The Description field is required/i)).toBeVisible();
  });

  test('Create role with all required fields empty', async ({ rolePage }) => {
    await rolePage.gotoCreate();
    await rolePage.selectPermissionType('Custom');
    await rolePage.fillName('');
    await rolePage.fillDescription('');
    await rolePage.save();
    await expect(rolePage.page.getByText(/The Permissions field is required/i)).toBeVisible();
    await expect(rolePage.page.getByText(/The Name field is required/i)).toBeVisible();
    await expect(rolePage.page.getByText(/The Description field is required/i)).toBeVisible();
  });

  test('Create Administrator role', async ({ rolePage }) => {
    await rolePage.create({
      permissionType: 'All',
      name: r.adminName,
      description: r.adminDescription,
    });
    await expect(rolePage.page.getByText(/Roles Created Successfully/i)).toBeVisible();
  });

  test('should allow role search', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.search('Administrator');
    await expect(rolePage.page.locator('text=AdministratorAll', { exact: true })).toBeVisible();
  });

  test('Update Administrator role', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.clickEditForRow(r.adminName);
    await rolePage.fillDescription(r.adminUpdatedDescription);
    await rolePage.save();
    await expect(rolePage.page.getByText(/Roles is updated successfully./i).first()).toBeVisible();
  });

  test('Delete Administrator role', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.clickDeleteForRow(r.adminName);
    await rolePage.confirmDelete();
    await expect(rolePage.page.getByText(/Roles is deleted successfully/i)).toBeVisible();
  });
});

test.describe('UnoPim Custom Role', () => {
  test('Create Custom Roles', async ({ rolePage }) => {
    await rolePage.gotoCreate();
    await rolePage.checkPermission('Dashboard');
    await rolePage.checkPermission('Catalog');
    await rolePage.fillName(r.customName);
    await rolePage.fillDescription(r.customDescription);
    await rolePage.save();
    await expect(rolePage.page.getByText(/Roles Created Successfully/i)).toBeVisible();
  });

  test('Update Custom Roles', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.clickEditForRow(r.customName);
    await rolePage.checkPermission('Categories');
    await rolePage.save();
    await expect(rolePage.page.getByText(/Roles is updated successfully./i).first()).toBeVisible();
  });

  test('Delete Custom Roles', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.clickDeleteForRow(r.customName);
    await rolePage.confirmDelete();
    await expect(
      rolePage.page.getByText(/Roles is deleted successfully./i).first()
    ).toBeVisible();
  });

  test('Delete Default Roles', async ({ rolePage }) => {
    await rolePage.goto();
    await rolePage.clickDeleteForRow('Administrator');
    await rolePage.confirmDelete();
    await expect(
      rolePage.page.getByText(/Role is already used by Example User/i).first()
    ).toBeVisible();
  });
});

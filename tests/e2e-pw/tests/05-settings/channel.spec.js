/**
 * Channel spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { channel: ch } = testData;

test.describe('UnoPim Channel test', () => {
  test('Create Channel with empty Code', async ({ channelPage }) => {
    await channelPage.gotoCreate();
    await channelPage.fillCode('');
    await channelPage.selectRootCategory(ch.rootCategory);
    await channelPage.fillName(ch.name);
    await channelPage.selectLocale(ch.locale);
    await channelPage.selectCurrency(ch.currency);
    await channelPage.save();
    await expect(channelPage.page.getByText('The Code field is required')).toBeVisible();
  });

  test('Create Channel with empty Root Category', async ({ channelPage }) => {
    await channelPage.gotoCreate();
    await channelPage.fillCode(ch.code);
    await channelPage.fillName(ch.name);
    await channelPage.selectLocale(ch.locale);
    await channelPage.selectCurrency(ch.currency);
    await channelPage.save();
    await expect(channelPage.page.getByText('The Root Category field is required')).toBeVisible();
  });

  test('Create Channel with empty Locales field', async ({ channelPage }) => {
    await channelPage.gotoCreate();
    await channelPage.fillCode(ch.code);
    await channelPage.selectRootCategory(ch.rootCategory);
    await channelPage.fillName(ch.name);
    await channelPage.selectCurrency(ch.currency);
    await channelPage.save();
    await expect(channelPage.page.getByText('The Locales field is required')).toBeVisible();
  });

  test('Create Channel with empty Currency field', async ({ channelPage }) => {
    await channelPage.gotoCreate();
    await channelPage.fillCode(ch.code);
    await channelPage.selectRootCategory(ch.rootCategory);
    await channelPage.fillName(ch.name);
    await channelPage.selectLocale(ch.locale);
    await channelPage.save();
    await expect(channelPage.page.getByText('The Currencies field is required')).toBeVisible();
  });

  test('Create Channel with all required fields empty', async ({ channelPage }) => {
    await channelPage.gotoCreate();
    await channelPage.fillCode('');
    await channelPage.fillName(ch.name);
    await channelPage.save();
    await expect(channelPage.page.getByText('The Code field is required')).toBeVisible();
    await expect(channelPage.page.getByText('The Root Category field is required')).toBeVisible();
    await expect(channelPage.page.getByText('The Locales field is required')).toBeVisible();
    await expect(channelPage.page.getByText('The Currencies field is required')).toBeVisible();
  });

  test('Create Channel', async ({ channelPage }) => {
    await channelPage.create({
      code: ch.code,
      rootCategory: ch.rootCategory,
      name: ch.name,
      locale: ch.locale,
      currency: ch.currency,
    });
    await expect(channelPage.page.getByText(/Channel created successfully/i)).toBeVisible();
  });

  test('Create Channel with same Code', async ({ channelPage }) => {
    await channelPage.create({
      code: ch.code,
      rootCategory: ch.rootCategory,
      name: ch.name,
      locale: ch.locale,
      currency: ch.currency,
    });
    await expect(channelPage.page.getByText('The Code has already been taken.')).toBeVisible();
  });

  test('should allow Channel search', async ({ channelPage }) => {
    await channelPage.goto();
    await channelPage.search(ch.code);
    await expect(channelPage.page.locator(`text=${ch.name}`, { exact: true })).toBeVisible();
  });

  test('Update Channel', async ({ channelPage }) => {
    await channelPage.goto();
    await channelPage.clickEditForRow(`${ch.code}${ch.name}`);
    await channelPage.fillName(ch.updatedName);
    await channelPage.save();
    await expect(channelPage.page.getByText(/Update Channel Successfully/i)).toBeVisible();
  });

  test('Delete Channel', async ({ channelPage }) => {
    await channelPage.goto();
    await channelPage.clickDeleteForRow(`${ch.code}${ch.updatedName}`);
    await channelPage.confirmDelete();
    await expect(channelPage.page.getByText(/Channel deleted successfully/i)).toBeVisible();
  });

  test('Delete Default Channel', async ({ channelPage }) => {
    await channelPage.goto();
    await channelPage.clickDeleteForRow('[root]');
    await channelPage.confirmDelete();
    await expect(
      channelPage.page.getByText(
        /You can't delete the channel "default" because your PIM needs to have at least one channel./i
      )
    ).toBeVisible();
  });
});

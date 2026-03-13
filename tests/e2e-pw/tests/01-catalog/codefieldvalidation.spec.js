const { test, expect } = require('../../utils/fixtures');

test.describe('UnoPim Test cases (Code field validation category)', () => {
  test.beforeEach(async ({ categoryPage }) => {
    await categoryPage.gotoCreate();
  });

  test('check the code field with less than 191 character', async ({ categoryPage }) => {
    await categoryPage.fillCode('Playwrightrectoryexistence');
    await categoryPage.fillName('Playwright1');
    await categoryPage.save();
    await expect(categoryPage.page.getByText(/Category created successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ categoryPage }) => {
    await categoryPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await categoryPage.fillName('Playwright2');
    await categoryPage.save();
    await expect(categoryPage.page.getByText(/Category created successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ categoryPage }) => {
    await categoryPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await categoryPage.fillName('Playwright3');
    await categoryPage.save();
    await expect(categoryPage.page.getByText(/Category created successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ categoryPage }) => {
    await categoryPage.fillCode('165sdfvjaef');
    await categoryPage.fillName('Playwright4');
    await categoryPage.save();
    await expect(categoryPage.page.getByText(/Category created successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ categoryPage }) => {
    const codeField = categoryPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ categoryPage }) => {
    const codeField = categoryPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ categoryPage }) => {
    const codeField = categoryPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ categoryPage }) => {
    const codeField = categoryPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});

test.describe('UnoPim Test cases (Code field validation category field)', () => {
  test.beforeEach(async ({ categoryFieldPage }) => {
    await categoryFieldPage.gotoCreate();
  });

  test('check the code field with less than 191 character', async ({ categoryFieldPage }) => {
    await categoryFieldPage.fillCode('Playwrightrectoryexistence');
    await categoryFieldPage.selectType('Text');
    await categoryFieldPage.fillName('Playwright1');
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText(/Category Field Created Successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ categoryFieldPage }) => {
    await categoryFieldPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await categoryFieldPage.selectType('Text');
    await categoryFieldPage.fillName('Playwright2');
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText(/Category Field Created Successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ categoryFieldPage }) => {
    await categoryFieldPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await categoryFieldPage.selectType('Text');
    await categoryFieldPage.fillName('Playwright3');
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText(/Category Field Created Successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ categoryFieldPage }) => {
    await categoryFieldPage.fillCode('165sdfvjaef');
    await categoryFieldPage.selectType('Text');
    await categoryFieldPage.fillName('Playwright4');
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText(/Category Field Created Successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ categoryFieldPage }) => {
    const codeField = categoryFieldPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ categoryFieldPage }) => {
    const codeField = categoryFieldPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ categoryFieldPage }) => {
    const codeField = categoryFieldPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ categoryFieldPage }) => {
    const codeField = categoryFieldPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});

test.describe('UnoPim Test cases (Code field validation attribute)', () => {
  test.beforeEach(async ({ attributePage }) => {
    await attributePage.gotoCreate();
  });

  test('check the code field with less than 191 character', async ({ attributePage }) => {
    await attributePage.fillCode('Playwrightrectoryexistence');
    await attributePage.selectType('Text');
    await attributePage.fillName('Playwright1');
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ attributePage }) => {
    await attributePage.fillCode('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributePage.selectType('Text');
    await attributePage.fillName('Playwright2');
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ attributePage }) => {
    await attributePage.fillCode('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributePage.selectType('Text');
    await attributePage.fillName('Playwright3');
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ attributePage }) => {
    await attributePage.fillCode('165sdfvjaef');
    await attributePage.selectType('Text');
    await attributePage.fillName('Playwright4');
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ attributePage }) => {
    const codeField = attributePage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ attributePage }) => {
    const codeField = attributePage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ attributePage }) => {
    const codeField = attributePage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ attributePage }) => {
    const codeField = attributePage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});

test.describe('UnoPim Test cases (Code field validation attribute option)', () => {
  test.beforeEach(async ({ attributePage }) => {
    await attributePage.goto();
  });

  test('create the Select type attibute', async ({ attributePage }) => {
    await attributePage.create({
      code: 'material',
      type: 'Select',
      name: 'Material',
    });
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i).first()).toBeVisible();
  });

  test('check the code field with less than 191 character', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.fill('Playwrightrectoryexistence');
    await attributePage.page.locator('input[name="locales.en_US"]').fill('Playwright1');
    await attributePage.saveOption();
    await expect(attributePage.page.getByText(/Attribute Option Created Successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.fill('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributePage.page.locator('input[name="locales.en_US"]').fill('Playwright2');
    await attributePage.saveOption();
    await expect(attributePage.page.getByText(/Attribute Option Created Successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.fill('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributePage.page.locator('input[name="locales.en_US"]').fill('Playwright3');
    await attributePage.saveOption();
    await expect(attributePage.page.getByText(/Attribute Option Created Successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.fill('165sdfvjaef');
    await attributePage.page.locator('input[name="locales.en_US"]').fill('Playwright4');
    await attributePage.saveOption();
    await expect(attributePage.page.getByText(/Attribute Option Created Successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ attributePage }) => {
    await attributePage.clickEditForRow('material');
    await attributePage.openAddOptionDialog();
    const codeField = attributePage.page.locator('input[name="code"]').nth(0);
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});

test.describe('UnoPim Test cases (Code field validation attribute group)', () => {
  test.beforeEach(async ({ attributeGroupPage }) => {
    await attributeGroupPage.gotoCreate();
  });

  test('check the code field with less than 191 character', async ({ attributeGroupPage }) => {
    await attributeGroupPage.fillCode('Playwrightrectoryexistence');
    await attributeGroupPage.fillName('Playwright1');
    await attributeGroupPage.save();
    await expect(attributeGroupPage.page.getByText(/Attribute Group Created Successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ attributeGroupPage }) => {
    await attributeGroupPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributeGroupPage.fillName('Playwright2');
    await attributeGroupPage.save();
    await expect(attributeGroupPage.page.getByText(/Attribute Group Created Successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ attributeGroupPage }) => {
    await attributeGroupPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributeGroupPage.fillName('Playwright3');
    await attributeGroupPage.save();
    await expect(attributeGroupPage.page.getByText(/Attribute Group Created Successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ attributeGroupPage }) => {
    await attributeGroupPage.fillCode('165sdfvjaef');
    await attributeGroupPage.fillName('Playwright4');
    await attributeGroupPage.save();
    await expect(attributeGroupPage.page.getByText(/Attribute Group Created Successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ attributeGroupPage }) => {
    const codeField = attributeGroupPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ attributeGroupPage }) => {
    const codeField = attributeGroupPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ attributeGroupPage }) => {
    const codeField = attributeGroupPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ attributeGroupPage }) => {
    const codeField = attributeGroupPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});

test.describe('UnoPim Test cases (Code field validation attribute family)', () => {
  test.beforeEach(async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.gotoCreate();
  });

  test('check the code field with less than 191 character', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.fillCode('Playwrightrectoryexistence');
    await attributeFamilyPage.fillName('Playwright1');
    await attributeFamilyPage.save();
    await expect(attributeFamilyPage.page.getByText(/Family created successfully/i)).toBeVisible();
  });

  test('check the code field with exactly 191 character', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributeFamilyPage.fillName('Playwright2');
    await attributeFamilyPage.save();
    await expect(attributeFamilyPage.page.getByText(/Family created successfully/i)).toBeVisible();
  });

  test('check the code field with more than 191 character', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.fillCode('PlaywrightreportfoldernotfoundatthegivenpdfgfgsdkjjfgathEnsuretestsrannwithreporterhtmlandthepathiscorrectbeforeuploadingartifactskshbvsvbdfhvbdfhvbsdhfvbsdhfvbdfshvbsdfhvbfdvbvbfhvuyvuvbyutvbfhvjufdvbsj');
    await attributeFamilyPage.fillName('Playwright3');
    await attributeFamilyPage.save();
    await expect(attributeFamilyPage.page.getByText(/Family created successfully/i)).toBeVisible();
  });

  test('able to enter the number first in code field', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.fillCode('165sdfvjaef');
    await attributeFamilyPage.fillName('Playwright4');
    await attributeFamilyPage.save();
    await expect(attributeFamilyPage.page.getByText(/Family created successfully/i)).toBeVisible();
  });

  test('verify special characters are removed from code field', async ({ attributeFamilyPage }) => {
    const codeField = attributeFamilyPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('165s@');
    await expect(codeField).toHaveValue('165s');
  });

  test('Spaces should be removed automatically in code field', async ({ attributeFamilyPage }) => {
    const codeField = attributeFamilyPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('   ');
    await expect(codeField).toHaveValue('');
  });

  test('Check with special character and underscore in code field', async ({ attributeFamilyPage }) => {
    const codeField = attributeFamilyPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('code_field@_test');
    await expect(codeField).toHaveValue('code_field_test');
  });

  test('Special characters should be removed automatically in code field', async ({ attributeFamilyPage }) => {
    const codeField = attributeFamilyPage.page.getByRole('textbox', { name: 'Code' });
    await codeField.click();
    await codeField.pressSequentially('@#%^&*!()');
    await expect(codeField).toHaveValue('');
  });
});


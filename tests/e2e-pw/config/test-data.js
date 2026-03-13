/**
 * Centralized test data configuration for UnoPim E2E tests.
 *
 * All test values are defined here. Never use inline hardcoded strings
 * in spec files; import from this module instead.
 */
const testData = {
    /** Admin credentials (must match global-setup / .env) */
    admin: {
        email: 'admin@example.com',
        password: 'admin123',
    },

    /** Locales & timezone used across multiple test areas */
    locale: {
        ui: 'English (United States)',
        code: 'en_US',
        timezone: 'America/New_York',
        timezoneSearch: 'new_y',
    },

    /** Attribute test data */
    attribute: {
        textCode: 'product_name',
        textName: 'Product Name',
        updatedName: 'Product Name Updated',
        checkboxCode: 'in_the_box',
        checkboxName: 'In the Box',
        multiselectCode: 'features',
        multiselectName: 'Features',
        selectCode: 'material',
        selectName: 'Material',
        textSwatchCode: 'text_swatch',
        textSwatchName: 'Text Swatch',
        colorSwatchCode: 'color_swatch',
        colorSwatchName: 'Color Swatch',
        imageSwatchCode: 'image_swatch',
        imageSwatchName: 'Image Swatch',
        options: {
            checkbox: ['adapter', 'cable', 'instruction_manual', 'phone_cover'],
            multiselect: ['waterproof', 'bluetooth', 'rechargeable', 'charger'],
            select: ['cotton', 'fabric', 'leather', 'polyester'],
            textSwatch: ['red', 'blue'],
            colorSwatch: [
                { code: 'red', color: '#ff0000', label: 'Red' },
                { code: 'aqua_blue', color: '#00faf6', label: 'Aqua Blue' },
            ],
        },
    },

    /** Attribute family test data */
    attributeFamily: {
        code: 'header',
        name: 'Header',
        updatedName: 'Footer',
    },

    /** Attribute group test data */
    attributeGroup: {
        code: 'specifications',
        name: 'Specifications',
        updatedName: 'Tech Specs',
    },

    /** Category test data */
    category: {
        code: 'test1',
        name: 'Television',
        updatedName: 'LG Television',
    },

    /** Category field test data */
    categoryField: {
        code: 'warranty',
        name: 'Warranty',
        updatedName: 'Warranty Period',
    },

    /** Product test data */
    product: {
        simpleSku: 'acer456',
        configurableSku: 'realme1245',
        configurableName: 'Realme 7pro',
        simpleType: 'Simple',
        configurableType: 'Configurable',
        family: 'Default',
        /** Sample valid SKU patterns */
        validSkus: {
            alphanumeric: 'ABC123',
            lettersOnly: 'ABCDEFG',
            hyphenSeparator: 'PROD-001',
            multipleHyphens: 'PROD-CODE',
            underscoreSeparator: 'ITEM_CODE',
            mixedSeparators: 'SKU-PROD',
        },
        /** Sample invalid SKU patterns */
        invalidSkus: {
            startsWithHyphen: '-PROD001',
            startsWithUnderscore: '_INVALID',
            consecutiveHyphens: 'PROD--',
            specialChars: 'PROD@456',
            spaces: 'PROD 456',
        },
    },

    /** Channel test data */
    channel: {
        code: 'eCommerce',
        name: 'E-Commerce',
        updatedName: 'Mobile',
        rootCategory: '[root]',
        locale: 'English (United States)',
        currency: 'US Dollar',
    },

    /** Currency test data */
    currency: {
        code: 'EUR',
        name: 'Euro',
    },

    /** Locale test data */
    locale_setting: {
        code: 'fr_FR',
        name: 'French (France)',
    },

    /** Role test data */
    role: {
        adminName: 'Admin',
        adminDescription: 'The admin have full access',
        adminUpdatedDescription: 'The admin have full access of UnoPim',
        customName: 'Catalog Manager',
        customDescription: 'The catalog manager have access to the catalog section only',
    },

    /** User test data */
    user: {
        name: 'Testing',
        email: 'testing@example.com',
        password: 'testing123',
        wrongPassword: 'testing456',
        role: 'Administrator',
    },

    /** Integration test data */
    integration: {
        name: 'Test Integration',
        updatedName: 'Test Integration Updated',
    },

    /** Webhook test data */
    webhook: {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        updatedName: 'Test Webhook Updated',
    },
};

module.exports = testData;

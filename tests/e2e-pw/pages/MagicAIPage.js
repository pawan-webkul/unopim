const { BasePage } = require('./BasePage');

class MagicAIPage extends BasePage {
  constructor(page) {
    super(page);
    this.platformsTab = page.getByRole('link', { name: 'Platforms' });
    this.promptsTab = page.getByRole('link', { name: 'Prompts' });
    this.settingsTab = page.getByRole('link', { name: 'Settings' });
  }

  async goto() {
    await this.page.goto('/admin/magic-ai/platforms', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForLoad();
  }

  async openPlatforms() {
    await this.goto();
  }

  async openPrompts() {
    await this.page.goto('/admin/magic-ai/prompts', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForLoad();
  }

  async openSettings() {
    await this.page.goto('/admin/magic-ai/settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForLoad();
  }
}

module.exports = { MagicAIPage };

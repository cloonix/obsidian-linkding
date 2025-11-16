import { App, PluginSettingTab, Setting } from 'obsidian';
import LinkdingPlugin from '../main';

export class LinkdingSettingsTab extends PluginSettingTab {
  plugin: LinkdingPlugin;

  constructor(app: App, plugin: LinkdingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Configuration')
      .setHeading();

    new Setting(containerEl)
      .setName('Linkding API URL')
      .setDesc('The URL of your linkding instance (for example, http://localhost:9090 or https://yourdomain.com)')
      .addText(text => text
        .setPlaceholder('http://localhost:9090')
        .setValue(this.plugin.settings.apiUrl)
        .onChange(async (value) => {
          this.plugin.settings.apiUrl = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('API key')
      .setDesc('Your linkding integrations API key (found in your linkding settings)')
      .addText(text => {
        text.setPlaceholder('Enter your API key')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.type = 'password';
      });

    new Setting(containerEl)
      .setName('Description length')
      .setDesc('Maximum number of characters to show in bookmark descriptions (0 = no limit)')
      .addText(text => text
        .setPlaceholder('200')
        .setValue(this.plugin.settings.descriptionLength.toString())
        .onChange(async (value) => {
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue >= 0) {
            this.plugin.settings.descriptionLength = numValue;
            await this.plugin.saveSettings();
          }
        }));

    const testContainer = containerEl.createEl('div', { cls: 'linkding-test-connection' });

    new Setting(testContainer)
      .setName('Test connection')
      .setDesc('Test your linkding connection')
      .addButton(button => button
        .setButtonText('Test')
        .onClick(async () => {
          button.setDisabled(true);
          button.setButtonText('Testing...');

          try {
            await this.plugin.linkdingService.testConnection();
            this.showTestResult(testContainer, 'Connection successful!', 'success');
          } catch (error) {
            this.showTestResult(testContainer, `Connection failed: ${error.message}`, 'error');
          } finally {
            button.setDisabled(false);
            button.setButtonText('Test');
          }
        }));

    new Setting(containerEl)
      .setName('Usage')
      .setHeading();

    const usageEl = containerEl.createEl('div');
    usageEl.createEl('p', { text: 'Use a linkding code block with #tags and/or search terms:' });

    new Setting(usageEl)
      .setName('Examples')
      .setHeading();

    usageEl.createEl('p', { text: 'Tags only (finds bookmarks with both javascript and react tags)' });
    const example1 = usageEl.createEl('pre');
    example1.textContent = '```linkding\n#javascript #react\n```';

    usageEl.createEl('p', { text: 'Search terms only (finds bookmarks containing "hooks" and "tutorial")' });
    const example2 = usageEl.createEl('pre');
    example2.textContent = '```linkding\nhooks tutorial\n```';

    usageEl.createEl('p', { text: 'Both tags and search (finds bookmarks tagged with javascript and react, containing "hooks" and "tutorial")' });
    const example3 = usageEl.createEl('pre');
    example3.textContent = '```linkding\n#javascript #react hooks tutorial\n```';

  }

  private showTestResult(container: HTMLElement, message: string, type: 'success' | 'error') {
    const existingResult = container.querySelector('.linkding-test-result');
    if (existingResult) {
      existingResult.remove();
    }

    const resultEl = container.createEl('div', {
      cls: `linkding-test-result linkding-test-${type}`,
      text: message
    });

    setTimeout(() => {
      resultEl.remove();
    }, 5000);
  }
}

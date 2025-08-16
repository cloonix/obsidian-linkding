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

		containerEl.createEl('h2', { text: 'Linkding Bookmarks Settings' });

		new Setting(containerEl)
			.setName('Linkding API URL')
			.setDesc('The URL of your Linkding instance (e.g., http://localhost:9090 or https://yourdomain.com)')
			.addText(text => text
				.setPlaceholder('http://localhost:9090')
				.setValue(this.plugin.settings.apiUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Your Linkding API key (found in your Linkding settings)')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));

		const testContainer = containerEl.createEl('div', { cls: 'linkding-test-connection' });
		
		new Setting(testContainer)
			.setName('Test Connection')
			.setDesc('Test your Linkding connection')
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

		containerEl.createEl('h3', { text: 'Usage' });
		
		const usageEl = containerEl.createEl('div');
		usageEl.createEl('p', { text: 'There are two ways to display bookmarks in your notes:' });
		
		const methodsList = usageEl.createEl('ol');
		
		const method1 = methodsList.createEl('li');
		method1.createEl('strong', { text: 'Code blocks:' });
		method1.createEl('br');
		method1.createEl('code', { text: '```linkding\nyour-tag-name\n```' });
		
		const method2 = methodsList.createEl('li');
		method2.createEl('strong', { text: 'Frontmatter:' });
		method2.createEl('br');
		const frontmatterExample = method2.createEl('pre');
		frontmatterExample.textContent = `---
linkding_tags: 
  - tag1
  - tag2
---`;
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
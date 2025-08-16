import { Plugin, MarkdownView, MarkdownRenderer, Component } from 'obsidian';
import { LinkdingSettingsTab } from './src/settings';
import { LinkdingService } from './src/linkding-service';
import { LinkdingSettings, DEFAULT_SETTINGS } from './src/types';

export default class LinkdingPlugin extends Plugin {
	settings: LinkdingSettings;
	linkdingService: LinkdingService;

	async onload() {
		await this.loadSettings();
		
		this.linkdingService = new LinkdingService(this.settings);

		this.addSettingTab(new LinkdingSettingsTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor('linkding', (source, el, ctx) => {
			this.renderLinkdingBlock(source, el, ctx);
		});

		this.registerMarkdownPostProcessor((element, context) => {
			this.processLinkdingFrontmatter(element, context);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.linkdingService.updateSettings(this.settings);
	}

	private async renderLinkdingBlock(source: string, el: HTMLElement, ctx: any) {
		const tag = source.trim();
		if (!tag) {
			el.createEl('p', { text: 'Please specify a tag for Linkding bookmarks' });
			return;
		}

		try {
			const bookmarks = await this.linkdingService.getBookmarksByTag(tag);
			this.renderBookmarks(bookmarks, el);
		} catch (error) {
			el.createEl('p', { 
				text: `Error loading bookmarks: ${error.message}`,
				cls: 'linkding-error'
			});
		}
	}

	private async processLinkdingFrontmatter(element: HTMLElement, context: any) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const cache = this.app.metadataCache.getFileCache(view.file);
		if (!cache?.frontmatter?.linkding_tags) return;

		const tags = cache.frontmatter.linkding_tags;
		const tagArray = Array.isArray(tags) ? tags : [tags];

		for (const tag of tagArray) {
			try {
				const bookmarks = await this.linkdingService.getBookmarksByTag(tag);
				const container = element.createEl('div', { cls: 'linkding-bookmarks-container' });
				container.createEl('h3', { text: `Linkding Bookmarks: ${tag}` });
				this.renderBookmarks(bookmarks, container);
			} catch (error) {
				const errorEl = element.createEl('div', { cls: 'linkding-error' });
				errorEl.createEl('p', { text: `Error loading bookmarks for tag "${tag}": ${error.message}` });
			}
		}
	}

	private renderBookmarks(bookmarks: any[], container: HTMLElement) {
		if (bookmarks.length === 0) {
			container.createEl('p', { text: 'No bookmarks found for this tag' });
			return;
		}

		const list = container.createEl('ul', { cls: 'linkding-bookmarks-list' });
		
		bookmarks.forEach(bookmark => {
			const item = list.createEl('li', { cls: 'linkding-bookmark-item' });
			
			const link = item.createEl('a', {
				href: bookmark.url,
				text: bookmark.title || bookmark.url,
				cls: 'linkding-bookmark-link'
			});
			link.setAttr('target', '_blank');
			
			if (bookmark.description) {
				item.createEl('p', { 
					text: bookmark.description,
					cls: 'linkding-bookmark-description'
				});
			}
			
			if (bookmark.tag_names && bookmark.tag_names.length > 0) {
				const tagContainer = item.createEl('div', { cls: 'linkding-bookmark-tags' });
				bookmark.tag_names.forEach((tag: string) => {
					tagContainer.createEl('span', {
						text: tag,
						cls: 'linkding-bookmark-tag'
					});
				});
			}
		});
	}
}
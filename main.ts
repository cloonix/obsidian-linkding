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
		const input = source.trim();
		if (!input) {
			el.createEl('p', { text: 'Please specify tag(s) for Linkding bookmarks' });
			return;
		}

		// Parse comma-separated tags
		const tags = input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
		if (tags.length === 0) {
			el.createEl('p', { text: 'Please specify valid tag(s) for Linkding bookmarks' });
			return;
		}

		try {
			const bookmarks = await this.linkdingService.getBookmarksByTags(tags);
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

		// Sort bookmarks alphabetically by title
		const sortedBookmarks = [...bookmarks].sort((a, b) => {
			const titleA = (a.title || a.url).toLowerCase();
			const titleB = (b.title || b.url).toLowerCase();
			return titleA.localeCompare(titleB);
		});

		const listContainer = container.createEl('div', { cls: 'linkding-bookmarks-list' });
		
		sortedBookmarks.forEach(bookmark => {
			const item = listContainer.createEl('div', { cls: 'linkding-bookmark-item' });
			
			const link = item.createEl('a', {
				href: bookmark.url,
				text: bookmark.title || bookmark.url,
				cls: 'linkding-bookmark-link'
			});
			link.setAttr('target', '_blank');
			
			// Create description with inline tag labels
			if (bookmark.description && bookmark.description.trim()) {
				// Limit description to 200 characters
				const truncatedDescription = bookmark.description.length > 200 
					? bookmark.description.substring(0, 200) + '...'
					: bookmark.description;
				
				const descContainer = item.createEl('div', { cls: 'linkding-bookmark-description' });
				descContainer.appendText(truncatedDescription);
				
				// Add tag labels inline at the end
				if (bookmark.tag_names && bookmark.tag_names.length > 0) {
					bookmark.tag_names.forEach((tag: string) => {
						descContainer.createEl('span', {
							text: tag,
							cls: 'linkding-bookmark-tag'
						});
					});
				}
			} else if (bookmark.tag_names && bookmark.tag_names.length > 0) {
				// If no description, just show tags
				const descContainer = item.createEl('div', { cls: 'linkding-bookmark-description' });
				bookmark.tag_names.forEach((tag: string) => {
					descContainer.createEl('span', {
						text: tag,
						cls: 'linkding-bookmark-tag'
					});
				});
			}
		});
	}
}
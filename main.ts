import { Plugin, MarkdownView, MarkdownPostProcessorContext } from 'obsidian';
import { LinkdingSettingsTab } from './src/settings';
import { LinkdingService } from './src/linkding-service';
import { LinkdingSettings, DEFAULT_SETTINGS, LinkdingBookmark } from './src/types';

export default class LinkdingPlugin extends Plugin {
	settings: LinkdingSettings;
	linkdingService: LinkdingService;

	async onload() {
		await this.loadSettings();
		
		this.linkdingService = new LinkdingService(this.settings);

		this.addSettingTab(new LinkdingSettingsTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor('linkding', (source, el, ctx) => {
			void this.renderLinkdingBlock(source, el, ctx);
		});

		this.registerMarkdownPostProcessor((element, context) => {
			void this.processLinkdingFrontmatter(element, context);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.linkdingService.updateSettings(this.settings);
	}

	private async renderLinkdingBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const input = source.trim();
		if (!input) {
			el.createEl('p', { text: 'Please specify #tags and/or search terms for Linkding bookmarks' });
			return;
		}

		try {
			const parseResult = this.parseSearchInput(input);
			if (!parseResult.tags && !parseResult.search) {
				el.createEl('p', { text: 'Please specify #tags or search terms (for example, "#JavaScript #React hooks tutorial")' });
				return;
			}

			const bookmarks = await this.linkdingService.searchBookmarks(parseResult.tags || [], parseResult.search || '');
			this.renderBookmarks(bookmarks, el);
		} catch (error) {
			el.createEl('p', { 
				text: `Error loading bookmarks: ${error.message}`,
				cls: 'linkding-error'
			});
		}
	}

	private parseSearchInput(input: string): { tags?: string[], search?: string } {
		const tags: string[] = [];
		const searchWords: string[] = [];
		
		const words = input.split(/\s+/).filter(word => word.length > 0);
		
		for (const word of words) {
			if (word.startsWith('#')) {
				const tag = word.substring(1);
				if (tag.length > 0) {
					tags.push(tag);
				}
			} else {
				searchWords.push(word);
			}
		}

		const result: { tags?: string[], search?: string } = {};
		
		if (tags.length > 0) {
			result.tags = tags;
		}
		
		if (searchWords.length > 0) {
			result.search = searchWords.join(' ');
		}

		return result;
	}

	private async processLinkdingFrontmatter(element: HTMLElement, context: MarkdownPostProcessorContext) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const cache = this.app.metadataCache.getFileCache(view.file);
		if (!cache?.frontmatter?.linkding_tags) return;

		const tags = cache.frontmatter.linkding_tags;
		const tagArray = Array.isArray(tags) ? tags : [tags];

		for (const tag of tagArray) {
			try {
				const bookmarks = await this.linkdingService.searchBookmarks([tag]);
				const container = element.createEl('div', { cls: 'linkding-bookmarks-container' });
				container.createEl('h3', { text: `Linkding bookmarks: ${tag}` });
				this.renderBookmarks(bookmarks, container);
			} catch (error) {
				const errorEl = element.createEl('div', { cls: 'linkding-error' });
				errorEl.createEl('p', { text: `Error loading bookmarks for tag "${tag}": ${error.message}` });
			}
		}
	}

	private renderBookmarks(bookmarks: LinkdingBookmark[], container: HTMLElement) {
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
			
			// Create description
			if (bookmark.description && bookmark.description.trim()) {
				// Use configurable description length
				let truncatedDescription = bookmark.description;
				if (this.settings.descriptionLength > 0 && bookmark.description.length > this.settings.descriptionLength) {
					truncatedDescription = bookmark.description.substring(0, this.settings.descriptionLength) + '...';
				}
				
				item.createEl('div', { 
					text: truncatedDescription,
					cls: 'linkding-bookmark-description' 
				});
			}
			
			// Add tag labels on a new line
			if (bookmark.tag_names && bookmark.tag_names.length > 0) {
				const tagsContainer = item.createEl('div', { cls: 'linkding-bookmark-tags' });
				bookmark.tag_names.forEach((tag: string) => {
					tagsContainer.createEl('span', {
						text: tag,
						cls: 'linkding-bookmark-tag'
					});
				});
			}
		});
	}
}
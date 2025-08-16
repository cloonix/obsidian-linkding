import { requestUrl, RequestUrlParam } from 'obsidian';
import { LinkdingSettings, LinkdingBookmark, LinkdingApiResponse } from './types';

export class LinkdingService {
	private settings: LinkdingSettings;

	constructor(settings: LinkdingSettings) {
		this.settings = settings;
	}

	updateSettings(settings: LinkdingSettings) {
		this.settings = settings;
	}

	async testConnection(): Promise<void> {
		if (!this.settings.apiUrl || !this.settings.apiKey) {
			throw new Error('API URL and API Key are required');
		}

		try {
			await this.makeRequest('/api/bookmarks/?limit=1');
		} catch (error) {
			throw new Error(`Connection failed: ${error.message}`);
		}
	}

	async getBookmarksByTag(tag: string): Promise<LinkdingBookmark[]> {
		if (!this.settings.apiUrl || !this.settings.apiKey) {
			throw new Error('API URL and API Key must be configured in settings');
		}

		const encodedTag = encodeURIComponent(tag);
		const data = await this.makeRequest(`/api/bookmarks/?q=%23${encodedTag}&limit=100`);
		return data.results;
	}

	async getAllBookmarks(limit: number = 100): Promise<LinkdingBookmark[]> {
		if (!this.settings.apiUrl || !this.settings.apiKey) {
			throw new Error('API URL and API Key must be configured in settings');
		}

		const data = await this.makeRequest(`/api/bookmarks/?limit=${limit}`);
		return data.results;
	}

	private async makeRequest(endpoint: string): Promise<LinkdingApiResponse> {
		const url = this.normalizeUrl(this.settings.apiUrl) + endpoint;
		
		const requestParam: RequestUrlParam = {
			url: url,
			method: 'GET',
			headers: {
				'Authorization': `Token ${this.settings.apiKey}`,
				'Content-Type': 'application/json',
			},
		};

		try {
			const response = await requestUrl(requestParam);
			return response.json;
		} catch (error) {
			throw new Error(`Request failed: ${error.message}`);
		}
	}

	private normalizeUrl(url: string): string {
		return url.replace(/\/+$/, '');
	}
}
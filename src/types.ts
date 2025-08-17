export interface LinkdingSettings {
	apiUrl: string;
	apiKey: string;
	descriptionLength: number;
}

export const DEFAULT_SETTINGS: LinkdingSettings = {
	apiUrl: 'http://localhost:9090',
	apiKey: '',
	descriptionLength: 200
};

export interface LinkdingBookmark {
	id: number;
	url: string;
	title: string;
	description: string;
	notes: string;
	website_title: string;
	website_description: string;
	web_archive_snapshot_url: string;
	favicon_url: string;
	preview_image_url: string;
	is_archived: boolean;
	unread: boolean;
	shared: boolean;
	tag_names: string[];
	date_added: string;
	date_modified: string;
}

export interface LinkdingApiResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: LinkdingBookmark[];
}
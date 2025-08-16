# Linkding Bookmarks Plugin for Obsidian

Display bookmarks from your [Linkding](https://github.com/sissbruecker/linkding) collection directly in your Obsidian notes.

## Features

- 🔗 Connect to your Linkding instance via API
- 🏷️ Display bookmarks filtered by tags
- 📝 Embed bookmarks using simple code blocks
- ⚙️ Simple settings configuration
- 🎨 Clean, theme-aware styling

## Installation & Setup

1. Enable the plugin in Obsidian
2. Go to Settings → Linkding Bookmarks
3. Configure your Linkding API URL and API key
4. Test the connection to ensure everything works

### Getting Your API Key

1. Open your Linkding instance
2. Go to Settings
3. Find the "Integrations" section
4. Copy your API key

## Usage

Use code blocks to display bookmarks for one or more tags:

### Single Tag
\`\`\`linkding
programming
\`\`\`

### Multiple Tags (AND search)
\`\`\`linkding
github, linkding
\`\`\`

This will find bookmarks that have BOTH the "github" AND "linkding" tags.

## API Compatibility

This plugin is compatible with Linkding API v1. It has been tested with Linkding version 1.42.0.

## Support

If you encounter any issues, please check:

1. Your Linkding instance is accessible from your device
2. Your API key is correct and has proper permissions
3. The tags you're querying exist in your Linkding collection

## License

MIT License
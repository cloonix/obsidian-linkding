# Linkding Bookmarks Plugin for Obsidian

Display bookmarks from your [Linkding](https://github.com/sissbruecker/linkding) collection directly in Obsidian notes.

This plugin allows you to seamlessly integrate your Linkding bookmarks into your Obsidian workflow. Query bookmarks by tags, search terms, or both, and display them as formatted lists within your notes. Perfect for research notes, reference collections, and organizing related resources alongside your thoughts.

**Key Features:**
- **Flexible Querying**: Search by tags (#javascript), text ("hooks tutorial"), or combine both
- **Smart Rendering**: Bookmarks display with titles, descriptions (truncated to configurable length), and tags
- **Live Integration**: Fetches fresh bookmark data from your Linkding instance
- **Clean Formatting**: Bookmarks are sorted alphabetically and styled to match Obsidian's aesthetic
- **Easy Setup**: Simple API key configuration with connection testing

## Installation

### Via BRAT (Recommended)
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Add `cloonix/obsidian-linkding` as a beta plugin
3. Enable "Linkding Bookmarks" in Community Plugins

### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/cloonix/obsidian-linkding/releases)
2. Create folder `VaultFolder/.obsidian/plugins/linkding-bookmarks/`
3. Place the files in this folder
4. Enable "Linkding Bookmarks" in Community Plugins

## Setup

1. Go to Settings → Linkding Bookmarks
2. Enter your Linkding API URL and API key
3. Test connection

## Usage

Use natural language syntax in linkding code blocks:

**Tags only:**
```linkding
#javascript #react
```

**Search only:**
```linkding
hooks tutorial
```

**Combined:**
```linkding
#javascript #react hooks tutorial
```

## Getting Your API Key

1. Open Linkding → Settings → Integrations
2. Copy your API key

## License

MIT
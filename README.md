# Linkding Bookmarks Plugin for Obsidian

Display bookmarks from your [Linkding](https://github.com/sissbruecker/linkding) collection directly in Obsidian notes.

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
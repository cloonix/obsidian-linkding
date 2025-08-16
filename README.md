# Linkding Bookmarks Plugin for Obsidian

Display bookmarks from your [Linkding](https://github.com/sissbruecker/linkding) collection directly in your Obsidian notes.

## Features

- 🔗 Connect to your Linkding instance via API
- 🏷️ Display bookmarks filtered by tags
- 📝 Two ways to embed bookmarks: code blocks and frontmatter
- ⚙️ Simple settings configuration
- 🎨 Clean, theme-aware styling

## Setup

1. Install the plugin in Obsidian
2. Go to Settings → Linkding Bookmarks
3. Configure your Linkding API URL and API key
4. Test the connection to ensure everything works

### Getting Your API Key

1. Open your Linkding instance
2. Go to Settings
3. Find the "API" section
4. Copy your API key

## Usage

### Method 1: Code Blocks

Use code blocks to display bookmarks for a specific tag:

\`\`\`linkding
your-tag-name
\`\`\`

### Method 2: Frontmatter

Add tags to your note's frontmatter to automatically display bookmarks:

\`\`\`yaml
---
linkding_tags: 
  - programming
  - obsidian
---
\`\`\`

Or for a single tag:

\`\`\`yaml
---
linkding_tags: programming
---
\`\`\`

## Installation

### Method 1: Community Plugin Store (Recommended)

*Note: This plugin is pending approval for the official store*

1. Open Obsidian Settings
2. Go to Community Plugins
3. Browse for "Linkding Bookmarks"
4. Click Install and Enable

### Method 2: Manual Installation (BRAT)

Using the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat):

1. Install and enable BRAT
2. Add this repository: `yourusername/obsidian-linkding` 
3. BRAT will automatically download and install the plugin

### Method 3: Manual Installation (GitHub Releases)

1. Go to the [Releases page](https://github.com/yourusername/obsidian-linkding/releases)
2. Download the latest `main.js`, `manifest.json`, and `styles.css`
3. Create folder `.obsidian/plugins/linkding-bookmarks/` in your vault
4. Place the downloaded files in this folder
5. Enable the plugin in Obsidian settings

### Method 4: From Source (Development)

1. Clone this repository to your local machine
2. Navigate to the plugin directory:
   ```bash
   cd obsidian-linkding
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the plugin:
   ```bash
   npm run build
   ```
5. Copy the plugin to your Obsidian vault:
   - Create a folder named `linkding-bookmarks` in your `.obsidian/plugins/` folder
   - Copy `main.js`, `manifest.json`, and `styles.css` to this folder
6. Enable the plugin in Obsidian:
   - Go to Settings → Community Plugins
   - Find "Linkding Bookmarks" and enable it

### Method 2: Manual Installation (Pre-built)

1. Download the latest release from GitHub
2. Extract the files to `.obsidian/plugins/linkding-bookmarks/` in your vault
3. Enable the plugin in Obsidian settings

## Development

### Development Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development mode with hot reload:
   ```bash
   npm run dev
   ```
4. The plugin will automatically rebuild when you make changes

### Building for Production

```bash
npm run build
```

This creates the `main.js` file that Obsidian needs to run the plugin.

### Project Structure

```
obsidian-linkding/
├── src/
│   ├── types.ts           # TypeScript interfaces for Linkding API
│   ├── settings.ts        # Settings page component
│   └── linkding-service.ts # API service for Linkding communication
├── main.ts                # Main plugin entry point
├── manifest.json          # Plugin metadata
├── styles.css            # Plugin styling
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── esbuild.config.mjs    # Build configuration
└── README.md             # This file
```

### Key Files Explained

- **main.ts**: The main plugin class that handles Obsidian integration, registers processors for code blocks and frontmatter
- **src/linkding-service.ts**: Handles all communication with the Linkding API
- **src/settings.ts**: Creates the settings page where users configure their API credentials
- **src/types.ts**: TypeScript type definitions for Linkding API responses
- **styles.css**: CSS styling that adapts to Obsidian's theme system

## API Compatibility

This plugin is compatible with Linkding API v1. It has been tested with Linkding version 1.19.0 and newer.

## Support

If you encounter any issues, please check:

1. Your Linkding instance is accessible from your device
2. Your API key is correct and has proper permissions
3. The tags you're querying exist in your Linkding collection

## License

MIT License
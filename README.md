# Linkding Bookmarks Plugin for Obsidian

Display bookmarks from your [Linkding](https://github.com/sissbruecker/linkding) collection directly in Obsidian notes.

This plugin allows you to seamlessly integrate your Linkding bookmarks into your Obsidian workflow. Query bookmarks by tags, search terms, or both, and display them as formatted lists within your notes. Perfect for research notes, reference collections, and organizing related resources alongside your thoughts.

**Key Features:**
- **Powerful Search**: Full support for Linkding's search syntax with boolean operators (AND, OR, NOT), grouping, and phrases
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

Use Linkding's powerful search syntax in code blocks. The plugin supports the full Linkding search expression syntax including boolean operators and grouping.

### Basic Examples

**Single tag:**
```linkding
#javascript
```

**Multiple tags (implicit AND):**
```linkding
#javascript #react
```

**Search terms:**
```linkding
hooks tutorial
```

**Combined tags and search:**
```linkding
#javascript hooks tutorial
```

### Boolean Operators

**AND operator (explicit):**
```linkding
#javascript and #react
```

**OR operator:**
```linkding
#javascript or #python
```

**NOT operator:**
```linkding
#programming not #javascript
```

**Complex queries with grouping:**
```linkding
#tutorial and (#javascript or #python)
```

**Phrases (exact match):**
```linkding
"react hooks" #tutorial
```

### Search Rules

- **Case-insensitive**: All searches, tags, and operators are case-insensitive
- **Implicit AND**: Multiple terms without an operator are combined with AND
  - `#javascript #react` is the same as `#javascript and #react`
- **Grouping**: Use parentheses `()` to control evaluation order
- **Phrases**: Use quotes `"..."` to search for exact phrases
- **Tag prefix**: Tags must start with `#`

For more details, see the [Linkding search documentation](https://linkding.link/search/).

## Getting Your API Key

1. Open Linkding → Settings → Integrations
2. Copy your API key

## License

MIT
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin that integrates with Linkding (a bookmark manager) to display bookmarks within Obsidian notes. The plugin fetches bookmarks from a Linkding API and renders them in Obsidian using code blocks or frontmatter.

## Development Commands

- `npm run dev` - Start development mode with esbuild watching for changes
- `npm run build` - Build production version (runs TypeScript check first, then esbuild)
- `npm run version` - Bump version and update manifest/versions files

## Architecture

### Core Components

- **main.ts** - Main plugin class that handles Obsidian plugin lifecycle
- **src/linkding-service.ts** - Service class for Linkding API communication
- **src/settings.ts** - Settings tab UI for configuring API URL and key
- **src/types.ts** - TypeScript interfaces for settings and API responses

### Plugin Flow

1. Plugin loads and initializes LinkdingService with saved settings
2. Registers markdown code block processor for `linkding` blocks
3. Registers markdown post-processor for frontmatter handling
4. Code blocks pass the entire search query to Linkding API (supports boolean operators)
5. Bookmarks are rendered as sorted lists with titles, descriptions, and tags

### API Integration

- Uses Obsidian's `requestUrl` for HTTP requests
- Authenticates with Linkding using Token authentication
- Passes search queries directly to Linkding's search API: `/api/bookmarks/?q={encodedQuery}`
- Supports full Linkding search syntax including:
  - Boolean operators: `and`, `or`, `not`
  - Grouping with parentheses: `(#tag1 or #tag2)`
  - Phrases: `"exact phrase"`
  - Tags: `#tag`
  - Mixed queries: `#tag and "search phrase"`
- Results limited to 100 bookmarks per query

### Rendering Logic

- Bookmarks sorted alphabetically by title
- Descriptions truncated to 200 characters
- Tags displayed as styled labels below description
- All links open in new tabs (`target="_blank"`)

## Build System

- **TypeScript**: Configured for ES6 target with DOM libs
- **esbuild**: Bundles TypeScript to `main.js` with external Obsidian APIs
- **Development**: Watch mode with inline source maps
- **Production**: No source maps, tree shaking enabled

## Testing

No automated test framework is configured. Manual testing involves:
- Testing plugin loading/unloading in Obsidian
- Testing API connection with real Linkding instance
- Testing both code block and frontmatter rendering
- Testing error scenarios (invalid API, network issues)

## Code Style

- TypeScript for all source code
- No linting configuration present
- Follow existing patterns for Obsidian plugin development
- API calls should handle errors gracefully with user-friendly messages
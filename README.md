# commit-forge

[![npm version](https://img.shields.io/npm/v/commit-forge.svg)](https://www.npmjs.com/package/commit-forge)
[![npm downloads](https://img.shields.io/npm/dm/commit-forge.svg)](https://www.npmjs.com/package/commit-forge)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/commit-forge)](https://bundlephobia.com/package/commit-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/ayaanraza9/commit-forge.svg?style=social&label=Star)](https://github.com/ayaanraza9/commit-forge)
[![GitHub forks](https://img.shields.io/github/forks/ayaanraza9/commit-forge.svg?style=social&label=Fork)](https://github.com/ayaanraza9/commit-forge)

A lightweight CLI tool for generating, linting, and creating commits with enforced formatting. Perfect for teams that want consistent commit messages with JIRA integration.

## Package Statistics

| Metric           | Value                        |
| ---------------- | ---------------------------- |
| **Package Size** | ~16KB (minified single file) |
| **Node.js**      | >=14.0.0                     |
| **License**      | MIT                          |
| **Main File**    | `dist/cli.js`                |

## Features

- 🎯 **Generate** commit messages with proper formatting
- ✅ **Lint** commit messages to ensure they follow the format
- 🚀 **Interactive commit** flow with prompts for missing information
- 🎨 **Category selection** with beautiful interactive menu
- 🔗 **JIRA integration** with automatic validation
- 📝 **Conventional commit** format support

## Installation

### Global Installation

```bash
npm install -g commit-forge
```

### Local Installation

```bash
npm install --save-dev commit-forge
```

## Usage

### Generate a commit message

```bash
commit-forge generate --jira TB-123 --category feat --message "add login" --description "Implement login flow"
```

### Lint a commit message

```bash
# From a file
commit-forge lint .git/COMMIT_EDITMSG

# From stdin
echo "[TB-123] ✨ feat: add feature" | commit-forge lint
```

### Interactive commit

```bash
commit-forge commit
```

This will:

1. Check for staged files
2. Prompt for missing information (JIRA ID, category, message, description)
3. Show an interactive category selector
4. Create the commit with the formatted message

### With flags (non-interactive)

```bash
commit-forge commit --jira TB-123 --category feat --message "add login" --description "Implement login flow"
```

### Using npm scripts

If you have `commit-forge` installed locally in your project, you can add a commit script to your `package.json`:

```json
{
	"scripts": {
		"commit": "commit-forge commit"
	}
}
```

Then use it with:

```bash
npm run commit
# or with bun
bun run commit
```

This will run the interactive commit flow, checking for staged files and prompting for commit details.

**Note:** The commit script is also available in this package itself. You can use `npm run commit` or `bun run commit` in this repository to test the tool.

## Commands

- `generate` - Format and print a commit message
- `lint` - Validate a commit message file or stdin input
- `commit` - Prompt for details, ensure staged files, and run git commit

## Flags

- `--jira, -j` - JIRA issue id (e.g., TB-123)
- `--category, -c` - Category keyword (feat, fix, docs, style, refactor, perf, test, chore)
- `--message, -m` - Short subject line (<= 72 chars)
- `--description, -d` - Longer description (use \n for newlines)
- `--file, -f` - Commit message file path (lint command)
- `--json` - Output lint result as JSON
- `--output, -o` - File path to write generated message
- `--help, -h` - Show help

## Allowed Categories

- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix
- 📝 `docs` - Documentation change
- 🎨 `style` - Code style / formatting
- ♻️ `refactor` - Refactoring
- ⚡ `perf` - Performance improvement
- ✅ `test` - Tests
- 🧹 `chore` - Chores & maintenance

## Commit Format

Commit messages follow this format:

```
[TB-123] ✨ feat: add feature

Optional longer description here
```

## Configuration

You can customize `commit-forge` behavior by creating a configuration file in your project root. The tool will automatically look for configuration files in the following order:

1. `.commit-forge.json`
2. `commit-forge.config.json`
3. `.commit-forge.ts`
4. `commit-forge.config.ts`
5. `.commit-forge.js`
6. `commit-forge.config.js`

### Configuration Options

Create a `.commit-forge.json` file in your project root:

```json
{
	"jira": {
		"enabled": true,
		"required": true,
		"allowNoJira": true
	},
	"emoji": {
		"enabled": true
	},
	"subject": {
		"maxLength": 72
	},
	"description": {
		"required": false
	}
}
```

#### JIRA Configuration

- `jira.enabled` (boolean, default: `true`) - Enable/disable JIRA ID support
- `jira.required` (boolean, default: `true`) - Require JIRA ID in commits
- `jira.allowNoJira` (boolean, default: `true`) - Allow "NO-JIRA" as a valid value

**Example: Disable JIRA completely**

```json
{
	"jira": {
		"enabled": false
	}
}
```

**Example: Make JIRA optional (not required)**

```json
{
	"jira": {
		"enabled": true,
		"required": false,
		"allowNoJira": true
	}
}
```

#### Emoji Configuration

- `emoji.enabled` (boolean, default: `true`) - Show emojis in category formatting

**Example: Disable emojis**

```json
{
	"emoji": {
		"enabled": false
	}
}
```

#### Subject Configuration

- `subject.maxLength` (number, default: `72`) - Maximum length for commit message subject line

**Example: Change max length to 100 characters**

```json
{
	"subject": {
		"maxLength": 100
	}
}
```

#### Description Configuration

- `description.required` (boolean, default: `false`) - Require description in commits

**Example: Require description**

```json
{
	"description": {
		"required": true
	}
}
```

### JavaScript Configuration File

You can also use a JavaScript file for more dynamic configuration:

```javascript
// commit-forge.config.js
module.exports = {
	jira: {
		enabled: process.env.USE_JIRA !== "false",
		required: true,
		allowNoJira: true,
	},
	emoji: {
		enabled: true,
	},
	subject: {
		maxLength: 72,
	},
	description: {
		required: false,
	},
};
```

### TypeScript Configuration File

TypeScript configuration files are also supported! You'll need one of these packages installed:

- `ts-node` (recommended)
- `tsx`
- `esbuild-register`

```typescript
// commit-forge.config.ts
import type { CommitForgeConfig } from "commit-forge";

const config: CommitForgeConfig = {
	jira: {
		enabled: process.env.USE_JIRA !== "false",
		required: true,
		allowNoJira: true,
	},
	emoji: {
		enabled: true,
	},
	subject: {
		maxLength: 72,
	},
	description: {
		required: false,
	},
};

export default config;
```

Or using CommonJS syntax:

```typescript
// commit-forge.config.ts
module.exports = {
	jira: {
		enabled: process.env.USE_JIRA !== "false",
		required: true,
		allowNoJira: true,
	},
	emoji: {
		enabled: true,
	},
	subject: {
		maxLength: 72,
	},
	description: {
		required: false,
	},
};
```

## Git Hook Integration

You can use this tool as a git commit-msg hook to automatically validate commit messages:

```bash
# Create the hook
echo '#!/bin/sh
commit-forge lint "$1"' > .git/hooks/commit-msg

# Make it executable
chmod +x .git/hooks/commit-msg
```

## Development

### Building

```bash
npm run build
# or with bun
bun run build.js
```

This creates a single minified bundle at `dist/cli.js` that contains all the code. The bundle is optimized and ready for distribution.

### Publishing to npm

1. **Login to npm** (if not already logged in):

   ```bash
   npm login
   ```

2. **Build and verify**:

   ```bash
   npm run build
   ```

3. **Publish**:

   ```bash
   npm publish
   ```

   Or use the npm script:

   ```bash
   npm run publish
   ```

The `prepublishOnly` script will automatically:

- Build the minified bundle
- Ensure the CLI binary is executable

**Note:** Only the `dist/` folder will be published to npm. The source files (`bin/`, `lib/`) are excluded from the package.

## License

MIT

## Contributors

- [Ayaan Raza](https://github.com/ayaanraza9) - Creator
- [Sawan Kumar](https://github.com/Sawannrl123) - Collaborator

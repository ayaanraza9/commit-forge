# commit-mate

[![npm version](https://img.shields.io/npm/v/commit-mate.svg)](https://www.npmjs.com/package/commit-mate)
[![npm downloads](https://img.shields.io/npm/dm/commit-mate.svg)](https://www.npmjs.com/package/commit-mate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/commit-mate)](https://bundlephobia.com/package/commit-mate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/ayaanraza9/commit-mate.svg?style=social&label=Star)](https://github.com/ayaanraza9/commit-mate)
[![GitHub forks](https://img.shields.io/github/forks/ayaanraza9/commit-mate.svg?style=social&label=Fork)](https://github.com/ayaanraza9/commit-mate)

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
npm install -g commit-mate
```

### Local Installation

```bash
npm install --save-dev commit-mate
```

## Usage

### Generate a commit message

```bash
commit-mate generate --jira TB-123 --category feat --message "add login" --description "Implement login flow"
```

### Lint a commit message

```bash
# From a file
commit-mate lint .git/COMMIT_EDITMSG

# From stdin
echo "[TB-123] ✨ feat: add feature" | commit-mate lint
```

### Interactive commit

```bash
commit-mate commit
```

This will:

1. Check for staged files
2. Prompt for missing information (JIRA ID, category, message, description)
3. Show an interactive category selector
4. Create the commit with the formatted message

### With flags (non-interactive)

```bash
commit-mate commit --jira TB-123 --category feat --message "add login" --description "Implement login flow"
```

### Using npm scripts

If you have `commit-mate` installed locally in your project, you can add a commit script to your `package.json`:

```json
{
	"scripts": {
		"commit": "commit-mate commit"
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

## Git Hook Integration

You can use this tool as a git commit-msg hook to automatically validate commit messages:

```bash
# Create the hook
echo '#!/bin/sh
commit-mate lint "$1"' > .git/hooks/commit-msg

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
- [Sawan Kumar](https://github.com/Sawannrl123) - Maintainer

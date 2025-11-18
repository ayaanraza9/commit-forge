#!/usr/bin/env node

const { parseArgs } = require('../lib/parser');
const { exitWithError } = require('../lib/logger');
const { printHelp } = require('../lib/help');
const { handleGenerate } = require('../lib/commands/generate');
const { handleLint } = require('../lib/commands/lint');
const { handleCommit } = require('../lib/commands/commit');

async function run() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];

  if (flags.help || !command) {
    printHelp();
    process.exit(command ? 0 : 1);
  }

  if (command === 'generate') {
    handleGenerate(flags);
    return;
  }

  if (command === 'lint') {
    handleLint(flags, positional);
    return;
  }

  if (command === 'commit') {
    await handleCommit(flags);
    return;
  }

  exitWithError('Unknown command. Use "generate", "lint", or "commit".');
}

run().catch((error) => {
  const { logError } = require('../lib/logger');
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});


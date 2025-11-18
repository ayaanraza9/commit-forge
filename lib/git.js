const { execSync, spawnSync } = require('node:child_process');
const { logInfo, exitWithError } = require('./logger');
const { COLORS } = require('./constants');

function ensureStagedChanges() {
  let output = '';
  try {
    output = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
  } catch (error) {
    exitWithError('Unable to read staged files. Is this a Git repository?');
  }

  if (!output) {
    exitWithError('No staged files detected. Stage files before running this command.');
  }

  const files = output.split('\n').filter(Boolean);
  logInfo('Staged files:');
  files.forEach((file) => console.log(`${COLORS.dim}  - ${file}${COLORS.reset}`));
  return files;
}

function runGitCommit({ subject, description }) {
  const args = ['commit', '-m', subject];
  if (description.trim()) {
    args.push('-m', description.trim());
  }
  const result = spawnSync('git', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    exitWithError('git commit failed.');
  }
}

module.exports = {
  ensureStagedChanges,
  runGitCommit,
};


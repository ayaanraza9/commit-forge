const { logSuccess, logError } = require('../logger');
const { COLORS } = require('../constants');
const { lintFromText, readCommitText } = require('../linter');

function handleLint(flags, positional) {
  const file = flags.file ?? positional[1];
  const text = readCommitText({ file });
  const result = lintFromText(text);

  if (flags.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else if (result.ok) {
    logSuccess('Commit message looks good.');
  } else {
    const details = result.problems.map((problem) => `${COLORS.red}  - ${problem}${COLORS.reset}`).join('\n');
    logError(`Commit message failed checks:\n${details}`);
  }

  process.exit(result.ok ? 0 : 1);
}

module.exports = {
  handleLint,
};


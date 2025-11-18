const fs = require('node:fs');
const path = require('node:path');
const { logSuccess } = require('../logger');
const { gatherInputFromFlags } = require('../normalizer');
const { buildCommitMessage } = require('../formatter');

function handleGenerate(flags) {
  const inputs = gatherInputFromFlags(flags);
  const commitMessage = buildCommitMessage(inputs);

  if (flags.output) {
    const destination = path.resolve(process.cwd(), flags.output);
    fs.writeFileSync(destination, commitMessage);
    logSuccess(`Wrote commit message to ${destination}`);
  } else {
    process.stdout.write(commitMessage);
  }
}

module.exports = {
  handleGenerate,
};


const { logInfo, logSuccess } = require('../logger');
const { ensureStagedChanges, runGitCommit } = require('../git');
const { gatherInputFromFlags, needsPrompts, normalizeInputs } = require('../normalizer');
const { ensureValidInputs } = require('../validators');
const { buildSubject } = require('../formatter');
const { promptForMissingInputs } = require('../prompts');

async function resolveInputsForCommit(flags) {
  const partial = gatherInputFromFlags(flags, { requireAll: false });
  if (!needsPrompts(partial)) {
    ensureValidInputs(partial);
    return partial;
  }

  const prompted = await promptForMissingInputs(partial);
  const normalized = normalizeInputs(prompted);
  ensureValidInputs(normalized);
  return normalized;
}

async function handleCommit(flags) {
  ensureStagedChanges();
  const inputs = await resolveInputsForCommit(flags);
  const subject = buildSubject(inputs);
  const description = inputs.description?.trim() ?? '';
  logInfo(`Commit title:\n  ${subject}`);
  runGitCommit({ subject, description });
  logSuccess('Commit created successfully.');
}

module.exports = {
  handleCommit,
};


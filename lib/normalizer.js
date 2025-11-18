const { ensureValidInputs } = require('./validators');

function normalizeInputs(inputs) {
  const normalized = {
    jira: typeof inputs.jira === 'string' ? inputs.jira.trim().toUpperCase() : undefined,
    category: typeof inputs.category === 'string' ? inputs.category.trim().toLowerCase() : undefined,
    message: typeof inputs.message === 'string' ? inputs.message.trim() : undefined,
    description: undefined,
  };

  if (typeof inputs.description === 'string') {
    const cleaned = inputs.description.replace(/\\n/g, '\n').trim();
    normalized.description = cleaned === '' ? undefined : cleaned;
  }

  return normalized;
}

function gatherInputFromFlags(flags, { requireAll = true } = {}) {
  const normalized = normalizeInputs({
    jira: flags.jira,
    category: flags.category,
    message: flags.message,
    description: flags.description,
  });

  if (requireAll) {
    ensureValidInputs(normalized);
  }

  return normalized;
}

function needsPrompts(inputs) {
  return ['jira', 'category', 'message'].some((field) => !inputs[field]);
}

module.exports = {
  normalizeInputs,
  gatherInputFromFlags,
  needsPrompts,
};


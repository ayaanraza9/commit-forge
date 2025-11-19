const { ensureValidInputs } = require('./validators');
const { getConfig } = require('./config');

function normalizeInputs(inputs) {
  const config = getConfig();
  const normalized = {
    jira: undefined,
    category: typeof inputs.category === 'string' ? inputs.category.trim().toLowerCase() : undefined,
    message: typeof inputs.message === 'string' ? inputs.message.trim() : undefined,
    description: undefined,
  };

  // Only normalize JIRA if it's enabled
  if (config.jira.enabled && typeof inputs.jira === 'string') {
    normalized.jira = inputs.jira.trim().toUpperCase();
  }

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
  const config = getConfig();
  const fieldsToCheck = ['category', 'message'];
  
  // Only check for JIRA if it's enabled
  if (config.jira.enabled) {
    fieldsToCheck.push('jira');
  }
  
  return fieldsToCheck.some((field) => !inputs[field]);
}

module.exports = {
  normalizeInputs,
  gatherInputFromFlags,
  needsPrompts,
};


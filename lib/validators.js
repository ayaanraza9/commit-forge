const { ALLOWED_CATEGORIES } = require('./constants');

function validateJiraId(jiraId) {
  if (!jiraId) {
    return 'Missing JIRA id. Provide via --jira.';
  }

  if (jiraId === 'NO-JIRA') {
    return null;
  }

  if (!/^[A-Z]+-\d+$/.test(jiraId)) {
    return `Invalid JIRA id "${jiraId}". Use format ABC-123.`;
  }

  return null;
}

function validateCategory(category) {
  if (!category) {
    return 'Missing category. Provide via --category.';
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return `Invalid category "${category}". Allowed: ${ALLOWED_CATEGORIES.join(', ')}.`;
  }

  return null;
}

function validateMessage(message) {
  if (!message || !message.trim()) {
    return 'Missing commit message subject. Provide via --message.';
  }

  if (message.length > 72) {
    return 'Subject line should be <= 72 characters.';
  }

  return null;
}

function validateDescription(description) {
  if (description === undefined) {
    return null;
  }

  if (!description.trim()) {
    return 'Description must include non-whitespace characters or be omitted.';
  }

  return null;
}

function validateInputs(inputs) {
  return [
    validateJiraId(inputs.jira),
    validateCategory(inputs.category),
    validateMessage(inputs.message),
    validateDescription(inputs.description),
  ].filter(Boolean);
}

function ensureValidInputs(inputs) {
  const { exitWithError } = require('./logger');
  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    exitWithError(errors.join('\n'));
  }
}

module.exports = {
  validateJiraId,
  validateCategory,
  validateMessage,
  validateDescription,
  validateInputs,
  ensureValidInputs,
};


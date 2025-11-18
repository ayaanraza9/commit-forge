const { CATEGORY_META } = require('./constants');

function formatCategory(category) {
  const meta = CATEGORY_META[category];
  return meta ? `${meta.icon} ${category}` : category;
}

function buildSubject({ jira, category, message }) {
  return `[${jira}] ${formatCategory(category)}: ${message.trim()}`;
}

function buildCommitMessage({ jira, category, message, description }) {
  const subject = buildSubject({ jira, category, message });
  if (!description) {
    return `${subject}\n`;
  }
  return `${subject}\n\n${description.trim()}\n`;
}

module.exports = {
  formatCategory,
  buildSubject,
  buildCommitMessage,
};


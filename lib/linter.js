const fs = require('node:fs');
const path = require('node:path');
const { exitWithError } = require('./logger');
const { validateJiraId, validateCategory, validateMessage } = require('./validators');

function parseCategoryFromDisplay(display) {
  if (!display) {
    return display;
  }
  const parts = display.trim().split(/\s+/);
  const candidate = parts[parts.length - 1];
  return candidate;
}

function lintFromText(text) {
  const problems = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  if (lines.length === 0 || !lines[0].trim()) {
    problems.push('Commit message is empty.');
    return { ok: false, problems };
  }

  const firstLine = lines[0];
  const match = firstLine.match(/^\[(?<jira>NO-JIRA|[A-Z]+-\d+)] (?<categoryPart>[^:]+): (?<subject>.+)$/);

  if (!match) {
    problems.push('First line must look like "[TB-123] ✨ feat: summary".');
    return { ok: false, problems };
  }

  const { jira, categoryPart, subject } = match.groups;
  const normalizedCategory = parseCategoryFromDisplay(categoryPart);

  const jiraError = validateJiraId(jira);
  if (jiraError) {
    problems.push(jiraError);
  }

  const catError = validateCategory(normalizedCategory);
  if (catError) {
    problems.push(catError);
  }

  const subjectError = validateMessage(subject);
  if (subjectError) {
    problems.push(subjectError);
  }

  let body = '';
  if (typeof lines[1] === 'undefined') {
    // No body provided; acceptable
  } else if (lines[1].trim() !== '') {
    problems.push('Include a blank line between subject and body when providing a description.');
    body = lines.slice(1).join('\n').trim();
  } else {
    body = lines.slice(2).join('\n').trim();
  }

  return {
    ok: problems.length === 0,
    problems,
    jira,
    category: normalizedCategory,
    subject,
  };
}

function readCommitText({ file }) {
  if (file) {
    const resolved = path.resolve(process.cwd(), file);
    if (!fs.existsSync(resolved)) {
      exitWithError(`Commit message file not found: ${resolved}`);
    }
    return fs.readFileSync(resolved, 'utf8');
  }

  try {
    if (!process.stdin.isTTY) {
      return fs.readFileSync(0, 'utf8');
    }
  } catch (error) {
    // Ignore and fall through to empty string.
  }

  exitWithError('No commit message input provided. Pass a file path or pipe content via stdin.');
  return '';
}

module.exports = {
  parseCategoryFromDisplay,
  lintFromText,
  readCommitText,
};


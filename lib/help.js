const { ALLOWED_CATEGORIES, CATEGORY_META } = require('./constants');
const { colorize, sectionTitle } = require('./utils');
const { COLORS } = require('./constants');

function describeCategories() {
  return ALLOWED_CATEGORIES.map((key) => {
    const meta = CATEGORY_META[key];
    const icon = colorize(meta.icon, COLORS.yellow);
    const name = colorize(key, `${COLORS.bold}${COLORS.cyan}`);
    const description = colorize(meta.description, COLORS.dim);
    return `    ${icon} ${name}: ${description}`;
  }).join('\n');
}

function printHelp() {
  const usage = [
    `${sectionTitle('Usage')}`,
    `  ${colorize('commit-forge generate --jira TB-123 --category feat --message "add login" --description "Implement login flow"', COLORS.dim)}`,
    `  ${colorize('commit-forge lint .git/COMMIT_EDITMSG', COLORS.dim)}`,
    `  ${colorize('commit-forge commit', COLORS.dim)}`,
  ];

  const commands = [
    `${sectionTitle('Commands')}`,
    `  ${colorize('generate', COLORS.cyan)}        Format and print a commit message`,
    `  ${colorize('lint', COLORS.cyan)}            Validate a commit message file or stdin input`,
    `  ${colorize('commit', COLORS.cyan)}          Prompt for details, ensure staged files, and run git commit`,
  ];

  const flags = [
    `${sectionTitle('Flags')}`,
    `  ${colorize('--jira, -j', COLORS.yellow)}            JIRA issue id (e.g., TB-123)`,
    `  ${colorize('--category, -c', COLORS.yellow)}        Category keyword`,
    `  ${colorize('--message, -m', COLORS.yellow)}         Short subject line`,
    `  ${colorize('--description, -d', COLORS.yellow)}     Longer description (\\n for newlines)`,
    `  ${colorize('--file, -f', COLORS.yellow)}            Commit message file path (lint)`,
    `  ${colorize('--json', COLORS.yellow)}                Output lint result as JSON`,
    `  ${colorize('--output, -o', COLORS.yellow)}          File path to write generated message`,
    `  ${colorize('--help, -h', COLORS.yellow)}            Show this help`,
  ];

  const sections = [
    `${colorize('commit-forge', `${COLORS.bold}${COLORS.cyan}`)} - generate, lint, or create commits with enforced formatting`,
    '',
    ...usage,
    '',
    ...commands,
    '',
    ...flags,
    '',
    `${sectionTitle('Allowed categories')}`,
    describeCategories(),
    '',
    `${sectionTitle('Commit title format')}`,
    `  ${colorize('[TB-123] ✨ feat: add feature', COLORS.green)}`,
  ];

  console.log(sections.join('\n'));
}

module.exports = {
  describeCategories,
  printHelp,
};


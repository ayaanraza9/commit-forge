const { stdin, stdout } = require('node:process');
const readline = require('node:readline');
const readlinePromises = require('node:readline/promises');
const { logInfo, logError, exitWithError } = require('./logger');
const { COLORS } = require('./constants');
const { colorize } = require('./utils');
const { ALLOWED_CATEGORIES, CATEGORY_META } = require('./constants');
const { validateJiraId, validateMessage, validateDescription } = require('./validators');
const { getConfig } = require('./config');

function ensureInteractiveTty() {
  if (!stdin.isTTY || !stdout.isTTY) {
    exitWithError('Interactive prompts require a TTY. Provide all fields via flags instead.');
  }
}

async function askUntilValid(rl, question, validator, transform = (value) => value) {
  while (true) {
    const promptLabel = `${COLORS.magenta}? ${COLORS.bold}${question}${COLORS.reset} `;
    const answer = await rl.question(promptLabel);
    const transformed = transform(answer);
    const error = validator(transformed);
    if (!error) {
      return transformed;
    }
    logError(error);
  }
}

function renderCategoryOption(key, isSelected) {
  const meta = CATEGORY_META[key];
  const pointer = isSelected ? colorize('❯', `${COLORS.bold}${COLORS.cyan}`) : colorize('•', COLORS.dim);
  const nameColor = isSelected ? `${COLORS.bold}${COLORS.cyan}` : COLORS.dim;
  const descriptionColor = isSelected ? COLORS.reset : COLORS.dim;
  const icon = colorize(meta.icon, nameColor);
  const name = colorize(key, nameColor);
  const description = colorize(meta.description, descriptionColor);
  const separator = colorize('–', COLORS.dim);
  return `${pointer} ${icon} ${name} ${separator} ${description}`;
}

async function promptCategorySelection(defaultCategory) {
  ensureInteractiveTty();

  const options = ALLOWED_CATEGORIES;
  let selectedIndex = options.indexOf(defaultCategory);
  if (selectedIndex < 0) {
    selectedIndex = 0;
  }

  let renderedLines = 0;
  let menuVisible = false;
  const supportsRawMode = stdin.isTTY && typeof stdin.setRawMode === 'function';
  const previousRawMode = supportsRawMode ? Boolean(stdin.isRaw) : false;

  const render = () => {
    const header = colorize('Select category (↑/↓ arrows, Enter to confirm):', `${COLORS.bold}${COLORS.cyan}`);
    const lines = [header, '', ...options.map((key, index) => renderCategoryOption(key, index === selectedIndex))];

    if (menuVisible) {
      readline.moveCursor(stdout, 0, -renderedLines);
      readline.clearScreenDown(stdout);
    }

    stdout.write(`${lines.join('\n')}\n`);
    renderedLines = lines.length;
    menuVisible = true;
  };

  const cleanup = ({ silent } = {}) => {
    if (supportsRawMode) {
      stdin.setRawMode(previousRawMode);
    }
    stdin.removeListener('keypress', onKeyPress);
    if (menuVisible) {
      readline.moveCursor(stdout, 0, -renderedLines);
      readline.clearScreenDown(stdout);
    }
    stdout.write('\u001b[?25h');
    if (!silent) {
      const key = options[selectedIndex];
      const meta = CATEGORY_META[key];
      logInfo(`Category: ${meta.icon} ${key} - ${meta.description}`);
    }
  };

  const onKeyPress = (_, key = {}) => {
    if (key.name === 'up') {
      selectedIndex = (selectedIndex - 1 + options.length) % options.length;
      render();
      return;
    }
    if (key.name === 'down') {
      selectedIndex = (selectedIndex + 1) % options.length;
      render();
      return;
    }
    if (key.name === 'return' || key.name === 'enter') {
      cleanup();
      resolveSelection(options[selectedIndex]);
      return;
    }
    if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
      cleanup({ silent: true });
      exitWithError('Category selection cancelled.');
    }
  };

  readline.emitKeypressEvents(stdin);
  if (supportsRawMode) {
    stdin.setRawMode(true);
  }
  stdout.write('\u001b[?25l');
  render();

  let resolveSelection = () => {};
  return new Promise((resolve) => {
    resolveSelection = resolve;
    stdin.on('keypress', onKeyPress);
  });
}

async function promptForMissingInputs(inputs) {
  ensureInteractiveTty();

  const answers = { ...inputs };
  if (!answers.category) {
    answers.category = await promptCategorySelection(inputs.category);
  }

  const rl = readlinePromises.createInterface({ input: stdin, output: stdout });
  const config = getConfig();

  try {
    // Only prompt for JIRA if it's enabled
    if (config.jira.enabled && !answers.jira) {
      const promptText = config.jira.required
        ? 'Enter JIRA ID (e.g., TB-123):'
        : config.jira.allowNoJira
        ? 'Enter JIRA ID (e.g., TB-123) or press Enter for NO-JIRA:'
        : 'Enter JIRA ID (e.g., TB-123):';
      
      answers.jira = await askUntilValid(
        rl,
        promptText,
        validateJiraId,
        (value) => {
          const cleaned = value.trim().toUpperCase();
          if (cleaned === '' && config.jira.allowNoJira) {
            return 'NO-JIRA';
          }
          return cleaned;
        },
      );
    }

    if (!answers.message) {
      const maxLength = config.subject.maxLength;
      answers.message = await askUntilValid(
        rl,
        `Enter short message (<= ${maxLength} chars): `,
        validateMessage,
        (value) => value.trim(),
      );
    }

    if (!answers.description) {
      const promptText = config.description.required
        ? 'Enter description (required, use \\n for new lines): '
        : 'Enter description (optional, use \\n for new lines): ';
      
      answers.description = await askUntilValid(
        rl,
        promptText,
        validateDescription,
        (value) => {
          const cleaned = value.replace(/\\n/g, '\n').trim();
          return cleaned === '' ? undefined : cleaned;
        },
      );
    }
  } finally {
    rl.close();
  }

  return answers;
}

module.exports = {
  ensureInteractiveTty,
  askUntilValid,
  promptCategorySelection,
  promptForMissingInputs,
};


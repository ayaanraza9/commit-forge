const { COLORS } = require('./constants');

const logInfo = (text) => console.log(`${COLORS.cyan}[commit-forge]${COLORS.reset} ${text}`);
const logSuccess = (text) => console.log(`${COLORS.green}[commit-forge]${COLORS.reset} ${text}`);
const logWarn = (text) => console.warn(`${COLORS.yellow}[commit-forge]${COLORS.reset} ${text}`);
const logError = (text) => console.error(`${COLORS.red}[commit-forge]${COLORS.reset} ${text}`);

function exitWithError(message) {
  logError(message);
  process.exit(1);
}

module.exports = {
  logInfo,
  logSuccess,
  logWarn,
  logError,
  exitWithError,
};


const { COLORS } = require('./constants');

const colorize = (text, color) => `${color}${text}${COLORS.reset}`;
const sectionTitle = (text) => colorize(text, `${COLORS.bold}${COLORS.magenta}`);

module.exports = {
  colorize,
  sectionTitle,
};


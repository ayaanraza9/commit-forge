// Main entry point for programmatic use

const { buildCommitMessage, buildSubject, formatCategory } = require('./formatter');
const { lintFromText } = require('./linter');
const { validateInputs, validateJiraId, validateCategory, validateMessage, validateDescription } = require('./validators');
const { normalizeInputs, gatherInputFromFlags } = require('./normalizer');
const { parseArgs } = require('./parser');
const { ensureStagedChanges, runGitCommit } = require('./git');
const { promptForMissingInputs, promptCategorySelection } = require('./prompts');

module.exports = {
	// Formatters
	buildCommitMessage,
	buildSubject,
	formatCategory,

	// Linting
	lintFromText,

	// Validators
	validateInputs,
	validateJiraId,
	validateCategory,
	validateMessage,
	validateDescription,

	// Input processing
	normalizeInputs,
	gatherInputFromFlags,
	parseArgs,

	// Git operations
	ensureStagedChanges,
	runGitCommit,

	// Prompts
	promptForMissingInputs,
	promptCategorySelection,

	// Constants (for reference)
	constants: require('./constants'),
};


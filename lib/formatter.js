const { CATEGORY_META } = require("./constants");
const { getConfig } = require("./config");

function formatCategory(category) {
	const config = getConfig();
	const meta = CATEGORY_META[category];

	if (!meta) {
		return category;
	}

	// If emojis are disabled, return just the category
	if (!config.emoji.enabled) {
		return category;
	}

	return `${meta.icon} ${category}`;
}

function buildSubject({ jira, category, message }) {
	const config = getConfig();
	const formattedCategory = formatCategory(category);
	const trimmedMessage = message.trim();

	// If JIRA is disabled, don't include it in the subject
	if (!config.jira.enabled) {
		return `${formattedCategory}: ${trimmedMessage}`;
	}

	// If JIRA is enabled but not provided and not required, don't include it
	if (!jira && !config.jira.required) {
		return `${formattedCategory}: ${trimmedMessage}`;
	}

	// Default: include JIRA in brackets
	return `[${jira || "NO-JIRA"}] ${formattedCategory}: ${trimmedMessage}`;
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

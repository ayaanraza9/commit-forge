const { ALLOWED_CATEGORIES } = require("./constants");
const { getConfig } = require("./config");

function validateJiraId(jiraId) {
	const config = getConfig();

	// If JIRA is disabled, skip validation
	if (!config.jira.enabled) {
		return null;
	}

	// If JIRA is not required and not provided, it's okay
	if (!config.jira.required && !jiraId) {
		return null;
	}

	// If JIRA is required but not provided
	if (config.jira.required && !jiraId) {
		return "Missing JIRA id. Provide via --jira.";
	}

	// Allow NO-JIRA if configured
	if (jiraId === "NO-JIRA") {
		if (!config.jira.allowNoJira) {
			return "NO-JIRA is not allowed. Please provide a valid JIRA id.";
		}
		return null;
	}

	if (!/^[A-Z]+-\d+$/.test(jiraId)) {
		return `Invalid JIRA id "${jiraId}". Use format ABC-123.`;
	}

	return null;
}

function validateCategory(category) {
	if (!category) {
		return "Missing category. Provide via --category.";
	}

	if (!ALLOWED_CATEGORIES.includes(category)) {
		return `Invalid category "${category}". Allowed: ${ALLOWED_CATEGORIES.join(
			", "
		)}.`;
	}

	return null;
}

function validateMessage(message) {
	const config = getConfig();

	if (!message || !message.trim()) {
		return "Missing commit message subject. Provide via --message.";
	}

	const maxLength = config.subject.maxLength;
	if (message.length > maxLength) {
		return `Subject line should be <= ${maxLength} characters.`;
	}

	return null;
}

function validateDescription(description) {
	const config = getConfig();

	// If description is required but not provided
	if (
		config.description.required &&
		(description === undefined || !description || !description.trim())
	) {
		return "Description is required. Provide via --description.";
	}

	if (description === undefined) {
		return null;
	}

	if (!description.trim()) {
		return "Description must include non-whitespace characters or be omitted.";
	}

	return null;
}

function validateInputs(inputs) {
	const config = getConfig();
	const errors = [];

	// Only validate JIRA if it's enabled
	if (config.jira.enabled) {
		const jiraError = validateJiraId(inputs.jira);
		if (jiraError) errors.push(jiraError);
	}

	errors.push(
		validateCategory(inputs.category),
		validateMessage(inputs.message),
		validateDescription(inputs.description)
	);

	return errors.filter(Boolean);
}

function ensureValidInputs(inputs) {
	const { exitWithError } = require("./logger");
	const errors = validateInputs(inputs);
	if (errors.length > 0) {
		exitWithError(errors.join("\n"));
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

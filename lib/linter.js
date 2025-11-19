const fs = require("node:fs");
const path = require("node:path");
const { exitWithError } = require("./logger");
const {
	validateJiraId,
	validateCategory,
	validateMessage,
} = require("./validators");
const { getConfig } = require("./config");

function parseCategoryFromDisplay(display) {
	if (!display) {
		return display;
	}
	const parts = display.trim().split(/\s+/);
	const candidate = parts[parts.length - 1];
	return candidate;
}

function lintFromText(text) {
	const config = getConfig();
	const problems = [];
	const lines = text.replace(/\r\n/g, "\n").split("\n");

	if (lines.length === 0 || !lines[0].trim()) {
		problems.push("Commit message is empty.");
		return { ok: false, problems };
	}

	const firstLine = lines[0];
	let match;
	let jira = null;
	let categoryPart;
	let subject;

	// Build regex pattern based on config
	if (config.jira.enabled) {
		// Pattern with JIRA: "[TB-123] ✨ feat: summary" or "[NO-JIRA] feat: summary"
		match = firstLine.match(
			/^\[(?<jira>NO-JIRA|[A-Z]+-\d+)] (?<categoryPart>[^:]+): (?<subject>.+)$/
		);
		if (match) {
			({ jira, categoryPart, subject } = match.groups);
		} else {
			// Try pattern without JIRA but with brackets (might be optional)
			if (!config.jira.required) {
				match = firstLine.match(/^(?<categoryPart>[^:]+): (?<subject>.+)$/);
				if (match) {
					({ categoryPart, subject } = match.groups);
				}
			}
		}
	} else {
		// Pattern without JIRA: "✨ feat: summary" or "feat: summary"
		match = firstLine.match(/^(?<categoryPart>[^:]+): (?<subject>.+)$/);
		if (match) {
			({ categoryPart, subject } = match.groups);
		}
	}

	if (!match) {
		const example = config.jira.enabled
			? config.emoji.enabled
				? '"[TB-123] ✨ feat: summary"'
				: '"[TB-123] feat: summary"'
			: config.emoji.enabled
			? '"✨ feat: summary"'
			: '"feat: summary"';
		problems.push(`First line must look like ${example}.`);
		return { ok: false, problems };
	}

	const normalizedCategory = parseCategoryFromDisplay(categoryPart);

	// Only validate JIRA if it's enabled and present
	if (config.jira.enabled && jira !== null) {
		const jiraError = validateJiraId(jira);
		if (jiraError) {
			problems.push(jiraError);
		}
	} else if (config.jira.enabled && config.jira.required && jira === null) {
		problems.push("JIRA id is required but missing.");
	}

	const catError = validateCategory(normalizedCategory);
	if (catError) {
		problems.push(catError);
	}

	const subjectError = validateMessage(subject);
	if (subjectError) {
		problems.push(subjectError);
	}

	let body = "";
	if (typeof lines[1] === "undefined") {
		// No body provided; acceptable
	} else if (lines[1].trim() !== "") {
		problems.push(
			"Include a blank line between subject and body when providing a description."
		);
		body = lines.slice(1).join("\n").trim();
	} else {
		body = lines.slice(2).join("\n").trim();
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
		return fs.readFileSync(resolved, "utf8");
	}

	try {
		if (!process.stdin.isTTY) {
			return fs.readFileSync(0, "utf8");
		}
	} catch (error) {
		// Ignore and fall through to empty string.
	}

	exitWithError(
		"No commit message input provided. Pass a file path or pipe content via stdin."
	);
	return "";
}

module.exports = {
	parseCategoryFromDisplay,
	lintFromText,
	readCommitText,
};

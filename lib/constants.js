const COLORS = {
	reset: "\u001b[0m",
	bold: "\u001b[1m",
	dim: "\u001b[2m",
	red: "\u001b[31m",
	green: "\u001b[32m",
	yellow: "\u001b[33m",
	blue: "\u001b[34m",
	magenta: "\u001b[35m",
	cyan: "\u001b[36m",
};

const CATEGORY_META = {
	feat: { description: "New feature", icon: "✨" },
	fix: { description: "Bug fix", icon: "🐛" },
	docs: { description: "Documentation change", icon: "📝" },
	style: { description: "Code style / formatting", icon: "🎨" },
	refactor: { description: "Refactoring", icon: "♻️" },
	perf: { description: "Performance improvement", icon: "⚡" },
	test: { description: "Tests", icon: "✅" },
	chore: { description: "Chores & maintenance", icon: "🧹" },
};

const ALLOWED_CATEGORIES = Object.keys(CATEGORY_META);

const aliasMap = {
	j: "jira",
	jiraId: "jira",
	jira: "jira",
	c: "category",
	cat: "category",
	category: "category",
	m: "message",
	msg: "message",
	message: "message",
	d: "description",
	desc: "description",
	description: "description",
	f: "file",
	file: "file",
	o: "output",
	out: "output",
	output: "output",
	json: "json",
};

module.exports = {
	COLORS,
	CATEGORY_META,
	ALLOWED_CATEGORIES,
	aliasMap,
};

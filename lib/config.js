const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_CONFIG = {
	jira: {
		enabled: true,
		required: true,
		allowNoJira: true, // Allow "NO-JIRA" as a value
	},
	emoji: {
		enabled: true, // Show emojis in category formatting
	},
	subject: {
		maxLength: 72,
	},
	description: {
		required: false,
	},
};

const CONFIG_FILE_NAMES = [
	".commit-forge.json",
	"commit-forge.config.json",
	".commit-forge.ts",
	"commit-forge.config.ts",
	".commit-forge.js",
	"commit-forge.config.js",
];

function findConfigFile() {
	const cwd = process.cwd();

	for (const fileName of CONFIG_FILE_NAMES) {
		const filePath = path.join(cwd, fileName);
		if (fs.existsSync(filePath)) {
			return filePath;
		}
	}

	// Also check parent directories up to 3 levels
	let currentDir = cwd;
	for (let i = 0; i < 3; i++) {
		currentDir = path.dirname(currentDir);
		for (const fileName of CONFIG_FILE_NAMES) {
			const filePath = path.join(currentDir, fileName);
			if (fs.existsSync(filePath)) {
				return filePath;
			}
		}
	}

	return null;
}

function loadTypeScriptFile(filePath) {
	// Try to use ts-node if available
	try {
		const tsNode = require("ts-node");
		// Register ts-node (it's safe to call multiple times)
		tsNode.register({
			transpileOnly: true,
			compilerOptions: {
				module: "commonjs",
			},
		});
		delete require.cache[require.resolve(filePath)];
		const config = require(filePath);
		return typeof config === "function" ? config() : config;
	} catch (error) {
		// Try tsx as an alternative
		try {
			// tsx can be loaded in different ways depending on version
			try {
				const { register } = require("tsx/esm/api");
				register();
			} catch {
				// Try alternative tsx import
				const tsx = require("tsx");
				if (typeof tsx.register === "function") {
					tsx.register();
				}
			}
			delete require.cache[require.resolve(filePath)];
			const config = require(filePath);
			return typeof config === "function" ? config() : config;
		} catch (tsxError) {
			// Try esbuild-register
			try {
				const esbuildRegister = require("esbuild-register/dist/node");
				esbuildRegister.register({
					target: "node14",
				});
				delete require.cache[require.resolve(filePath)];
				const config = require(filePath);
				return typeof config === "function" ? config() : config;
			} catch (esbuildError) {
				// If none of the TypeScript loaders are available, throw an error
				throw new Error(
					"TypeScript config files require one of: ts-node, tsx, or esbuild-register. " +
						"Install one of these packages to use TypeScript config files."
				);
			}
		}
	}
}

function loadConfigFile(filePath) {
	const ext = path.extname(filePath);

	if (ext === ".json") {
		const content = fs.readFileSync(filePath, "utf8");
		return JSON.parse(content);
	}

	if (ext === ".js") {
		// For JS files, require them (they should export the config)
		delete require.cache[require.resolve(filePath)];
		const config = require(filePath);
		return typeof config === "function" ? config() : config;
	}

	if (ext === ".ts") {
		// For TypeScript files, try to load with TypeScript support
		return loadTypeScriptFile(filePath);
	}

	return null;
}

function mergeConfig(userConfig, defaultConfig) {
	const merged = { ...defaultConfig };

	// Deep merge
	for (const key in userConfig) {
		if (
			userConfig[key] &&
			typeof userConfig[key] === "object" &&
			!Array.isArray(userConfig[key])
		) {
			merged[key] = { ...defaultConfig[key], ...userConfig[key] };
		} else {
			merged[key] = userConfig[key];
		}
	}

	return merged;
}

function validateConfig(config) {
	const errors = [];

	// Validate jira config
	if (config.jira) {
		if (
			typeof config.jira.enabled !== "undefined" &&
			typeof config.jira.enabled !== "boolean"
		) {
			errors.push("config.jira.enabled must be a boolean");
		}
		if (
			typeof config.jira.required !== "undefined" &&
			typeof config.jira.required !== "boolean"
		) {
			errors.push("config.jira.required must be a boolean");
		}
		if (
			typeof config.jira.allowNoJira !== "undefined" &&
			typeof config.jira.allowNoJira !== "boolean"
		) {
			errors.push("config.jira.allowNoJira must be a boolean");
		}
	}

	// Validate emoji config
	if (
		config.emoji &&
		typeof config.emoji.enabled !== "undefined" &&
		typeof config.emoji.enabled !== "boolean"
	) {
		errors.push("config.emoji.enabled must be a boolean");
	}

	// Validate subject config
	if (config.subject) {
		if (
			typeof config.subject.maxLength !== "undefined" &&
			(typeof config.subject.maxLength !== "number" ||
				config.subject.maxLength < 1)
		) {
			errors.push("config.subject.maxLength must be a positive number");
		}
	}

	// Validate description config
	if (
		config.description &&
		typeof config.description.required !== "undefined" &&
		typeof config.description.required !== "boolean"
	) {
		errors.push("config.description.required must be a boolean");
	}

	return errors;
}

let cachedConfig = null;

function getConfig() {
	if (cachedConfig !== null) {
		return cachedConfig;
	}

	const configFile = findConfigFile();

	if (!configFile) {
		cachedConfig = DEFAULT_CONFIG;
		return cachedConfig;
	}

	try {
		const userConfig = loadConfigFile(configFile);
		const merged = mergeConfig(userConfig, DEFAULT_CONFIG);
		const errors = validateConfig(merged);

		if (errors.length > 0) {
			const { logWarn } = require("./logger");
			logWarn(
				`Configuration file has errors: ${errors.join(", ")}. Using defaults.`
			);
			cachedConfig = DEFAULT_CONFIG;
			return cachedConfig;
		}

		cachedConfig = merged;
		return cachedConfig;
	} catch (error) {
		const { logWarn } = require("./logger");
		logWarn(
			`Failed to load config file "${configFile}": ${error.message}. Using defaults.`
		);
		cachedConfig = DEFAULT_CONFIG;
		return cachedConfig;
	}
}

function resetConfigCache() {
	cachedConfig = null;
}

module.exports = {
	getConfig,
	DEFAULT_CONFIG,
	findConfigFile,
	resetConfigCache,
};

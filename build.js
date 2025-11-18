#!/usr/bin/env bun

import { build } from "bun";
import { writeFileSync, readFileSync } from "fs";

const result = await build({
	entrypoints: ["bin/cli.js"],
	outdir: "dist",
	minify: true,
	target: "node",
	format: "cjs",
});

if (result.success) {
	console.log("✓ Build successful");

	// Read the built file and ensure it has exactly one shebang
	let builtFile = readFileSync("dist/cli.js", "utf8");

	// Remove any existing shebangs
	builtFile = builtFile.replace(/^#!.*\n/g, "");

	// Prepend shebang
	const withShebang = "#!/usr/bin/env node\n" + builtFile;
	writeFileSync("dist/cli.js", withShebang);

	// Make the file executable
	await Bun.spawn(["chmod", "+x", "dist/cli.js"]).exited;
	console.log("✓ Minified bundle created at dist/cli.js");
	console.log("✓ Made dist/cli.js executable");
} else {
	console.error("✗ Build failed");
	process.exit(1);
}

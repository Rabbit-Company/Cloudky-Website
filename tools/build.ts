import { $ } from "bun";
import { Glob } from "bun";
import Logger from "@rabbit-company/logger";
import fs from "node:fs/promises";

Logger.info("Build started");

Logger.info("Start bulding TailwindCSS...");
await $`bunx tailwindcss -i ./tailwind.css -o ./website/css/tailwind.min.css --minify`.quiet();
Logger.info("Bulding TailwindCSS complete");

await fs.rm("./dist", { recursive: true });
Logger.info('"dist" folder has been removed');

Logger.info("Start bulding JS files...");
let scripts = [];
const typeScriptGlob = new Glob("**.ts");
for await (const file of typeScriptGlob.scan({ cwd: "./website/js/pages" })) {
	scripts.push(`./website/js/pages/${file}`);
}

let scriptBuild = await Bun.build({
	entrypoints: scripts,
	outdir: "./dist/js/pages",
	target: "browser",
	minify: true,
	plugins: [],
});
if (scriptBuild.success) {
	Logger.info("Bulding JS files complete");
} else {
	Logger.error("Bulding JS files failed");
	console.log(scriptBuild.logs);
}

let copyFiles = ["html", "css", "js", "wasm", "json", "png", "svg"];
copyFiles.forEach(async (file) => {
	Logger.info(`Start copying ${file.toUpperCase()} files...`);
	const glob = new Glob(`**/**.${file}`);
	for await (const file of glob.scan({ cwd: "./website" })) {
		await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./website/${file}`));
	}
	Logger.info(`Copying ${file.toUpperCase()} files complete`);
});

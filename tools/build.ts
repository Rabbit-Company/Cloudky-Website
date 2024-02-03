import { $ } from "bun";
import { Glob } from "bun";
import Logger from "@rabbit-company/logger";
import fs from "node:fs/promises";

Logger.info('Build started');

await $`bunx tailwindcss -i ./tailwind.css -o ./website/css/tailwind.min.css --minify`.quiet();
Logger.info('TailwindCSS has been built');

await fs.rm('./out', {recursive: true});
Logger.info('"out" folder has been removed');

let scripts = [];

const scriptsGlob = new Glob("**.ts");
for await (const file of scriptsGlob.scan({cwd: "./website/js"})) {
  scripts.push(`./website/js/${file}`);
}

await Bun.build({
  entrypoints: scripts,
  outdir: "./out/js",
	target: 'browser',
	sourcemap: "external",
	splitting: true,
  minify: true,
  plugins: [],
});
Logger.info('Bundler has bundled JS files');
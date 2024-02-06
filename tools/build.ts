import { $ } from "bun";
import { Glob } from "bun";
import Logger from "@rabbit-company/logger";
import fs from "node:fs/promises";

Logger.info('Build started');

Logger.info('Start bulding TailwindCSS...');
await $`bunx tailwindcss -i ./tailwind.css -o ./website/css/tailwind.min.css --minify`.quiet();
Logger.info('Bulding TailwindCSS complete');

await fs.rm('./out', {recursive: true});
Logger.info('"out" folder has been removed');

Logger.info('Start bulding JS files...');
let scripts = [];
const scriptsGlob = new Glob("**.ts");
for await (const file of scriptsGlob.scan({cwd: "./website/js"})) {
  scripts.push(`./website/js/${file}`);
}

let scriptBuild = await Bun.build({
  entrypoints: scripts,
  outdir: "./out/js",
	target: 'browser',
  minify: true,
  plugins: [],
});
if(scriptBuild.success){
	Logger.info('Bulding JS files complete');
}else{
	Logger.error('Bulding JS files failed');
}

Logger.info('Start copying HTML files...');
const htmlsGlob = new Glob("**/**.html");
for await (const file of htmlsGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./out/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying HTML files complete');

Logger.info('Start copying CSS files...');
const cssGlob = new Glob("**/**.css");
for await (const file of cssGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./out/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying CSS files complete');
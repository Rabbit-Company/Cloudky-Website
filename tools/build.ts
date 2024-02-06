import { $ } from "bun";
import { Glob } from "bun";
import Logger from "@rabbit-company/logger";
import fs from "node:fs/promises";

Logger.info('Build started');

Logger.info('Start bulding TailwindCSS...');
await $`bunx tailwindcss -i ./tailwind.css -o ./website/css/tailwind.min.css --minify`.quiet();
Logger.info('Bulding TailwindCSS complete');

await fs.rm('./dist', {recursive: true});
Logger.info('"dist" folder has been removed');

Logger.info('Start bulding JS files...');
let scripts = [];
const typeScriptGlob = new Glob("**.ts");
for await (const file of typeScriptGlob.scan({cwd: "./website/js"})) {
  scripts.push(`./website/js/${file}`);
}

let scriptBuild = await Bun.build({
  entrypoints: scripts,
  outdir: "./dist/js",
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
const htmlGlob = new Glob("**/**.html");
for await (const file of htmlGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying HTML files complete');

Logger.info('Start copying CSS files...');
const cssGlob = new Glob("**/**.css");
for await (const file of cssGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying CSS files complete');

Logger.info('Start copying JS files...');
const scriptGlob = new Glob("**/**.js");
for await (const file of scriptGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying JS files complete');

Logger.info('Start copying WASM files...');
const wasmGlob = new Glob("**/**.wasm");
for await (const file of wasmGlob.scan({cwd: "./website"})) {
	await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./website/${file}`));
}
Logger.info('Copying WASM files complete');
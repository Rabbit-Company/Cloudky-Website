import { Glob } from "bun";

let scripts = [];

const glob = new Glob("**.ts");
for await (const file of glob.scan({cwd: "./website/js"})) {
  scripts.push(`./website/js/${file}`);
}

await Bun.build({
  entrypoints: scripts,
  outdir: "./out/js",
  minify: true,
  plugins: [],
});
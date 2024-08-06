import Logger from "@rabbit-company/logger";

Logger.info("---------------------------");
Logger.info("Server started on port 8087");
Logger.info("---------------------------");

Bun.serve({
	port: 8087,
	async fetch(req) {
		try {
			let path = new URL(req.url).pathname;
			if (path === "/") path = "/index.html";
			const filePath = "./dist" + path;
			const file = Bun.file(filePath);
			return new Response(file);
		} catch (err) {
			return new Response(null, { status: 404 });
		}
	},
	error() {
		return new Response(null, { status: 404 });
	},
});

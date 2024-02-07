import Logger from "@rabbit-company/logger";

Logger.info('---------------------------');
Logger.info('Server started on port 8086');
Logger.info('---------------------------');

Bun.serve({
	port: 8086,
	async fetch(req) {
		try{
			const filePath = './dist' + new URL(req.url).pathname;
			const file = Bun.file(filePath);
			return new Response(file);
		}catch(err){
			return new Response(null, { status: 404 });
		}
	},
  error() {
    return new Response(null, { status: 404 });
  },
});
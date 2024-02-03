Bun.serve({
	port: 8086,
	async fetch(req) {
		try{
			const filePath = './website' + new URL(req.url).pathname;
			const file = Bun.file(filePath);
			return new Response(file);
		}catch(err){
			console.log(err);
			return new Response(null, { status: 404 });
		}
	},
  error() {
    return new Response(null, { status: 404 });
  },
});
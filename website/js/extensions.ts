interface ExtensionConfig {
	icon: string;
	color: string;
}

interface Extensions {
	[key: string]: ExtensionConfig;
}

export const extensions: Extensions = {
	// Images
	png: {
		icon: "photo",
		color: "lightBlue",
	},
	svg: {
		icon: "file-type-svg",
		color: "lightBlue",
	},
	gif: {
		icon: "gif",
		color: "yellow",
	},
	jpg: {
		icon: "photo",
		color: "lightRed",
	},
	jpeg: {
		icon: "photo",
		color: "lightRed",
	},
	heic: {
		icon: "photo",
		color: "lightRed",
	},
	heif: {
		icon: "photo",
		color: "lightRed",
	},
	bmp: {
		icon: "file-type-bmp",
		color: "lightRed",
	},
	webp: {
		icon: "photo",
		color: "lightRed",
	},
	ico: {
		icon: "photo",
		color: "lightRed",
	},
	tiff: {
		icon: "photo",
		color: "lightRed",
	},
	raw: {
		icon: "camera-plus",
		color: "lightGrey",
	},
	dng: {
		icon: "camera-plus",
		color: "lightGrey",
	},
	// Videos
	mp4: {
		icon: "movie",
		color: "green",
	},
	mov: {
		icon: "movie",
		color: "green",
	},
	mkv: {
		icon: "movie",
		color: "green",
	},
	avi: {
		icon: "movie",
		color: "green",
	},
	wmv: {
		icon: "movie",
		color: "green",
	},
	flv: {
		icon: "movie",
		color: "green",
	},
	webm: {
		icon: "movie",
		color: "green",
	},
	// Documents
	pdf: {
		icon: "file-type-pdf",
		color: "red",
	},
	epub: {
		icon: "book-2",
		color: "yellow",
	},
	mobi: {
		icon: "book-2",
		color: "yellow",
	},
	azw: {
		icon: "book-2",
		color: "yellow",
	},
	doc: {
		icon: "file-type-doc",
		color: "blue",
	},
	docx: {
		icon: "file-type-docx",
		color: "blue",
	},
	xls: {
		icon: "file-spreadsheet",
		color: "green",
	},
	xlsx: {
		icon: "file-spreadsheet",
		color: "green",
	},
	ppt: {
		icon: "file-chart",
		color: "red",
	},
	pptx: {
		icon: "file-chart",
		color: "red",
	},
	vsd: {
		icon: "file-analytics",
		color: "darkBlue",
	},
	vsdx: {
		icon: "file-analytics",
		color: "darkBlue",
	},
	pub: {
		icon: "file-vector",
		color: "cyan",
	},
	odt: {
		icon: "file-description",
		color: "blue",
	},
	ods: {
		icon: "file-type-spreadsheet",
		color: "green",
	},
	odp: {
		icon: "file-chart",
		color: "red",
	},
	odg: {
		icon: "file-analytics",
		color: "yellow",
	},
	rtf: {
		icon: "file-description",
		color: "lightBlue",
	},
	pages: {
		icon: "file-description",
		color: "orange",
	},
	// Music
	mp3: {
		icon: "file-music",
		color: "orange",
	},
	wav: {
		icon: "headphones",
		color: "deepPink",
	},
	flac: {
		icon: "headphones",
		color: "deepPink",
	},
	alac: {
		icon: "headphones",
		color: "deepPink",
	},
	dsd: {
		icon: "headphones",
		color: "deepPink",
	},
	ogg: {
		icon: "file-music",
		color: "orange",
	},
	aac: {
		icon: "file-music",
		color: "orange",
	},
	m4a: {
		icon: "file-music",
		color: "orange",
	},
	wma: {
		icon: "file-music",
		color: "orange",
	},
	aiff: {
		icon: "file-music",
		color: "orange",
	},
	// Archives
	zip: {
		icon: "file-zip",
		color: "purple",
	},
	"7z": {
		icon: "file-zip",
		color: "purple",
	},
	rar: {
		icon: "file-zip",
		color: "purple",
	},
	zipx: {
		icon: "file-zip",
		color: "purple",
	},
	tar: {
		icon: "file-zip",
		color: "purple",
	},
	gz: {
		icon: "file-zip",
		color: "purple",
	},
	xz: {
		icon: "file-zip",
		color: "purple",
	},
	"tar.gz": {
		icon: "file-zip",
		color: "purple",
	},
	"tar.xz": {
		icon: "file-zip",
		color: "purple",
	},
	cab: {
		icon: "file-zip",
		color: "purple",
	},
	lzh: {
		icon: "file-zip",
		color: "purple",
	},
	bz2: {
		icon: "file-zip",
		color: "purple",
	},
	// Code
	js: {
		icon: "file-type-js",
		color: "yellow",
	},
	css: {
		icon: "file-type-css",
		color: "blue",
	},
	html: {
		icon: "file-type-html",
		color: "orange",
	},
	php: {
		icon: "file-type-php",
		color: "lightBlue",
	},
	ts: {
		icon: "file-code",
		color: "blue",
	},
	py: {
		icon: "file-code",
		color: "yellow",
	},
	java: {
		icon: "file-code",
		color: "red",
	},
	c: {
		icon: "file-code",
		color: "lightBlue",
	},
	cpp: {
		icon: "file-code",
		color: "blue",
	},
	cs: {
		icon: "file-code",
		color: "purple",
	},
	rs: {
		icon: "file-code",
		color: "orange",
	},
	go: {
		icon: "file-code",
		color: "turquoise",
	},
	r: {
		icon: "file-code",
		color: "lightBlue",
	},
	ruby: {
		icon: "file-code",
		color: "red",
	},
	swift: {
		icon: "file-code",
		color: "orange",
	},
	dart: {
		icon: "file-code",
		color: "blue",
	},
	kotlin: {
		icon: "file-code",
		color: "purple",
	},
	// Text
	txt: {
		icon: "file-pencil",
		color: "grey",
	},
	ini: {
		icon: "file-pencil",
		color: "grey",
	},
	json: {
		icon: "file-pencil",
		color: "grey",
	},
	xml: {
		icon: "file-pencil",
		color: "grey",
	},
	yaml: {
		icon: "file-pencil",
		color: "grey",
	},
	toml: {
		icon: "file-pencil",
		color: "grey",
	},
	properties: {
		icon: "file-pencil",
		color: "grey",
	},
	cfg: {
		icon: "file-pencil",
		color: "grey",
	},
	conf: {
		icon: "file-pencil",
		color: "grey",
	},
	csv: {
		icon: "file-pencil",
		color: "grey",
	},
	tsv: {
		icon: "file-pencil",
		color: "grey",
	},
	db: {
		icon: "file-pencil",
		color: "grey",
	},
	sql: {
		icon: "file-pencil",
		color: "grey",
	},
	sqlite: {
		icon: "file-pencil",
		color: "grey",
	},
	sqlite3: {
		icon: "file-pencil",
		color: "grey",
	},
	mdb: {
		icon: "file-pencil",
		color: "grey",
	},
	mdbx: {
		icon: "file-pencil",
		color: "grey",
	},
	// 3D Modeling
	obj: {
		icon: "file-3d",
		color: "orange",
	},
	fbx: {
		icon: "file-3d",
		color: "orange",
	},
	stl: {
		icon: "file-3d",
		color: "orange",
	},
	dae: {
		icon: "file-3d",
		color: "orange",
	},
	x3d: {
		icon: "file-3d",
		color: "orange",
	},
	ply: {
		icon: "file-3d",
		color: "orange",
	},
	"3ds": {
		icon: "file-3d",
		color: "orange",
	},
	max: {
		icon: "file-3d",
		color: "orange",
	},
	blend: {
		icon: "file-3d",
		color: "orange",
	},
	gltf: {
		icon: "file-3d",
		color: "orange",
	},
	// Adobe
	psd: {
		icon: "brand-adobe",
		color: "blue",
	},
	ai: {
		icon: "brand-adobe",
		color: "orange",
	},
	indd: {
		icon: "brand-adobe",
		color: "pink",
	},
	idml: {
		icon: "brand-adobe",
		color: "pink",
	},
	prproj: {
		icon: "brand-adobe",
		color: "purple",
	},
	aep: {
		icon: "brand-adobe",
		color: "purple",
	},
	aet: {
		icon: "brand-adobe",
		color: "pueple",
	},
	// Other
	exe: {
		icon: "file-digit",
		color: "darkBlue",
	},
	dll: {
		icon: "file-digit",
		color: "darkBlue",
	},
	msi: {
		icon: "file-digit",
		color: "darkBlue",
	},
	iso: {
		icon: "disc",
		color: "darkGrey",
	},
	img: {
		icon: "disc",
		color: "darkGrey",
	},
	dmg: {
		icon: "disc",
		color: "darkGrey",
	},
	so: {
		icon: "library",
		color: "darkBlue",
	},
	ttf: {
		icon: "letter-case",
		color: "darkGrey",
	},
	otf: {
		icon: "letter-case",
		color: "darkGrey",
	},
	ps: {
		icon: "letter-case",
		color: "darkGrey",
	},
	eot: {
		icon: "letter-case",
		color: "darkGrey",
	},
	woff: {
		icon: "letter-case",
		color: "darkGrey",
	},
	woff2: {
		icon: "letter-case",
		color: "darkGrey",
	},
};

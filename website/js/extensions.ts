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
		color: "text-red-600",
	},
	jpg: {
		icon: "photo",
		color: "text-red-600",
	},
	jpeg: {
		icon: "photo",
		color: "text-red-600",
	},
	// Music
	mp3: {
		icon: "file-music",
		color: "secondaryColor",
	},
	// Compressions
	zip: {
		icon: "file-zip",
		color: "secondaryColor",
	},
	// Databases
	sql: {
		icon: "file-database",
		color: "secondaryColor",
	},
	// Others
};

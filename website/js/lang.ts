import Logger from "@rabbit-company/logger";

const languageList = ['af', 'ar', 'bs', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es-ES', 'fa', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sl', 'sr', 'sv-SE', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'];

interface Translations {
	[key: string]: string;
}

interface TranslationsCache {
	[lang: string]: Translations;
}

let translationsCache: TranslationsCache = {};

export function detectLanguage(): string{
	let lang = 'en';
	for(const language of navigator.languages){
		if(languageList.includes(language)){
			lang = language;
			break;
		}
	}
	return lang;
}

export function getLang(): string{
	let lang = localStorage.getItem('lang');
	if(lang === null || !languageList.includes(lang)) lang = detectLanguage();
	return lang;
}

export async function loadTranslations(lang: string) {
	if (!translationsCache[lang]) {
		try{
			const response = await fetch(`/lang/${lang}/lang.json`);
			const data = await response.json();
			translationsCache[lang] = data;
		}catch(err) {
			Logger.error(`Loading translations for ${lang} language`);
		}
	}
}

export async function getText(key: string): Promise<string> {
	const selectedLang = getLang();

	await loadTranslations(selectedLang);
	const translation = translationsCache[selectedLang]?.[key] || key;

	return translation;
}
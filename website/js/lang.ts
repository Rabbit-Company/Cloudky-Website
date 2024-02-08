export const languageList = ['af', 'ar', 'bs', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es-ES', 'fa', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sl', 'sr', 'sv-SE', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'];

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
	if(lang === null || !languageList.includes(lang)) lang = 'en';
	return lang;
}

export function getText(){

}
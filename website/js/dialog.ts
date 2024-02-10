import Logger from "@rabbit-company/logger";
import { getIcon } from "./icons";
import { getText } from "./lang";
import { copyToClipboard, hide, hideDialogButtons, setText, showDialogButtons } from "./utils";

export enum DialogType {
	ERROR = 'Errror',
	SUCCESS = 'Success',
	LOADING = 'Loading',
	DEBUG = 'Debug'
}

function getIconClassName(bgColorClass: string){
	return `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${bgColorClass} sm:mx-0 sm:h-10 sm:w-10`;
}

function getButtonClassName(buttonColorClass: string){
	return `${buttonColorClass} inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm`;
}

export async function changeDialog(dialogType: DialogType, text: string){
	const dialogIconElement = document.getElementById('dialog-icon');
	const dialogTitleElement = document.getElementById('dialog-title');
	const dialogTextElement = document.getElementById('dialog-text');
	const dialogButtonElement = document.getElementById('dialog-button');
	const dialogButtonCancelElement = document.getElementById('dialog-button-cancel');

	if(!dialogIconElement || !dialogTitleElement || !dialogTextElement || !dialogButtonElement || !dialogButtonCancelElement){
		Logger.error('Dialog is not correctly formated on this page');
		return;
	}

	if(dialogType === DialogType.ERROR){
		dialogIconElement.className = getIconClassName('bg-red-100');
		dialogIconElement.innerHTML = getIcon('alert-triangle', 'text-red-600', 6);

		dialogTitleElement.innerText = await getText('error');
		dialogTextElement.innerText = text;

		dialogButtonCancelElement.style.display = 'none';

		dialogButtonElement.className = getButtonClassName('dangerButton');
		dialogButtonElement.innerText = await getText('okay');
		dialogButtonElement.onclick = () => hide("dialog");
	}else if(dialogType === DialogType.SUCCESS){
		dialogIconElement.className = getIconClassName('bg-green-100');
		dialogIconElement.innerHTML = getIcon('check', 'text-green-600', 6);

		dialogTitleElement.innerText = await getText('success');
		dialogTextElement.innerText = text;

		dialogButtonCancelElement.style.display = 'none';

		dialogButtonElement.className = getButtonClassName('successButton');
		dialogButtonElement.innerText = await getText('okay');
		dialogButtonElement.onclick = () => window.location.href = 'index.html';
	}else if(dialogType === DialogType.LOADING){
		dialogIconElement.className = getIconClassName('bg-blue-100 animate-spin');
		dialogIconElement.innerHTML = getIcon('loader-2', 'text-blue-600', 6);

		dialogTitleElement.innerText = await getText('please_wait');
		dialogTextElement.innerText = await getText(text);

		hideDialogButtons();
	}else if(dialogType === DialogType.DEBUG){
		dialogIconElement.className = getIconClassName('bg-blue-100');
		dialogIconElement.innerHTML = getIcon('first-aid-kit', 'text-blue-600 animate-bounce', 6);

		dialogTitleElement.innerText = 'Debug';
		dialogTextElement.innerText = text;

		dialogButtonCancelElement.style.display = 'initial';
		dialogButtonCancelElement.onclick = () => hide("dialog");

		dialogButtonElement.className = getButtonClassName('primaryButton');
		dialogButtonElement.innerText = await getText('copy');
		dialogButtonElement.onclick = () => {
			copyToClipboard(text);
			hide('dialog');
		}
		showDialogButtons();
	}

}
import Logger from "@rabbit-company/logger";

export function fhide(id: string): void{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.display = 'none';
}

export function fshow(id: string, method: string = "block"): void{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.display = method;
}

export function hide(id: string): void{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.visibility = 'hidden';
}

export function show(id: string): void{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.visibility = 'visible';
}

export function isHidden(id: string): boolean | undefined{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.visibility == 'hidden');
}

export function isfHidden(id: string): boolean | undefined{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.display == 'none');
}

export function setText(id: string, text: string): void{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.innerText = text;
}

export function showDialogButtons(): void{
	let button1 = document.getElementById('dialog-button');
	let button2 = document.getElementById('dialog-button-cancel');

	if(!button1){
		Logger.error(`Element with ID dialog-button not found!`);
		return;
	}

	if(!button2){
		Logger.error(`Element with ID dialog-button-cancel not found!`);
		return;
	}

	button1.style.display = "";
	button2.style.display = "";
}

export function hideDialogButtons(): void{
	let button1 = document.getElementById('dialog-button');
	let button2 = document.getElementById('dialog-button-cancel');

	if(!button1){
		Logger.error(`Element with ID dialog-button not found!`);
		return;
	}

	if(!button2){
		Logger.error(`Element with ID dialog-button-cancel not found!`);
		return;
	}

	button1.style.display = "none";
	button2.style.display = "none";
}
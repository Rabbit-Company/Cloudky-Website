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

export function isHidden(id: string){
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.visibility == 'hidden');
}

export function isfHidden(id: string){
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.display == 'none');
}

export function setText(id: string, text: string){
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.innerText = text;
}
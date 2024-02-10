import Argon2id from "@rabbit-company/argon2id";
import Blake2b from "@rabbit-company/blake2b";
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

export async function copyToClipboard(text: string){
	if(navigator.clipboard){
		await navigator.clipboard.writeText(text);
		return;
	}

	let textArea = document.createElement("textarea");
	textArea.value = text;

	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	textArea.setSelectionRange(0, 99999);

	document.execCommand('copy');
	document.body.removeChild(textArea);
}

export async function getDebugInfo(): Promise<string>{
	let blake2b: boolean = false;
	let argon2id: number = 0;

	const blake2bHash: string = Blake2b.hash('test', '');
	try{
		const startTime = performance.now();
		const argon2idHash = await Argon2id.hash('test', 'testtesttesttest', 4, 16, 3, 64);
		const endTime = performance.now();
		argon2id = Math.round(endTime - startTime);
		if(!argon2idHash.startsWith('82271eb8bc') || !argon2idHash.endsWith('2400cecbb1')) argon2id = -1;
	}catch{}

	if(blake2bHash.startsWith('a71079d428') && blake2bHash.endsWith('6a89bea572')) blake2b = true;

	return `
	Client Version: 1.0.0

	Server: ${localStorage.getItem('server')}
	Username: ${localStorage.getItem('username')}

	Clipboard: ${!!navigator.clipboard}
	WebWorkers: ${!!Worker}
	WebAssembly: ${typeof WebAssembly?.instantiate === 'function'}
	Blake2b: ${blake2b}
	Argon2id: ${argon2id}ms

	${navigator.userAgent}
	`.replaceAll('\t', '').trimStart().trimEnd();
}

export function clearStorage(items: string[] = ['token', 'hash', 'logged']){
	items.forEach(variable => localStorage.removeItem(variable));
}

export function isSessionValid(): boolean{
	const varList = ['server', 'username', 'token', 'hash'];

	let logged = localStorage.getItem('logged');
	let sessionDuration = localStorage.getItem('session-duration');

	if(logged === null) return false;
	if(sessionDuration === null) return false;

	if((Number(logged) + (Number(sessionDuration) * 60000)) < Date.now()) return false;

	for(let i = 0; i < varList.length; i++){
		if(localStorage.getItem(varList[i]) === null) return false;
	}
	return true;
}
import Argon2id from "@rabbit-company/argon2id";
import Blake2b from "@rabbit-company/blake2b";
import Logger from "@rabbit-company/logger";
import Cloudky from "./api";

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

export function isHidden(id: string, hiddenByDefault: boolean = false): boolean | undefined{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.visibility == 'hidden' || (hiddenByDefault && element.style.visibility == ''));
}

export function isfHidden(id: string, hiddenByDefault: boolean = false): boolean | undefined{
	let element = document.getElementById(id);
	if(!element){
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return (element.style.display == 'none' || (hiddenByDefault && element.style.display == ''));
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

export function formatBytes(bytes: number, decimals: number = 2): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export function formatLastModified(timestamp: string): string {
	const date = new Date(timestamp);
	const currentDate = new Date();

	const timeDiff = currentDate.getTime() - date.getTime();
	const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

	if(dayDiff === 0){
		const options: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};
		return date.toLocaleTimeString('en-US', options);
	}else if (dayDiff <= 7){
		return `${dayDiff} days ago`;
	}else{
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: '2-digit'
		};
		return date.toLocaleDateString('en-US', options);
	}
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

export function clearStorage(items: string[] = ['token', 'hash', 'files', 'logged', 'email', 'storage-used', 'storage-limit', 'storage-type', 'account-type', 'created']){
	items.forEach(variable => localStorage.removeItem(variable));
}

export function isSessionValid(): boolean{
	let varList = [
		'server',
		'username',
		'token',
		'files',
		'email',
		'storage-used',
		'storage-limit',
		'storage-type',
		'account-type',
		'created'
	];

	let logged = localStorage.getItem('logged');
	let accountType = localStorage.getItem('account-type');
	let debugMode = localStorage.getItem('debug-mode');
	let currentPath = localStorage.getItem('current-path');
	let sessionDuration = localStorage.getItem('session-duration');

	if(logged === null) return false;
	if(accountType === null) return false;
	if(debugMode === null) localStorage.setItem('debug-mode', 'false');
	if(currentPath === null) localStorage.setItem('current-path', '/');
	if(sessionDuration === null){
		localStorage.setItem('session-duration', '60');
		sessionDuration = '60';
	}

	if(accountType === '1') varList.push('hash');

	if((Number(logged) + (Number(sessionDuration) * 60000)) < Date.now()) return false;

	for(let i = 0; i < varList.length; i++){
		if(localStorage.getItem(varList[i]) === null) return false;
	}
	return true;
}

export async function hash(message: string, algo = 'SHA-256') {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export function initializeSession(){
	if(!isSessionValid()){
		clearStorage();
		window.location.href = '/';
	}

	setInterval(() => {
		if(!isSessionValid()){
			clearStorage();
			window.location.href = '/';
		}
	}, 3000);
}

export async function getAccountData(server: string, username: string, token: string): Promise<boolean>{
	try{
		let data = await Cloudky.getAccountData(server, username, token);
		if(data.error !== 0) return false;
		localStorage.setItem('email', data.data.Email);
		localStorage.setItem('storage-used', data.data.StorageUsed);
		localStorage.setItem('storage-limit', data.data.StorageLimit);
		localStorage.setItem('storage-type', data.data.StorageType);
		localStorage.setItem('account-type', data.data.AccountType);
		localStorage.setItem('created', data.data.Created);
		return true;
	}catch{}
	return false;
}

export async function getFileList(server: string, username: string, token: string): Promise<boolean>{
	try{
		let data = await Cloudky.getFileList(server, username, token);
		if(data.error !== 0) return false;
		localStorage.setItem('files', JSON.stringify(data.data));
		return true;
	}catch{}
	return false;
}

export interface CFile{
	Key: string;
	LastModified: string;
	Size: number;
}
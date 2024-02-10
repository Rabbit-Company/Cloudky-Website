import PasswordEntropy from "@rabbit-company/password-entropy";
import { DialogType, changeDialog } from "../dialog";
import { setIcon } from "../icons";
import { getText } from "../lang";
import { fhide, fshow, getDebugInfo, isSessionValid, isfHidden, show, showDialogButtons } from "../utils";
import Blake2b from "@rabbit-company/blake2b";
import Argon2id from "@rabbit-company/argon2id";
import Logger from "@rabbit-company/logger";
import Cloudky from "../api";

if(isSessionValid()) window.location.href = 'dashboard.html';

const serverInput = document.getElementById('server') as HTMLInputElement;
const server2Input = document.getElementById('server2') as HTMLSelectElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const otpInput = document.getElementById("otp") as HTMLInputElement;

const logoElement = document.getElementById('logo');
const signInBtnElement = document.getElementById('btn-signin');
const signUpBtnElement = document.getElementById('btn-signup');
const signInFormElement = document.getElementById('signin-form');
const serverPickerElement = document.getElementById('server-picker');
const forgotenUsernameElement = document.getElementById('forgot-username');

if(serverInput) serverInput.placeholder = await getText('server');
if(usernameInput) usernameInput.placeholder = await getText('username');
if(passwordInput) passwordInput.placeholder = await getText('password');
if(signInBtnElement) signInBtnElement.innerText = await getText('signin');
if(signUpBtnElement) signUpBtnElement.innerText = await getText('signup');
if(forgotenUsernameElement) forgotenUsernameElement.innerText = await getText('forgot_username');

let server = localStorage.getItem('server');
if(server !== null){
	let servers = Array.from(server2Input.options).map(v => v.value);
	if(servers.includes(server)){
		server2Input.value = server;
	}else{
		serverInput.value = server;
		toggleServerPicker();
	}
}

let username = localStorage.getItem('username');
if(usernameInput && username !== null) usernameInput.value = username;

signUpBtnElement?.addEventListener('click', () => {
	window.location.href = 'register.html';
});

signInFormElement?.addEventListener('submit', e => {
	e.preventDefault();
	starLoginProcess();
});

serverPickerElement?.addEventListener('click', () => {
	toggleServerPicker();
});

let debugMode = 0;
logoElement?.addEventListener('click', async () => {
	debugMode++;
	if(debugMode < 5) return;

	debugMode = 0;
	changeDialog(DialogType.LOADING, 'Testing features...');
	show('dialog');
	let result = await getDebugInfo();
	changeDialog(DialogType.DEBUG, result);
});

function toggleServerPicker(){
	if(isfHidden('server')){
		fhide('server2');
		fshow('server');
		setIcon('server-picker', 'adjustments-off', 'secondaryColor', 5);
	}else{
		fhide('server');
		fshow('server2');
		setIcon('server-picker', 'adjustments', 'secondaryColor', 5);
	}
}

async function starLoginProcess(){
	let server = serverInput.value;
	const username = usernameInput.value.toLowerCase();
	const password = passwordInput.value;
	const otp = otpInput.value;

	if(isfHidden('server')){
		server = server2Input.value;
	}

	if(PasswordEntropy.calculate(password) < 75){
		changeDialog(DialogType.ERROR, await getText('2'));
		show('dialog');
		return;
	}

	changeDialog(DialogType.LOADING, await getText('signing_in'));
	show('dialog');

	const authHash = Blake2b.hash(`cloudky2024-${password}-${username}`, '');
	const authSalt = Blake2b.hash(`cloudky2024-${username}`, '');
	try{
		const authFinalHash = await Argon2id.hash(authHash, authSalt, 4, 16, 3, 64);
		login(server, username, authFinalHash, password, otp);
	}catch{
		Logger.error('Argon2id hashing');
	}
}

async function login(server: string, username: string, authPass: string, password: string, otp: string){
	try{
		let data = await Cloudky.getToken(server, username, authPass, otp);

		showDialogButtons();

		if(typeof data.error === 'undefined'){
			changeDialog(DialogType.ERROR, await getText('server_unreachable'));
			return;
		}

		if(data.error != 0){
			changeDialog(DialogType.ERROR, await getText(data.error));
			return;
		}

		localStorage.setItem('server', server);
		localStorage.setItem('username', username);
		localStorage.setItem('token', data.token);
		localStorage.setItem('logged', Date.now().toString());

		const localHash = Blake2b.hash(`${username}-${password}-cloudky2024`, '');
		const localSalt = Blake2b.hash(`${username}-cloudky2024`, '');
		try{
			const localFinalHash = await Argon2id.hash(localHash, localSalt, 4, 16, 3, 64);
			localStorage.setItem('hash', localFinalHash);
			window.location.href = 'dashboard.html';
		}catch{
			Logger.error('Argon2id hashing');
		}
	}catch(err){
		showDialogButtons();
		if(typeof err !== 'string') return;
		changeDialog(DialogType.ERROR, await getText(err));
	}
}
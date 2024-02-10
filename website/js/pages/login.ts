import { DialogType, changeDialog } from "../dialog";
import { setIcon } from "../icons";
import { getText } from "../lang";
import { fhide, fshow, getDebugInfo, isfHidden, show } from "../utils";

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

let server = localStorage.getItem('url');
if(server !== null){
	let servers = Array.from(server2Input.options).map(v => v.value);
	if(servers.includes(server)){
		server2Input.value = server;
	}else{
		serverInput.value = server;
		toggleServerPicker();
	}
}

signUpBtnElement?.addEventListener('click', () => {
	window.location.href = 'register.html';
});

signInFormElement?.addEventListener('submit', e => {
	e.preventDefault();
	//starRegistrationProcess();
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
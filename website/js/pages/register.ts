import PasswordEntropy from '@rabbit-company/password-entropy';
import { fhide, fshow, isfHidden, show, showDialogButtons } from '../utils';
import { setIcon } from '../icons';
import { getText } from '../lang';
import Cloudky from '../api';
import { DialogType, changeDialog } from '../dialog';
import Blake2b from '@rabbit-company/blake2b';
import Argon2id from '@rabbit-company/argon2id';
import Logger from '@rabbit-company/logger';

const serverInput = document.getElementById('server') as HTMLInputElement;
const server2Input = document.getElementById('server2') as HTMLSelectElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

const signInBtnElement = document.getElementById('btn-signin');
const signUpBtnElement = document.getElementById('btn-signup');
const signUpFormElement = document.getElementById('signup-form');
const entropyElement = document.getElementById('entropy');
const serverPickerElement = document.getElementById('server-picker');
const passwordHiderElement = document.getElementById('password-hider');
const tosElement = document.getElementById('tos');

if(serverInput) serverInput.placeholder = await getText('server');
if(usernameInput) usernameInput.placeholder = await getText('username');
if(emailInput) emailInput.placeholder = await getText('email');
if(passwordInput) passwordInput.placeholder = await getText('password');
if(signInBtnElement) signInBtnElement.innerText = await getText('signin');
if(signUpBtnElement) signUpBtnElement.innerText = await getText('signup');
if(tosElement) tosElement.innerText = await getText('terms_of_service');

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

signInBtnElement?.addEventListener('click', () => {
	window.location.href = 'index.html';
});

signUpFormElement?.addEventListener('submit', e => {
	e.preventDefault();
	starRegistrationProcess();
});

passwordInput?.addEventListener('input', () => {
	if(!entropyElement) return;

	let entropy = 100 - (PasswordEntropy.calculate(passwordInput.value));
	if(entropy <= 1) entropy = 0;
	entropyElement.style.width = entropy + '%';
});

serverPickerElement?.addEventListener('click', () => {
	toggleServerPicker();
});

passwordHiderElement?.addEventListener('click', () => {
	if(!passwordInput) return;
	if(passwordInput.type === "password"){
		passwordInput.type = "text";
		setIcon('password-hider', 'eye-off', 'secondaryColor', 5);
	}else{
		passwordInput.type = "password";
		setIcon('password-hider', 'eye', 'secondaryColor', 5);
	}
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

async function starRegistrationProcess(){
	let url = serverInput.value;
	const username = usernameInput.value.toLowerCase();
	const email = emailInput.value;
	const password = passwordInput.value;

	if(isfHidden('server')){
		url = server2Input.value;
	}

	if(PasswordEntropy.calculate(password) < 75){
		changeDialog(DialogType.ERROR, await getText('5'));
		show('dialog');
		return;
	}

	changeDialog(DialogType.LOADING, "signing_up");
	show('dialog');

	const authHash = Blake2b.hash(`cloudky2024-${password}-${username}`, '');
	const authSalt = Blake2b.hash(`cloudky2024-${username}`, '');
	try{
		const authFinalHash = await Argon2id.hash(authHash, authSalt, 4, 16, 3, 64);
		register(url, username, email, authFinalHash, 0);
	}catch{
		Logger.error('Argon2id hashing');
	}
}

async function register(url: string, username: string, email: string, authPass: string, type: number){
	try{
		let data = await Cloudky.createAccount(url, username, email, authPass, type);

		showDialogButtons();

		if(typeof data.error === 'undefined'){
			changeDialog(DialogType.ERROR, await getText('server_unreachable'));
			return;
		}

		if(data.error != 0){
			changeDialog(DialogType.ERROR, await getText(data.error));
			return;
		}

		localStorage.setItem('url', url);
		localStorage.setItem('username', username);

		changeDialog(DialogType.SUCCESS, await getText('registration_completed'));
	}catch(err){
		showDialogButtons();
		if(typeof err !== 'string') return;
		changeDialog(DialogType.ERROR, await getText(err));
	}
}
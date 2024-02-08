import PasswordEntropy from '@rabbit-company/password-entropy';
import { fhide, fshow, isfHidden } from './utils';
import { setIcon } from './icons';
import { getText } from './lang';

const serverInput = document.getElementById('server') as HTMLInputElement;
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

signInBtnElement?.addEventListener('click', () => {
	window.location.href = 'index.html';
});

signUpFormElement?.addEventListener('submit', e => {
	e.preventDefault();
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
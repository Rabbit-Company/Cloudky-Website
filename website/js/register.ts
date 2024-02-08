import PasswordEntropy from '@rabbit-company/password-entropy';
import { fhide, fshow, isfHidden } from './utils';
import { setIcon } from './icons';

const passwordInput = document.getElementById('password') as HTMLInputElement;

const signInBtnElement = document.getElementById("btn_signin");
const signUpFormElement = document.getElementById("signup-form");
const entropyElement = document.getElementById('entropy');
const serverPickerElement = document.getElementById('server-picker');
const passwordHiderElement = document.getElementById('password-hider');

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
	if(isfHidden('passky-server')){
		fhide('passky-server2');
		fshow('passky-server');
		setIcon('server-picker', 'adjustments-off', 'secondaryColor', 5);
	}else{
		fhide('passky-server');
		fshow('passky-server2');
		setIcon('server-picker', 'adjustments', 'secondaryColor', 5);
	}
}
import PasswordEntropy from '@rabbit-company/password-entropy';
import { fhide, fshow, isfHidden } from './utils';
import { setIcon } from './icons';

const passwordInput = document.getElementById("password") as HTMLInputElement;

const entropyElement = document.getElementById("entropy");
const serverPickerElement = document.getElementById("server-picker");

passwordInput?.addEventListener("input", () => {
	if(!entropyElement) return;

	let entropy = 100 - (PasswordEntropy.calculate(passwordInput.value));
	if(entropy <= 1) entropy = 0;
	entropyElement.style.width = entropy + "%";
});

serverPickerElement?.addEventListener("click", () => {
	toggleServerPicker();
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
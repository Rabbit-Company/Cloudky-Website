import PasswordEntropy from '@rabbit-company/password-entropy';

const passwordInput = document.getElementById("password") as HTMLInputElement;
const entropyElement = document.getElementById("entropy");

passwordInput?.addEventListener("input", () => {
	if(!entropyElement) return;

	let entropy = 100 - (PasswordEntropy.calculate(passwordInput.value));
	if(entropy <= 1) entropy = 0;
	entropyElement.style.width = entropy + "%";
});
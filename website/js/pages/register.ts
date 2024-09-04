import { fhide, fshow, isSessionValid, isfHidden, show, showDialogButtons } from "../utils";
import { setIcon } from "../icons";
import { getText } from "../lang";
import { DialogType, changeDialog } from "../dialog";
import { CloudkyAPI, Error, PasswordEntropy } from "@rabbit-company/cloudky-api";

if (isSessionValid()) window.location.href = "dashboard.html";

const serverInput = document.getElementById("server") as HTMLInputElement;
const server2Input = document.getElementById("server2") as HTMLSelectElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

const signInBtnElement = document.getElementById("btn-signin");
const signUpBtnElement = document.getElementById("btn-signup");
const signUpFormElement = document.getElementById("signup-form");
const entropyElement = document.getElementById("entropy");
const serverPickerElement = document.getElementById("server-picker");
const passwordHiderElement = document.getElementById("password-hider");
const tosElement = document.getElementById("tos");

if (serverInput) serverInput.placeholder = await getText("server");
if (usernameInput) usernameInput.placeholder = await getText("username");
if (emailInput) emailInput.placeholder = await getText("email");
if (passwordInput) passwordInput.placeholder = await getText("password");
if (signInBtnElement) signInBtnElement.innerText = await getText("signin");
if (signUpBtnElement) signUpBtnElement.innerText = await getText("signup");
if (tosElement) tosElement.innerText = await getText("terms_of_service");

let server = localStorage.getItem("server");
if (server !== null) {
	let servers = Array.from(server2Input.options).map((v) => v.value);
	if (servers.includes(server)) {
		server2Input.value = server;
	} else {
		serverInput.value = server;
		toggleServerPicker();
	}
}

signInBtnElement?.addEventListener("click", () => {
	window.location.href = "index.html";
});

signUpFormElement?.addEventListener("submit", (e) => {
	e.preventDefault();
	starRegistrationProcess();
});

passwordInput?.addEventListener("input", () => {
	if (!entropyElement) return;

	let entropy = 100 - PasswordEntropy.calculate(passwordInput.value);
	if (entropy <= 1) entropy = 0;
	entropyElement.style.width = entropy + "%";
});

serverPickerElement?.addEventListener("click", () => {
	toggleServerPicker();
});

passwordHiderElement?.addEventListener("click", () => {
	if (!passwordInput) return;
	if (passwordInput.type === "password") {
		passwordInput.type = "text";
		setIcon("password-hider", "eye-off", "secondaryColor", 5);
	} else {
		passwordInput.type = "password";
		setIcon("password-hider", "eye", "secondaryColor", 5);
	}
});

function toggleServerPicker() {
	if (isfHidden("server")) {
		fhide("server2");
		fshow("server");
		setIcon("server-picker", "adjustments-off", "secondaryColor", 5);
	} else {
		fhide("server");
		fshow("server2");
		setIcon("server-picker", "adjustments", "secondaryColor", 5);
	}
}

async function starRegistrationProcess() {
	let server = serverInput.value;
	const username = usernameInput.value.toLowerCase();
	const email = emailInput.value;
	const password = passwordInput.value;

	if (isfHidden("server")) {
		server = server2Input.value;
	}

	if (PasswordEntropy.calculate(password) < 75) {
		changeDialog(DialogType.ERROR, await getText("5"));
		show("dialog");
		return;
	}

	changeDialog(DialogType.LOADING, await getText("signing_up"));
	show("dialog");

	register(server, username, email, password, 0);
}

async function register(server: string, username: string, email: string, password: string, type: number) {
	try {
		const data = await CloudkyAPI.createAccount(server, username, email, password, type);

		showDialogButtons();

		if (data.error !== Error.SUCCESS) {
			changeDialog(DialogType.ERROR, await getText(data.error));
			return;
		}

		localStorage.setItem("server", server);
		localStorage.setItem("username", username);

		changeDialog(DialogType.SUCCESS, await getText("registration_completed"));
	} catch (err) {
		showDialogButtons();
		if (typeof err !== "string") return;
		changeDialog(DialogType.ERROR, await getText(err));
	}
}

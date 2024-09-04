import { Argon2id, Blake2b, CloudkyAPI, Error, PasswordEntropy, type AccountTokenResponse } from "@rabbit-company/cloudky-api";
import { DialogType, changeDialog } from "../dialog";
import { setIcon } from "../icons";
import { getText } from "../lang";
import { fhide, fshow, getAccountData, getDebugInfo, getFileList, isSessionValid, isfHidden, show } from "../utils";

if (isSessionValid()) window.location.href = "dashboard.html";

const serverInput = document.getElementById("server") as HTMLInputElement;
const server2Input = document.getElementById("server2") as HTMLSelectElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const otpInput = document.getElementById("otp") as HTMLInputElement;

const logoElement = document.getElementById("logo");
const signInBtnElement = document.getElementById("btn-signin");
const signUpBtnElement = document.getElementById("btn-signup");
const signInFormElement = document.getElementById("signin-form");
const serverPickerElement = document.getElementById("server-picker");
const forgotenUsernameElement = document.getElementById("forgot-username");

if (serverInput) serverInput.placeholder = await getText("server");
if (usernameInput) usernameInput.placeholder = await getText("username");
if (passwordInput) passwordInput.placeholder = await getText("password");
if (signInBtnElement) signInBtnElement.innerText = await getText("signin");
if (signUpBtnElement) signUpBtnElement.innerText = await getText("signup");
if (forgotenUsernameElement) forgotenUsernameElement.innerText = await getText("forgot_username");

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

let username = localStorage.getItem("username");
if (usernameInput && username !== null) usernameInput.value = username;

signUpBtnElement?.addEventListener("click", () => {
	window.location.href = "register.html";
});

signInFormElement?.addEventListener("submit", (e) => {
	e.preventDefault();
	startLoginProcess();
});

serverPickerElement?.addEventListener("click", () => {
	toggleServerPicker();
});

let debugMode = 0;
logoElement?.addEventListener("click", async () => {
	debugMode++;
	if (debugMode < 5) return;

	debugMode = 0;
	changeDialog(DialogType.LOADING, "Testing features...");
	show("dialog");
	let result = await getDebugInfo();
	changeDialog(DialogType.DEBUG, result);
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

async function startLoginProcess() {
	let server = serverInput.value;
	const username = usernameInput.value.toLowerCase();
	const password = passwordInput.value;
	const otp = otpInput.value;

	if (isfHidden("server")) {
		server = server2Input.value;
	}

	if (PasswordEntropy.calculate(password) < 75) {
		changeDialog(DialogType.ERROR, await getText("2"));
		show("dialog");
		return;
	}

	changeDialog(DialogType.LOADING, await getText("signing_in"));
	show("dialog");

	login(server, username, password, otp);
}

async function login(server: string, username: string, password: string, otp: string) {
	try {
		let debugMode = localStorage.getItem("debug-mode");
		if (debugMode === "true") changeDialog(DialogType.LOADING, "Generating authentication token...");

		const data: AccountTokenResponse = await CloudkyAPI.getToken(server, username, password, otp);

		if (!data.token) {
			changeDialog(DialogType.ERROR, await getText(data.error));
			return;
		}

		localStorage.setItem("server", server);
		localStorage.setItem("username", username);
		localStorage.setItem("token", data.token);
		localStorage.setItem("logged", Date.now().toString());

		try {
			if (debugMode === "true") changeDialog(DialogType.LOADING, "Loading files...");
			await getFileList(server, username, data.token);
		} catch (err) {
			if (typeof err !== "string") return;
			changeDialog(DialogType.ERROR, await getText(err));
			return;
		}

		try {
			if (debugMode === "true") changeDialog(DialogType.LOADING, "Loading account data...");
			await getAccountData(server, username, data.token);
		} catch (err) {
			if (typeof err !== "string") return;
			changeDialog(DialogType.ERROR, await getText(err));
			return;
		}

		window.location.href = "dashboard.html";
	} catch (err) {
		if (typeof err !== "string") return;
		changeDialog(DialogType.ERROR, await getText(err));
	}
}

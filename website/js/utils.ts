import Argon2id from "@rabbit-company/argon2id";
import Blake2b from "@rabbit-company/blake2b";
import Logger from "@rabbit-company/logger";
import Cloudky from "./api";
import { getIcon } from "./icons";

export function fhide(id: string): void {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.display = "none";
}

export function fshow(id: string, method: string = "block"): void {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.display = method;
}

export function hide(id: string): void {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.visibility = "hidden";
}

export function show(id: string): void {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.style.visibility = "visible";
}

export function isHidden(id: string, hiddenByDefault: boolean = false): boolean | undefined {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return element.style.visibility == "hidden" || (hiddenByDefault && element.style.visibility == "");
}

export function isfHidden(id: string, hiddenByDefault: boolean = false): boolean | undefined {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	return element.style.display == "none" || (hiddenByDefault && element.style.display == "");
}

export function setText(id: string, text: string): void {
	let element = document.getElementById(id);
	if (!element) {
		Logger.error(`Element with ID ${id} not found!`);
		return;
	}
	element.innerText = text;
}

export function showDialogButtons(): void {
	let button1 = document.getElementById("dialog-button");
	let button2 = document.getElementById("dialog-button-cancel");

	if (!button1) {
		Logger.error(`Element with ID dialog-button not found!`);
		return;
	}

	if (!button2) {
		Logger.error(`Element with ID dialog-button-cancel not found!`);
		return;
	}

	button1.style.display = "";
	button2.style.display = "";
}

export function hideDialogButtons(): void {
	let button1 = document.getElementById("dialog-button");
	let button2 = document.getElementById("dialog-button-cancel");

	if (!button1) {
		Logger.error(`Element with ID dialog-button not found!`);
		return;
	}

	if (!button2) {
		Logger.error(`Element with ID dialog-button-cancel not found!`);
		return;
	}

	button1.style.display = "none";
	button2.style.display = "none";
}

export async function copyToClipboard(text: string) {
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(text);
		return;
	}

	let textArea = document.createElement("textarea");
	textArea.value = text;

	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	textArea.setSelectionRange(0, 99999);

	document.execCommand("copy");
	document.body.removeChild(textArea);
}

export function formatBytes(bytes: number, decimals: number = 2): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

export function formatLastModified(timestamp: number): string {
	const date = new Date(timestamp);

	const timeDiff = Date.now() - timestamp;
	const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

	if (dayDiff === 0) {
		const options: Intl.DateTimeFormatOptions = {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		};
		return date.toLocaleTimeString("en-US", options);
	} else if (dayDiff <= 7) {
		return `${dayDiff} days ago`;
	} else {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "2-digit",
		};
		return date.toLocaleDateString("en-US", options);
	}
}

export async function getDebugInfo(): Promise<string> {
	let blake2b: boolean = false;
	let argon2id: number = 0;

	const blake2bHash: string = Blake2b.hash("test", "");
	try {
		const startTime = performance.now();
		const argon2idHash = await Argon2id.hash("test", "testtesttesttest", 4, 16, 3, 64);
		const endTime = performance.now();
		argon2id = Math.round(endTime - startTime);
		if (!argon2idHash.startsWith("82271eb8bc") || !argon2idHash.endsWith("2400cecbb1")) argon2id = -1;
	} catch {}

	if (blake2bHash.startsWith("a71079d428") && blake2bHash.endsWith("6a89bea572")) blake2b = true;

	return `
	Client Version: 1.0.0

	Server: ${localStorage.getItem("server")}
	Username: ${localStorage.getItem("username")}

	Clipboard: ${!!navigator.clipboard}
	WebWorkers: ${!!Worker}
	WebAssembly: ${typeof WebAssembly?.instantiate === "function"}
	Blake2b: ${blake2b}
	Argon2id: ${argon2id}ms

	${navigator.userAgent}
	`
		.replaceAll("\t", "")
		.trimStart()
		.trimEnd();
}

export function clearStorage(
	items: string[] = [
		"token",
		"hash",
		"files",
		"sorted-files",
		"sorted-folders",
		"searched-files",
		"current-path",
		"displayed-files",
		"logged",
		"email",
		"storage-used",
		"storage-limit",
		"storage-type",
		"account-type",
		"created",
	]
) {
	items.forEach((variable) => localStorage.removeItem(variable));
}

export function isSessionValid(): boolean {
	let varList = ["server", "username", "token", "files", "email", "storage-used", "storage-limit", "storage-type", "account-type", "created"];

	let logged = localStorage.getItem("logged");
	let accountType = localStorage.getItem("account-type");
	let debugMode = localStorage.getItem("debug-mode");
	let currentPath = localStorage.getItem("current-path");
	let sessionDuration = localStorage.getItem("session-duration");

	if (logged === null) return false;
	if (accountType === null) return false;
	if (debugMode === null) localStorage.setItem("debug-mode", "false");
	if (currentPath === null) localStorage.setItem("current-path", "/");
	if (sessionDuration === null) {
		localStorage.setItem("session-duration", "60");
		sessionDuration = "60";
	}

	if (accountType === "1") varList.push("hash");

	if (Number(logged) + Number(sessionDuration) * 60000 < Date.now()) return false;

	for (let i = 0; i < varList.length; i++) {
		if (localStorage.getItem(varList[i]) === null) return false;
	}
	return true;
}

export async function hash(message: string, algo = "SHA-256") {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return hashHex;
}

export function initializeSession() {
	if (!isSessionValid()) {
		clearStorage();
		window.location.href = "/";
	}

	setInterval(() => {
		if (!isSessionValid()) {
			clearStorage();
			window.location.href = "/";
		}
	}, 3000);
}

export async function getAccountData(server: string, username: string, token: string): Promise<boolean> {
	try {
		let data = await Cloudky.getAccountData(server, username, token);
		if (data.error !== 0) return false;
		localStorage.setItem("email", data.data.Email);
		localStorage.setItem("download-used", data.data.DownloadUsed);
		localStorage.setItem("download-limit", data.data.DownloadLimit);
		localStorage.setItem("upload-used", data.data.UploadUsed);
		localStorage.setItem("upload-limit", data.data.UploadLimit);
		localStorage.setItem("storage-used", data.data.StorageUsed);
		localStorage.setItem("storage-limit", data.data.StorageLimit);
		localStorage.setItem("storage-type", data.data.StorageType);
		localStorage.setItem("account-type", data.data.AccountType);
		localStorage.setItem("created", data.data.Created);
		return true;
	} catch {}
	return false;
}

export async function getFileList(server: string, username: string, token: string): Promise<boolean> {
	try {
		let data = await Cloudky.getFileList(server, username, token);
		if (data.error !== 0) return false;
		localStorage.setItem("files", JSON.stringify(data.data));
		return true;
	} catch {}
	return false;
}

export async function deleteFiles(server: string, username: string, token: string, paths: string[]): Promise<boolean> {
	try {
		let data = await Cloudky.deleteFiles(server, username, token, paths);
		if (data.error !== 0) return false;
		return true;
	} catch {}
	return false;
}

export interface CFile {
	Key: string;
	Modified: number;
	Size: number;
}

export enum SORT {
	NAME_ASC = "name-asc",
	NAME_DESC = "name-desc",
	MODIFIED_ASC = "modified-asc",
	MODIFIED_DESC = "modified-desc",
	SIZE_ASC = "size-asc",
	SIZE_DESC = "size-desc",
}

export function filesToNestedObject(files: CFile[]): Record<string, any> {
	const result: Record<string, any> = {};

	files.forEach((file) => {
		const pathParts = file.Key.split("/");
		let currentLevel = result;

		for (let i = 0; i < pathParts.length - 1; i++) {
			const folder = pathParts[i];
			if (!currentLevel[folder]) {
				currentLevel[folder] = {};
			}
			currentLevel = currentLevel[folder];
		}

		const fileName = pathParts[pathParts.length - 1];
		currentLevel[fileName] = {
			Modified: file.Modified,
			Size: file.Size,
		};
	});

	return result;
}

export function getFolderMetadata(folder: Record<string, any>): { Modified: number; Size: number } {
	let size = 0;
	let lastModified = 0;
	Object.keys(folder).forEach((name) => {
		let value = folder[name];
		if (typeof value.Modified === "number" && typeof value.Size === "number") {
			size += value.Size;
			if (lastModified < value.Modified) {
				lastModified = value.Modified;
			}
			return;
		}

		let newFolder = getFolderMetadata(value);
		size += newFolder.Size;
		if (lastModified < newFolder.Modified) {
			lastModified = newFolder.Modified;
		}
	});

	return { Modified: lastModified, Size: size };
}

export function refreshBreadcrumb(files: Record<string, any>) {
	const currentPath = localStorage.getItem("current-path") || "/";
	const breadcrumb = document.getElementById("breadcrumb");
	if (!breadcrumb) return;

	let htmlBreadcrumb = `
	<li>
		<div>
			<a href="#" class="text-gray-400 hover:text-gray-500 cursor-pointer" onclick="handleBreadcrumbClick(''); return false;">
				<svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
				</svg>
				<span class="sr-only">Home</span>
			</a>
		</div>
	</li>`;
	currentPath.split("/").forEach((folder, index, array) => {
		if (!(index !== 0 && index !== array.length - 1)) return;
		const path = array.slice(0, index + 1).join("/");
		files = files[folder];
		htmlBreadcrumb += `
			<li>
				<div class="flex items-center">
					<svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
					</svg>
					<a href="#" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer" onclick="handleBreadcrumbClick('${path}'); return false;">${folder}</a>
				</div>
			</li>
		`;
	});

	breadcrumb.innerHTML = htmlBreadcrumb;
}

export function refreshFileManager(files: Record<string, any>, displayFiles: number = 20) {
	const currentPath = localStorage.getItem("current-path") || "/";
	const sorting = (localStorage.getItem("sorting") as SORT) || SORT.NAME_ASC;
	const fileManager = document.getElementById("file-manager");
	if (!fileManager) return;

	let Folders: Record<string, any> = {};
	let Files: Record<string, any> = {};

	// Separate folders and files
	Object.keys(files).forEach((name) => {
		let value = files[name];
		if (typeof value.Modified === "number" && typeof value.Size === "number") {
			Files[name] = value;
			return;
		}
		Folders[name] = value;
	});

	// Sort folders and files
	let sortedFolders: string[] = sortFolders(Folders, sorting);
	let sortedFiles: string[] = sortFiles(Files, sorting);

	let htmlFiles = "";
	let displayedFiles = 0;
	for (let i = 0; i < sortedFolders.length; i++) {
		if (displayedFiles >= displayFiles) break;
		const name = sortedFolders[i];

		const folder = getFolderMetadata(files[name]);

		htmlFiles += `
			<tr>
				<td class="secondaryColor whitespace-nowrap py-0 pl-4 pr-3 text-sm font-medium cursor-pointer" onclick="handleBreadcrumbClick('${currentPath}${name}'); return false;">
					<div class="flex items-center space-x-2">
						${getIcon("folder", "secondaryColor")}
						<span>${name}</span>
					</div>
				</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatLastModified(folder.Modified)}</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatBytes(folder.Size)}</td>
				<td class="relative whitespace-nowrap py-0 pl-3 pr-4 text-right text-sm sm:pr-0">
					<button onclick="dropdownClick('folder-${i + 1}')" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
						${getIcon("dots-vertical")}
					</button>
					<div id="folder-${i + 1}" class="hidden z-10 absolute right-0 mt-2 w-24 secondaryBackgroundColor rounded-lg shadow-lg" style="display: none">
						<ul class="py-1">
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Download</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Rename</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Delete</a></li>
						</ul>
					</div>
				</td>
			</tr>
		`;

		displayedFiles++;
	}

	for (let i = 0; i < sortedFiles.length; i++) {
		if (displayedFiles >= displayFiles) break;
		const name = sortedFiles[i];

		htmlFiles += `
			<tr>
				<td class="secondaryColor whitespace-nowrap py-0 pl-4 pr-3 text-sm font-medium">
					<div class="flex items-center space-x-2">
						${getIcon("photo", "text-red-600")}
						<span>${name}</span>
					</div>
				</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatLastModified(files[name].Modified)}</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatBytes(files[name].Size)}</td>
				<td class="relative whitespace-nowrap py-0 pl-3 pr-4 text-right text-sm sm:pr-0">
					<button onclick="dropdownClick('file-${i + 1}')" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
						${getIcon("dots-vertical")}
					</button>
					<div id="file-${i + 1}" class="hidden z-10 absolute right-0 mt-2 w-24 secondaryBackgroundColor rounded-lg shadow-lg" style="display: none">
						<ul class="py-1">
							<li><a onclick="downloadFile('${currentPath}${name}')" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Download</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Rename</a></li>
							<li><a onclick="deleteFile('${currentPath}${name}')" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Delete</a></li>
						</ul>
					</div>
				</td>
			</tr>
		`;
		displayedFiles++;
	}

	localStorage.setItem("displayed-files", displayedFiles.toString());
	localStorage.setItem("sorted-files", JSON.stringify(sortedFiles));
	localStorage.setItem("sorted-folders", JSON.stringify(sortedFolders));
	fileManager.innerHTML = htmlFiles;
}

export function loadMoreFiles(files: Record<string, any>, amount = 20) {
	let displayedFiles: number = Number(localStorage.getItem("displayed-files")) || 20;
	const currentPath = localStorage.getItem("current-path") || "/";
	const sortedFolders: string[] = JSON.parse(localStorage.getItem("sorted-folders") || "[]") || [];
	const sortedFiles: string[] = JSON.parse(localStorage.getItem("sorted-files") || "[]") || [];
	const fileManager = document.getElementById("file-manager");
	if (!fileManager) return;

	let htmlFiles = "";
	const totalAllowed = displayedFiles + amount;
	for (let i = displayedFiles; i < sortedFolders.length; i++) {
		if (displayedFiles >= totalAllowed) break;
		const name = sortedFolders[i];
		const folder = getFolderMetadata(files[name]);
		htmlFiles += `
			<tr>
				<td class="secondaryColor whitespace-nowrap py-0 pl-4 pr-3 text-sm font-medium cursor-pointer" onclick="handleBreadcrumbClick('${currentPath}${name}'); return false;">
					<div class="flex items-center space-x-2">
						${getIcon("folder", "secondaryColor")}
						<span>${name}</span>
					</div>
				</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatLastModified(folder.Modified)}</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatBytes(folder.Size)}</td>
				<td class="relative whitespace-nowrap py-0 pl-3 pr-4 text-right text-sm sm:pr-0">
					<button onclick="dropdownClick('folder-${i + 1}')" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
						${getIcon("dots-vertical")}
					</button>
					<div id="file-${i + 1}" class="hidden z-10 absolute right-0 mt-2 w-24 secondaryBackgroundColor rounded-lg shadow-lg" syle="display: none">
						<ul class="py-1">
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Download</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Rename</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm">Delete</a></li>
						</ul>
					</div>
				</td>
			</tr>
		`;
		displayedFiles++;
	}

	for (let i = displayedFiles; i < sortedFiles.length; i++) {
		if (displayedFiles >= totalAllowed) break;
		const name = sortedFiles[i];
		htmlFiles += `
			<tr>
				<td class="secondaryColor whitespace-nowrap py-0 pl-4 pr-3 text-sm font-medium">
					<div class="flex items-center space-x-2">
						${getIcon("photo", "text-red-600")}
						<span>${name}</span>
					</div>
				</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatLastModified(files[name].Modified)}</td>
				<td class="secondaryColor whitespace-nowrap px-3 py-4 text-sm">${formatBytes(files[name].Size)}</td>
				<td class="relative whitespace-nowrap py-0 pl-3 pr-4 text-right text-sm sm:pr-0">
					<button onclick="dropdownClick('file-${i + 1}')" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
						${getIcon("dots-vertical")}
					</button>
					<div id="file-${i + 1}" class="hidden z-10 absolute right-0 mt-2 w-24 secondaryBackgroundColor rounded-lg shadow-lg" style="display: none">
						<ul class="py-1">
							<li><a onclick="downloadFile('${currentPath}${name}')" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Download</a></li>
							<li><a href="#" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Rename</a></li>
							<li><a onclick="deleteFile('${currentPath}${name}')" class="mainMenuLink block px-4 py-2 text-sm cursor-pointer">Delete</a></li>
						</ul>
					</div>
				</td>
			</tr>
		`;
		displayedFiles++;
	}

	localStorage.setItem("displayed-files", displayedFiles.toString());
	fileManager.innerHTML += htmlFiles;
}

export function getDisplayedFiles(sortedFiles: Record<string, any>): Record<string, any> {
	const currentPath = localStorage.getItem("current-path") || "/";

	let displayedFiles = sortedFiles;
	currentPath.split("/").forEach((folder, index, array) => {
		if (!(index !== 0 && index !== array.length - 1)) return;
		displayedFiles = displayedFiles[folder];
	});

	return displayedFiles;
}

export function sortFiles(files: Record<string, any>, order: SORT): Array<string> {
	switch (order) {
		case SORT.NAME_DESC:
			return Object.keys(files).sort((name1, name2) => name2.localeCompare(name1));
		case SORT.MODIFIED_ASC:
			return Object.keys(files).sort((name1, name2) => files[name1].Modified - files[name2].Modified);
		case SORT.MODIFIED_DESC:
			return Object.keys(files).sort((name1, name2) => files[name2].Modified - files[name1].Modified);
		case SORT.SIZE_ASC:
			return Object.keys(files).sort((name1, name2) => files[name1].Size - files[name2].Size);
		case SORT.SIZE_DESC:
			return Object.keys(files).sort((name1, name2) => files[name2].Size - files[name1].Size);
		default:
			return Object.keys(files).sort((name1, name2) => name1.localeCompare(name2));
	}
}

export function sortFolders(folders: Record<string, any>, order: SORT): Array<string> {
	let folderMetadata: Record<string, any> = {};
	Object.keys(folders).forEach((name) => {
		folderMetadata[name] = getFolderMetadata(folders[name]);
	});

	switch (order) {
		case SORT.NAME_DESC:
			return Object.keys(folders).sort((name1, name2) => name2.localeCompare(name1));
		case SORT.MODIFIED_ASC:
			return Object.keys(folders).sort((name1, name2) => folderMetadata[name1].Modified - folderMetadata[name2].Modified);
		case SORT.MODIFIED_DESC:
			return Object.keys(folders).sort((name1, name2) => folderMetadata[name2].Modified - folderMetadata[name1].Modified);
		case SORT.SIZE_ASC:
			return Object.keys(folders).sort((name1, name2) => folderMetadata[name1].Size - folderMetadata[name2].Size);
		case SORT.SIZE_DESC:
			return Object.keys(folders).sort((name1, name2) => folderMetadata[name2].Size - folderMetadata[name1].Size);
		default:
			return Object.keys(folders).sort((name1, name2) => name1.localeCompare(name2));
	}
}

export function updateSortIcons() {
	let sorting = localStorage.getItem("sorting") || "name-asc";

	["name", "modified", "size"].forEach((name) => {
		const sortIcon = document.getElementById(`sort-icon-${name}`);
		if (!sortIcon) return;

		if (sorting.includes("desc")) {
			sortIcon.innerHTML = getIcon("sort-descending");
		} else {
			sortIcon.innerHTML = getIcon("sort-ascending");
		}

		if (!sorting.includes(name)) {
			sortIcon.className = "invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible";
			return;
		}

		sortIcon.className = "ml-2 flex-none rounded bg-gray-700 text-gray-900";
	});
}

export function updateStats() {
	const sidebarStorage = document.getElementById("sidebar-storage");
	const sidebarDownload = document.getElementById("sidebar-download");
	const sidebarUpload = document.getElementById("sidebar-upload");
	const mobileSidebarStorage = document.getElementById("mobile-sidebar-storage");
	const mobileSidebarDownload = document.getElementById("mobile-sidebar-download");
	const mobileSidebarUpload = document.getElementById("mobile-sidebar-upload");

	const storageUsed = Number(localStorage.getItem("storage-used"));
	const storageLimit = Number(localStorage.getItem("storage-limit"));
	const downloadUsed = Number(localStorage.getItem("download-used"));
	const downloadLimit = Number(localStorage.getItem("download-limit"));
	const uploadUsed = Number(localStorage.getItem("upload-used"));
	const uploadLimit = Number(localStorage.getItem("upload-limit"));

	if (sidebarStorage) {
		sidebarStorage.innerText = `${formatBytes(storageUsed)} of ${formatBytes(storageLimit)} used`;
		if (storageUsed / storageLimit > 0.8) sidebarStorage.className = "warningColor";
		if (storageUsed / storageLimit > 0.9) sidebarStorage.className = "dangerColor";
	}
	if (mobileSidebarStorage) {
		mobileSidebarStorage.innerText = `${formatBytes(storageUsed)} of ${formatBytes(storageLimit)} used`;
		if (storageUsed / storageLimit > 0.8) mobileSidebarStorage.className = "warningColor";
		if (storageUsed / storageLimit > 0.9) mobileSidebarStorage.className = "dangerColor";
	}

	if (sidebarDownload) {
		sidebarDownload.innerText = `${formatBytes(downloadUsed)} of ${formatBytes(downloadLimit)} used`;
		if (downloadUsed / downloadLimit > 0.08) sidebarDownload.className = "warningColor";
		if (downloadUsed / downloadLimit > 0.09) sidebarDownload.className = "dangerColor";
	}
	if (mobileSidebarDownload) {
		mobileSidebarDownload.innerText = `${formatBytes(downloadUsed)} of ${formatBytes(downloadLimit)} used`;
		if (downloadUsed / downloadLimit > 0.8) mobileSidebarDownload.className = "warningColor";
		if (downloadUsed / downloadLimit > 0.9) mobileSidebarDownload.className = "dangerColor";
	}

	if (sidebarUpload) {
		sidebarUpload.innerText = `${formatBytes(uploadUsed)} of ${formatBytes(uploadLimit)} used`;
		if (uploadUsed / uploadLimit > 0.8) sidebarUpload.className = "warningColor";
		if (uploadUsed / uploadLimit > 0.9) sidebarUpload.className = "dangerColor";
	}
	if (mobileSidebarUpload) {
		mobileSidebarUpload.innerText = `${formatBytes(uploadUsed)} of ${formatBytes(uploadLimit)} used`;
		if (uploadUsed / uploadLimit > 0.8) mobileSidebarUpload.className = "warningColor";
		if (uploadUsed / uploadLimit > 0.9) mobileSidebarUpload.className = "dangerColor";
	}
}

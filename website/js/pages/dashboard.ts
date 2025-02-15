import { CloudkyAPI, Error, type FileInformation } from "@rabbit-company/cloudky-api";
import {
	clearStorage,
	fhide,
	fshow,
	hash,
	initializeSession,
	isfHidden,
	filesToNestedObject,
	refreshFileManager,
	refreshBreadcrumb,
	getDisplayedFiles,
	updateSortIcons,
	loadMoreFiles,
	updateStats,
} from "../utils";

const sidebar = document.getElementById("sidebar");
const sidebarMenuBackdrop = document.getElementById("sidebar-menu-backdrop");
const sidebarMenu = document.getElementById("sidebar-menu");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarCloseButton = document.getElementById("sidebar-close-btn");
const sidebarOpenButton = document.getElementById("sidebar-open-btn");
const profileDropdownButton = document.getElementById("profile-dropdown-btn");
const profileUsername = document.getElementById("profile-username");
const signoutButton = document.getElementById("signout-btn");
const sidebarStorage = document.getElementById("sidebar-storage");
const sidebarStorageDropdown = document.getElementById("sidebar-storage-dropdown");
const sidebarStorageDownloadUpload = document.getElementById("sidebar-storage-download-upload");
const sidebarDownload = document.getElementById("sidebar-download");
const sidebarUpload = document.getElementById("sidebar-upload");
const mobileSidebarStorage = document.getElementById("mobile-sidebar-storage");
const mobileSidebarStorageDropdown = document.getElementById("mobile-sidebar-storage-dropdown");
const mobileSidebarStorageDownloadUpload = document.getElementById("mobile-sidebar-storage-download-upload");
const mobileSidebarDownload = document.getElementById("mobile-sidebar-download");
const mobileSidebarUpload = document.getElementById("mobile-sidebar-upload");
const fileManager = document.getElementById("file-manager");
const breadcrumb = document.getElementById("breadcrumb");
const searchField = document.getElementById("search-field") as HTMLInputElement;

initializeSession();

let openedFileDropDowns: Set<string> = new Set();

localStorage.setItem("current-path", "/");

const server = localStorage.getItem("server") || "";
const username = localStorage.getItem("username") || "";
const token = localStorage.getItem("token") || "";

const cloudky = new CloudkyAPI(server, username, token);

let files = JSON.parse(localStorage.getItem("files") || "[]") as Array<FileInformation>;
const email = localStorage.getItem("email");
const storageUsed = localStorage.getItem("storage-used");
const storageLimit = localStorage.getItem("storage-limit");
const downloadUsed = localStorage.getItem("download-used");
const downloadLimit = localStorage.getItem("download-limit");
const uploadUsed = localStorage.getItem("upload-used");
const uploadLimit = localStorage.getItem("upload-limit");
const storageType = localStorage.getItem("storage-type");
const accountType = localStorage.getItem("account-type");
const created = localStorage.getItem("created");

if (profileUsername) profileUsername.innerText = username || "";

updateStats();

const avatar = document.getElementById("avatar") as HTMLImageElement;
avatar.src = `https://gravatar.com/avatar/${await hash(email || "")}`;

updateSortIcons();
let sortedFiles = filesToNestedObject(files);

(window as any).handleBreadcrumbClick = function (path: string) {
	path += "/";
	let currentPath = localStorage.getItem("current-path") || "/";
	if (currentPath === path) return;

	openedFileDropDowns.clear();

	const searchedFiles = localStorage.getItem("searched-files");
	if (searchedFiles !== null) {
		let filteredSortedFiles: Record<string, any> = JSON.parse(searchedFiles);

		localStorage.setItem("current-path", path);
		refreshBreadcrumb(filteredSortedFiles);
		refreshFileManager(getDisplayedFiles(filteredSortedFiles));
		return;
	}

	localStorage.setItem("current-path", path);
	refreshBreadcrumb(sortedFiles);
	refreshFileManager(getDisplayedFiles(sortedFiles));
};

(window as any).handleFileSortClick = function (sortName: string) {
	let sorting = localStorage.getItem("sorting") || "name-asc";
	let desc = sorting.includes("-desc");

	let newSorting = `${sortName}-asc`;
	if (sorting.includes(sortName)) {
		if (!desc) newSorting = `${sortName}-desc`;
	}

	localStorage.setItem("sorting", newSorting);

	updateSortIcons();

	const searchedFiles = localStorage.getItem("searched-files");
	if (searchedFiles !== null) {
		let filteredSortedFiles: Record<string, any> = JSON.parse(searchedFiles);
		refreshBreadcrumb(filteredSortedFiles);
		refreshFileManager(getDisplayedFiles(filteredSortedFiles));
		return;
	}

	refreshBreadcrumb(sortedFiles);
	refreshFileManager(getDisplayedFiles(sortedFiles));
};

(window as any).dropdownClick = (id: string) => {
	const menu = document.getElementById(id);
	if (!menu) return;

	if (isfHidden(id)) {
		openedFileDropDowns.forEach((id) => fhide(id));
		openedFileDropDowns.clear();
		openedFileDropDowns.add(id);
		fshow(id);
	} else {
		openedFileDropDowns.delete(id);
		fhide(id);
	}
};

(window as any).downloadFile = async (id: string) => {
	id = id.slice(1);
	let res = await cloudky.generateFileDownloadLink(id);
	if (typeof res !== "string") return;

	const link = document.createElement("a");
	link.href = res;
	link.target = "_blank";
	link.download = "";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	//localStorage.setItem("download-used", (Number(localStorage.getItem("download-used")) + res.size).toString());
	updateStats();
};

(window as any).deleteFile = async (id: string) => {
	// TODO: Show alert dialog and ask user again if he wants to delete this file
	id = id.slice(1);
	const res = await cloudky.deleteFiles([id]);
	if (res.error !== Error.SUCCESS) return;

	const index = files.findIndex((file) => file.Key === id);
	if (index !== -1) files.splice(index, 1);

	sortedFiles = filesToNestedObject(files);
	refreshFileManager(getDisplayedFiles(sortedFiles));
};

searchField?.addEventListener("keyup", (e) => {
	if (e.key !== "Enter") return;

	const keyword = searchField.value.toLowerCase();

	if (keyword.trim().length === 0) {
		localStorage.removeItem("searched-files");
		refreshBreadcrumb(sortedFiles);
		refreshFileManager(getDisplayedFiles(sortedFiles));
		return;
	}

	const searchedFiles = filesToNestedObject(files.filter((file) => file.Key.toLowerCase().includes(keyword)));

	localStorage.setItem("current-path", "/");
	localStorage.setItem("searched-files", JSON.stringify(searchedFiles));
	updateSortIcons();
	refreshBreadcrumb(searchedFiles);
	refreshFileManager(searchedFiles);
});

// Infinite scroll
window.addEventListener("scroll", () => {
	if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - document.documentElement.scrollHeight / 10)
		loadMoreFiles(getDisplayedFiles(sortedFiles), 20);
});

refreshBreadcrumb(sortedFiles);
refreshFileManager(sortedFiles);

sidebarStorageDropdown?.addEventListener("click", () => {
	if (isfHidden("sidebar-storage-download-upload")) {
		fshow("sidebar-storage-download-upload");
	} else {
		fhide("sidebar-storage-download-upload");
	}
});

mobileSidebarStorageDropdown?.addEventListener("click", () => {
	if (isfHidden("mobile-sidebar-storage-download-upload")) {
		fshow("mobile-sidebar-storage-download-upload");
	} else {
		fhide("mobile-sidebar-storage-download-upload");
	}
});

sidebarCloseButton?.addEventListener("click", () => {
	if (!sidebar) return;
	if (!sidebarMenuBackdrop) return;
	if (!sidebarMenu) return;
	if (!sidebarClose) return;

	sidebarMenuBackdrop.className = "transition-opacity ease-linear duration-300 opacity-0 fixed inset-0 bg-gray-900/80";
	sidebarClose.className = "ease-in-out duration-300 opacity-0 absolute left-full top-0 flex w-16 justify-center pt-5";
	sidebarMenu.className = "transition ease-in-out duration-300 transform -translate-x-full relative mr-16 flex w-full max-w-xs flex-1";

	setTimeout(() => {
		sidebar.className = "hidden relative z-50 lg:hidden";
	}, 400);
});

sidebarOpenButton?.addEventListener("click", () => {
	if (!sidebar) return;
	if (!sidebarMenuBackdrop) return;
	if (!sidebarMenu) return;
	if (!sidebarClose) return;

	sidebar.className = "relative z-50 lg:hidden";
	sidebarMenuBackdrop.className = "transition-opacity ease-linear duration-300 opacity-100 fixed inset-0 bg-gray-900/80";
	sidebarClose.className = "ease-in-out duration-300 opacity-100 absolute left-full top-0 flex w-16 justify-center pt-5";
	sidebarMenu.className = "transition ease-in-out duration-300 transform translate-x-0 relative mr-16 flex w-full max-w-xs flex-1";
});

profileDropdownButton?.addEventListener("click", () => {
	if (isfHidden("profile-dropdown", true)) {
		fshow("profile-dropdown");
		return;
	}

	fhide("profile-dropdown");
});

signoutButton?.addEventListener("click", () => {
	clearStorage();
	window.location.href = "index.html";
});

document.addEventListener("click", (event: MouseEvent) => {
	const target = event.target as HTMLElement;

	const dropdownElement = target.closest(".fileDropDown") as HTMLElement | null;

	if (dropdownElement) return;
	openedFileDropDowns.forEach((id) => fhide(id));
	openedFileDropDowns.clear();
});

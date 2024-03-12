import { getIcon } from "../icons";
import { clearStorage, fhide, formatBytes, fshow, hash, initializeSession, isSessionValid, isfHidden, type CFile, formatLastModified, filesToNestedObject, getFolderMetadata, refreshFileManager, refreshBreadcrumb, getDisplayedFiles, updateSortIcons, loadMoreFiles, deleteFiles } from "../utils";

const sidebar = document.getElementById('sidebar');
const sidebarMenuBackdrop = document.getElementById('sidebar-menu-backdrop');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarCloseButton = document.getElementById('sidebar-close-btn');
const sidebarOpenButton = document.getElementById('sidebar-open-btn');
const profileDropdownButton = document.getElementById('profile-dropdown-btn');
const profileUsername = document.getElementById('profile-username');
const signoutButton = document.getElementById('signout-btn');
const sidebarStorage = document.getElementById('sidebar-storage');
const mobileSidebarStorage = document.getElementById('mobile-sidebar-storage');
const fileManager = document.getElementById('file-manager');
const breadcrumb = document.getElementById('breadcrumb');
const searchField = document.getElementById('search-field') as HTMLInputElement;

initializeSession();

const server = localStorage.getItem('server') || '';
const username = localStorage.getItem('username') || '';
const token = localStorage.getItem('token') || '';

const currentPath = localStorage.getItem('current-path') || '/';
const files = JSON.parse(localStorage.getItem('files') || '[]') as Array<CFile>;
const email = localStorage.getItem('email');
const storageUsed = localStorage.getItem('storage-used');
const storageLimit = localStorage.getItem('storage-limit');
const storageType = localStorage.getItem('storage-type');
const accountType = localStorage.getItem('account-type');
const created = localStorage.getItem('created');

if(profileUsername) profileUsername.innerText = username || '';

if(sidebarStorage) sidebarStorage.innerText = `${formatBytes(Number(storageUsed) * 1048576)} of ${formatBytes(Number(storageLimit) * 1048576)} used`;
if(mobileSidebarStorage) mobileSidebarStorage.innerText = `${formatBytes(Number(storageUsed) * 1048576)} of ${formatBytes(Number(storageLimit) * 1048576)} used`;

const avatar = document.getElementById('avatar') as HTMLImageElement;
avatar.src = `https://gravatar.com/avatar/${await hash(email || '')}`;

updateSortIcons();
let sortedFiles = filesToNestedObject(files);

(window as any).handleBreadcrumbClick = function(path: string) {
	path += '/';
	let currentPath = localStorage.getItem('current-path') || '/';
	if(currentPath === path) return;

	const searchedFiles = localStorage.getItem('searched-files');
	if(searchedFiles !== null){
		let filteredSortedFiles: Record<string, any> = JSON.parse(searchedFiles);

		localStorage.setItem('current-path', path);
		refreshBreadcrumb(filteredSortedFiles);
		refreshFileManager(getDisplayedFiles(filteredSortedFiles));
		return;
	}

	localStorage.setItem('current-path', path);
	refreshBreadcrumb(sortedFiles);
	refreshFileManager(getDisplayedFiles(sortedFiles));
};

(window as any).handleFileSortClick = function(sortName: string) {
	let sorting = localStorage.getItem('sorting') || 'name-asc';
	let desc = sorting.includes('-desc');

	let newSorting = `${sortName}-asc`;
	if(sorting.includes(sortName)){
		if(!desc) newSorting = `${sortName}-desc`;
	}

	localStorage.setItem('sorting', newSorting);

	updateSortIcons();

	const searchedFiles = localStorage.getItem('searched-files');
	if(searchedFiles !== null){
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
	if(!menu) return;

	if(isfHidden(id)){
		fshow(id);
	}else{
		fhide(id);
	}
};

(window as any).deleteFile = async (id: string) => {
	// TODO: Show alert dialog and ask user again if he wants to delete this file
	let deleted = await deleteFiles(server, username, token, [id]);
	if(!deleted) return;
	//TODO: After file has been successfully deleted from the server, remove it from a table as well
}

searchField?.addEventListener('keyup', (e) => {
	if(e.key !== 'Enter') return;

	const keyword = searchField.value.toLowerCase();

	if(keyword.trim().length === 0){
		localStorage.removeItem('searched-files');
		refreshBreadcrumb(sortedFiles);
		refreshFileManager(getDisplayedFiles(sortedFiles));
		return;
	}

	const searchedFiles = filesToNestedObject(files.filter((file) => file.Key.toLowerCase().includes(keyword)));

	localStorage.setItem('current-path', '/');
	localStorage.setItem('searched-files', JSON.stringify(searchedFiles));
	updateSortIcons();
	refreshBreadcrumb(searchedFiles);
	refreshFileManager(searchedFiles);
});

// Infinite scroll
window.addEventListener('scroll', () => {
	if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - (document.documentElement.scrollHeight / 10)) loadMoreFiles(getDisplayedFiles(sortedFiles), 20);
});

refreshBreadcrumb(sortedFiles);
refreshFileManager(sortedFiles);

sidebarCloseButton?.addEventListener('click', () => {
	if(!sidebar) return;
	if(!sidebarMenuBackdrop) return;
	if(!sidebarMenu) return;
	if(!sidebarClose) return;

	sidebarMenuBackdrop.className = 'transition-opacity ease-linear duration-300 opacity-0 fixed inset-0 bg-gray-900/80';
	sidebarClose.className = 'ease-in-out duration-300 opacity-0 absolute left-full top-0 flex w-16 justify-center pt-5';
	sidebarMenu.className = 'transition ease-in-out duration-300 transform -translate-x-full relative mr-16 flex w-full max-w-xs flex-1';

	setTimeout(() => {
		sidebar.className = 'hidden relative z-50 lg:hidden';
	}, 400);
});

sidebarOpenButton?.addEventListener('click', () => {
	if(!sidebar) return;
	if(!sidebarMenuBackdrop) return;
	if(!sidebarMenu) return;
	if(!sidebarClose) return;

	sidebar.className = 'relative z-50 lg:hidden';
	sidebarMenuBackdrop.className = 'transition-opacity ease-linear duration-300 opacity-100 fixed inset-0 bg-gray-900/80';
	sidebarClose.className = 'ease-in-out duration-300 opacity-100 absolute left-full top-0 flex w-16 justify-center pt-5';
	sidebarMenu.className = 'transition ease-in-out duration-300 transform translate-x-0 relative mr-16 flex w-full max-w-xs flex-1';
});

profileDropdownButton?.addEventListener('click', () => {
	if(isfHidden('profile-dropdown', true)){
		fshow('profile-dropdown');
		return;
	}

	fhide('profile-dropdown');
});

signoutButton?.addEventListener('click', () => {
	clearStorage();
	window.location.href = 'index.html';
});
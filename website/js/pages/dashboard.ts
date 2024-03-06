import { clearStorage, fhide, formatBytes, fshow, hash, initializeSession, isSessionValid, isfHidden } from "../utils";

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

initializeSession();

const server = localStorage.getItem('server');
const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

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
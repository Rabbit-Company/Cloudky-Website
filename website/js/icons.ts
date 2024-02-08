import Logger from "@rabbit-company/logger";

const iconList: { [key: string]: string } = {
	'adjustments': '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v11" />',
	'adjustments-off': '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="6" cy="10" r="2"></circle><path d="M6 6v2"></path><path d="M6 12v8"></path><circle cx="12" cy="16" r="2"></circle><path d="M12 4v4"></path><path d="M12 12v2"></path><path d="M12 18v2"></path><circle cx="18" cy="7" r="2"></circle><path d="M18 4v1"></path><path d="M18 9v5"></path><path d="M18 18v2"></path><path d="M3 3l18 18"></path>'
}

export function getIcon(id: string, color: string = 'secondaryColor', size: number = 5): string{
	return `<svg xmlns='http://www.w3.org/2000/svg' class='h-${size} w-${size} ${color}' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'>${iconList[id]}</svg>`;
}

export function setIcon(elementID: string, iconID: string, color: string = 'secondaryColor', size: number = 5){
	let element = document.getElementById(elementID);
	if(!element){
		Logger.error(`Element with ID ${elementID} not found!`);
		return;
	}
	element.innerHTML = getIcon(iconID, color, size);
}
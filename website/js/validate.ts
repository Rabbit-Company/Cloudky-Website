export default class Validate{

	static username(username: string): boolean{
		return /^([a-z][a-z0-9\-]{3,29})$/.test(username);
	}

	static password(password: string): boolean{
		return /^[a-z0-9]{128}$/i.test(password);
	}

	static url(url: string): boolean{
		return !(/\s/.test(url));
	}

	static email(email: string): boolean{
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(email);
	}

	static accountType(type: number): boolean{
		return [0, 1].includes(type);
	}

	static otp(otp: string): boolean{
		if(typeof(otp) == 'undefined' || otp == null) return false;
		return (otp.length == 0 || otp.length == 6 || otp.length == 44);
	}

	static token(token: string): boolean{
		return /^[a-z0-9]{128}$/i.test(token);
	}

	static positiveInteger(number: any): boolean{
		if(typeof(number) == 'undefined' || number == null) return false;
		return number >>> 0 === parseFloat(number);
	}

	static yubiKey(id: string): boolean{
		return id.length == 44;
	}

	static license(license: string): boolean{
		return license.length == 29;
	}

	static json(json: string): boolean{
		try{
			JSON.parse(json);
			return true;
		}catch{}
		return false;
	}
}
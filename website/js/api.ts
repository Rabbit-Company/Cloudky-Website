import Validate from './validate';

export default class Cloudky{

	static async createAccount(server: string, username: string, email: string, password: string, type: number): Promise<any> {
		if(!Validate.url(server)) throw 'url_invalid';
		if(!Validate.username(username)) throw '12';
		if(!Validate.email(email)) throw '6';
		if(!Validate.password(password)) throw '5';
		if(!Validate.accountType(type)) throw '1008';

		try{
			const data = {
				username: username,
				email: email,
				password: password,
				type: type
			}

			const result = await fetch(server + "/v1/account/create", {
				method: "POST",
				body: JSON.stringify(data)
			});

			if (result.status !== 200 && result.status !== 429) {
				throw 'server_unreachable';
			}

			const response = await result.text();
			return JSON.parse(response);
		}catch{
			throw 'server_unreachable';
		}
	}

}
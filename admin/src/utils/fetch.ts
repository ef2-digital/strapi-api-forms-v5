import { PLUGIN_ID } from '../pluginId';

const fetchInstance = async (
	endpoint: string,
	token: string,
	method: string,
	options?: object | null,
	formData?: object | null,
	isAdmin?: boolean
) => {
	const route = `${isAdmin ? '/' : '/api/'}`;

	try {
		return fetch(`${route}${PLUGIN_ID}/${endpoint}${options ? `?${new URLSearchParams({ ...options })}` : ''}`, {
			method,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: formData && JSON.stringify({ data: formData }),
		});
	} catch (error) {
		console.error(error);

		throw new Error();
	}
};

export default fetchInstance;

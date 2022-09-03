import { getUserData } from '~/sessions.server';

export async function fetchAboutGuestData(id: string, request: Request) {
	const userSession = await getUserData(request);
	const res = await fetch(`${process.env.API_ADRESS}/guests/${id}`, {
		headers: {
			Authorization: `Bearer ${userSession.token}`,
		},
	});
	return res;
}

export async function createGuestData(
	request: Request,
	body: any,
) {
	const { token } = await getUserData(request);
	const apiEndpoint = process.env.API_ADRESS + `/guests`;
	const res = await fetch(apiEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			...body,
		}),
	});
	return res;
}
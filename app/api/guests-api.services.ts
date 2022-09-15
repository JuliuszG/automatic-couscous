import { getUserData } from '~/sessions.server';

export async function fetchAboutGuestData(id: string, request: Request) {
	const res = await fetch(`${process.env.API_ADRESS}/guests/${id}`);
	return res;
}

export async function createGuestData(request: Request, body: any) {
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

export async function fetchGuestsList(
	page: string,
	limit: string,
	sortDirection: 'ASC' | 'DESC',
	sortCol: string,
	request: any,
) {
	const res = await fetch(
		`${process.env.API_ADRESS}/guests/list?page=${page}&limit=${limit}&sortCol=${sortCol}&sortDirection=${sortDirection}`
	);
	return res;
}


export async function editHotelData(
	guestId: string,
	body: any,
	request: Request
) {
	const apiEndpoint = process.env.API_ADRESS + `/guests/${guestId}`;
	const { token } = await getUserData(request);
	const res = await fetch(apiEndpoint, {
		method: 'PATCH',
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
import { getUserData } from '~/sessions.server';

export async function fetchAboutHotelData(id: string, request: Request) {
	const userSession = await getUserData(request);
	const res = await fetch(`${process.env.API_ADRESS}/hotel/${id}`, {
		headers: {
			Authorization: `Bearer ${userSession.token}`,
		},
	});
	return res;
}

export async function deleteHotelData(id: string, request: Request) {
	const userSession = await getUserData(request);
	const res = await fetch(`http://localhost:5000/api/hotel/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${userSession.token}`,
		},
	});
	return res;
}

export async function fetchHotelsList(
	page: string,
	limit: string,
	sortDirection: 'ASC' | 'DESC',
	sortCol: string,
	request: any,
) {
	const userSession = await getUserData(request);
	const res = await fetch(
		`${process.env.API_ADRESS}/hotel/list?page=${page}&limit=${limit}&sortCol=${sortCol}&sortDirection=${sortDirection}`,
		{
			headers: {
				Authorization: `Bearer ${userSession.token}`,
			},
		},
	);
	return res;
}

export async function editHotelData(
	hotelId: string,
	request: Request,
	body: any,
) {
	const { token } = await getUserData(request);
	const apiEndpoint = process.env.API_ADRESS + `/hotel/${hotelId}`;
	const res = await fetch(apiEndpoint, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			id: hotelId,
			...body,
		}),
	});
	return res;
}

export async function createHotelData(request: Request, body: any) {
	const { token } = await getUserData(request);
	const apiEndpoint = process.env.API_ADRESS + `/hotel`;
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

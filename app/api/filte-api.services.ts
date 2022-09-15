import { getUserData } from "~/sessions.server";

export async function fetchFileData(id: string, request: any) {
	const userSession = await getUserData(request);
	const res = await fetch(`${process.env.API_ADRESS}/files/${id}`, {
		headers: {
			Authorization: `Bearer ${userSession.token}`,
		},
	});
	return res;
}

import { Group, Title, Divider, } from '@mantine/core';
import { ActionFunction, redirect } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { createGuestData } from "~/api/guests-api.services";
import GuestsForm from "~/components/routes-components/guests/GuestsForm";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);
    const response = await createGuestData(request, values)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return redirect(`../dashboard/guests/about/${responseData?.id}`)
};

const Create = () => {
    return (
        <div>
            <Group >
                <Title order={1}>Create Guest</Title>
            </Group>
            <Divider my="sm" />
            <GuestsForm />
        </div>
    )
}

export default Create
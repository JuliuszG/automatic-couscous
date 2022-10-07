import { Group, Title, Divider, } from '@mantine/core';
import { ActionFunction, redirect } from "@remix-run/node";
import { Responses } from "~/responses.server";
import GuestsForm from "~/components/routes-components/guests/GuestsForm";
import UserForm from '~/components/routes-components/users/UserForm';
import { createUserData } from '~/api/user-api.services';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);
    const response = await createUserData(request, values)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return redirect(`../dashboard/users/about/${responseData?.id}`)
};

const Create = () => {
    return (
        <div>
            <Group >
                <Title order={1}>Create User</Title>
            </Group>
            <Divider my="sm" />
            <UserForm />
        </div>
    )
}

export default Create
import { Link, Links, Meta, Scripts, useActionData, useCatch, useTransition } from "@remix-run/react";
import { Group, Title, ActionIcon, Divider } from '@mantine/core';
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { IconArrowLeft } from "@tabler/icons";
import { createHotelData } from "~/api/hotel-api.services";
import HotelsForm from "~/components/routes-components/hotels/HotelsForm";
import { useEffect } from "react";
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);

    const response = await createHotelData(request, values)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);

    }
    return redirect(`../dashboard/hotels/about/${responseData?.id}`)
};

const Create = () => {
    const transition = useTransition();
    const error = useActionData();

    useEffect(() => {
        console.log('error', error, 'create');
    }, [error])
    return (
        <div>
            <Group >
                <Title order={1}>Create Hotel</Title>
            </Group>
            <Divider my="sm" />
            <HotelsForm />
        </div>
    )
}

export default Create
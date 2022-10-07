import { Link } from "@remix-run/react";
import { Group, Title, ActionIcon, Divider } from '@mantine/core';
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { IconArrowLeft } from "@tabler/icons";
import { editHotelData, fetchAboutGuestData } from "~/api/guests-api.services";
import GuestsForm from "~/components/routes-components/guests/GuestsForm";

type LoaderProps = {
    request: Request,
    params: any
}
type ActionProps = {
    request: Request,
    params: any
}

export const loader = async ({ params, request }: LoaderProps) => {
    const res = await fetchAboutGuestData(params.guestId, request);
    const data = await res.json();
    return json(data)
};

export const action: ActionFunction = async ({ request, params }: ActionProps) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);
    const response = await editHotelData(params.guestId, values, request)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return redirect(`../dashboard/guests/about/${responseData?.id}`)
};

const Edit = () => {
    return (
        <div>
            <Group >
                <Link to='../about'>
                    <ActionIcon size="lg" variant="light">
                        <IconArrowLeft />
                    </ActionIcon>
                </Link>
                <Title order={1}>Edit Guest</Title>
            </Group>
            <Divider my="sm" />
            <GuestsForm />
        </div>
    )
}

export default Edit
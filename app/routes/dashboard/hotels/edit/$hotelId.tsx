import { Link,  useLoaderData } from "@remix-run/react";
import {  Group, Title, ActionIcon, Divider } from '@mantine/core';
import { ActionFunction, json } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { IconArrowLeft } from "@tabler/icons";
import { redirect } from '@remix-run/node';
import { editHotelData, fetchAboutHotelData } from "~/api/hotel-api.services";
import { fetchFileData } from "~/api/filte-api.services";
import HotelsForm from "~/components/routes-components/hotels/HotelsForm";

type ActionProps = {
    request: Request,
    params: any
}
type LoaderProps = {
    request: Request,
    params: any
}

export const loader = async ({ params, request }: LoaderProps) => {
    const res = await fetchAboutHotelData(params.hotelId, request);
    const data = await res.json();
    const resDataReq = await fetchFileData(data.hotelImgId, request);
    // const fileData = await resDataReq.json();
    console.log(resDataReq);
    return json({ ...data, file: resDataReq })
};

export const action: ActionFunction = async ({ request, params }: ActionProps) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);
    const response = await editHotelData(params?.hotelId, request, values);
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return redirect(`../dashboard/hotels/about/${params.hotelId}`)
};



const Edit = () => {
    const hotelData = useLoaderData();
    return (
        <div>
            <Group >
                <Link to={`../about/${hotelData?.id}`}>
                    <ActionIcon size="lg" variant="light">
                        <IconArrowLeft />
                    </ActionIcon>
                </Link>
                <Title order={1}>Edit Hotel</Title>
            </Group>
            <Divider my="sm" />
            <HotelsForm />
        </div>
    )
}

export default Edit
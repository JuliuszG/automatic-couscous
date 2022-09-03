import * as Yup from "yup";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Stack, Title, ActionIcon, Divider, NumberInput } from '@mantine/core';
import { ActionFunction, json } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { AboutHotelDto } from "~/dtos/hotel/about-hotel.dto";
import { useForm, yupResolver } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons";
import { GuestsDto } from "~/dtos/guests/guests.dto";
import { createGuestData } from "~/api/guests-api.services";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as FormDataEntryValue);
    const response = await createGuestData(request, values)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return responseData
};

const schema = Yup.object().shape({
    name: Yup.string().min(2).required(),
    description: Yup.string().min(50).required(),
    location: Yup.array().of(Yup.number()).required()
});


const Create = () => {
    const fetcher = useFetcher();

    const form = useForm<GuestsDto>({
        // schema: yupResolver(schema),
        initialValues: {
            firstName: '',
            lastName: '',
            roomNumber: 0,
            floor: 0,
            food: '',
            period: 0
        },
    });

    const handleSubmit = (body: AboutHotelDto): void => {
        const data = {
            ...body,
        }
        fetcher.submit({ data: JSON.stringify(data) }, { method: "post" });
    };

    return (
        <div>
            <Group >
                <Link to='../about'>
                    <ActionIcon size="lg" variant="light">
                        <IconArrowLeft />
                    </ActionIcon>
                </Link>
                <Title order={1}>Create Guest</Title>
            </Group>
            <Divider my="sm" />
            <fetcher.Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack>
                    <TextInput
                        required
                        label="First name"
                        placeholder="Type guset first name"
                        {...form.getInputProps('firstName')}
                    />
                    <TextInput
                        required
                        label="Last name"
                        placeholder="Type guest last name"
                        {...form.getInputProps('lastName')}
                    />
                    <NumberInput
                        // defaultValue={18}
                        placeholder="Type guest room number"
                        label="Room number"
                        {...form.getInputProps('roomNumber')}
                    />
                    <NumberInput
                        // defaultValue={18}
                        placeholder="Type guest Floor"
                        label="Room number"
                        {...form.getInputProps('floor')}
                    />
                      <TextInput
                        required
                        label="Food"
                        placeholder="np. icluded"
                        {...form.getInputProps('food')}
                    />
                      <NumberInput
                        // defaultValue={18}
                        placeholder="np. 7 wath mean 7 nights"
                        label="Period"
                        {...form.getInputProps('period')}
                    />
                </Stack>
                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>

            </fetcher.Form>
        </div>
    )
}

export default Create
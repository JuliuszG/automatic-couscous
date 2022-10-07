import * as Yup from "yup";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Image, Text, SimpleGrid, Stack, Box, Textarea, Notification, Select } from '@mantine/core';
import { AboutHotelDto } from "~/dtos/hotel/about-hotel.dto";
import { Rating } from 'react-simple-star-rating'
import { useEffect, useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from "@mantine/form";

const schema = Yup.object().shape({
    email: Yup.string().min(2).required(),
    role: Yup.string().required(),
    password: Yup.string().min(6).required(),
});

const UserForm = () => {
    const fetcher = useFetcher();
    // const hotelData = useLoaderData();

    const form = useForm<any>({
        schema: yupResolver(schema),
        initialValues: {
            email: '',
            password: '',
            role: null
        },
    });

    // const setFormValue = (): void => {
    //     setRating(hotelData?.rating * 20)
    //     form.setValues({
    //         name: hotelData?.name,
    //         description: hotelData?.description,
    //         location: hotelData?.location,
    //     })
    // }

    const handleSubmit = (body: AboutHotelDto): void => {
        const data = {
            ...body
        }
        fetcher.submit({ data: JSON.stringify(data) }, { method: "post" });
    };


    return (
        <fetcher.Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack>
                <TextInput
                    required
                    label="E-mail"
                    placeholder="User e-mail"
                    {...form.getInputProps('email')}
                />
                <TextInput
                    required
                    label="Password"
                    placeholder="User password"
                    {...form.getInputProps('password')}
                />
                <Select
                    required
                    label="Role"
                    placeholder="Choose user role"
                    data={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'user', label: 'User' },
                    ]}
                    {...form.getInputProps('role')}
                />
            </Stack>
            <Group position="right" mt="md">
                <Button type="submit" loading={!!fetcher.submission}>Submit</Button>
            </Group>
        </fetcher.Form>
    )
}

export default UserForm
import * as Yup from "yup";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Image, Text, SimpleGrid, Stack, Box, Title, ActionIcon, Divider } from '@mantine/core';
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { AboutHotelDto } from "~/dtos/hotel/about-hotel.dto";
import { Rating } from 'react-simple-star-rating'
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons";
import { getUserData } from "~/sessions.server";
import { createHotelData } from "~/api/hotel-api.services";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as FormDataEntryValue);
    const response = await createHotelData(request, values)
    const responseData = await response.json();

    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return redirect(`../dashboard/hotels/about/${responseData?.id}`)
};

const schema = Yup.object().shape({
    name: Yup.string().min(2).required(),
    description: Yup.string().min(50).required(),
    location: Yup.array().of(Yup.number()).required()
});


const Create = () => {
    const [rating, setRating] = useState(0)
    const [files, setFiles] = useState<File[]>([]);

    const fetcher = useFetcher();

    const form = useForm<AboutHotelDto>({
        schema: yupResolver(schema),
        initialValues: {
            name: '',
            description: '',
            location: [20, 20],
        },
    });

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    const handleRating = (rate: number) => {
        setRating(rate)
    }

    const handleSubmit = (body: AboutHotelDto): void => {
        const data = {
            ...body,
            file: files[0],
            rating: rating ? (rating * 5 / 100) : null,
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
                <Title order={1}>Create Hotel</Title>
            </Group>
            <Divider my="sm" />
            <fetcher.Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack>
                    <TextInput
                        required
                        label="Name"
                        placeholder="Hotel name"
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        required
                        label="Description"
                        placeholder="Add some information about hotel"
                        {...form.getInputProps('description')}
                    />
                    <Box>
                        <Text>Hotel main image</Text>
                        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                            <Text align="center">Drop images here</Text>
                        </Dropzone>

                        <SimpleGrid
                            cols={4}
                            breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                            mt={previews.length > 0 ? 'xl' : 0}
                        >
                            {previews}
                        </SimpleGrid>
                    </Box>
                    <Box>
                        <Text>Hotel main image</Text>
                        <Rating onClick={handleRating} ratingValue={rating} />
                    </Box>
                </Stack>
                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>

            </fetcher.Form>
        </div>
    )
}

export default Create
import * as Yup from "yup";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Image, Text, SimpleGrid, Stack, Box, Title, ActionIcon, Divider, Textarea } from '@mantine/core';
import { ActionFunction, json } from "@remix-run/node";
import { Responses } from "~/responses.server";
import { AboutHotelDto } from "~/dtos/hotel/about-hotel.dto";
import { Rating } from 'react-simple-star-rating'
import { useEffect, useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons";
import { redirect } from '@remix-run/node';
import { editHotelData, fetchAboutHotelData } from "~/api/hotel-api.services";
import { fetchFileData } from "~/api/filte-api.services";

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

const schema = Yup.object().shape({
    name: Yup.string().min(2).required(),
    description: Yup.string().min(50).required(),
    location: Yup.array().of(Yup.number())
});


const Edit = () => {
    const [rating, setRating] = useState<number>(0)
    const [files, setFiles] = useState<File[]>([]);

    const hotelData = useLoaderData();
    const fetcher = useFetcher();

    const form = useForm<AboutHotelDto>({
        schema: yupResolver(schema),
        initialValues: {
            name: '',
            description: '',
            location: [20, 20],
        },
    });

    const setFormValue = (): void => {
        setRating(hotelData?.rating * 20)
        form.setValues({
            name: hotelData?.name,
            description: hotelData?.description,
            location: hotelData?.location,
        })
    }


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


    const handleRating = (rate: number): void => {
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

    useEffect(() => {
        setFormValue();
    }, [hotelData])

    if (!hotelData) {
        return null
    }

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
            <fetcher.Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack>
                    <TextInput
                        required
                        label="Name"
                        placeholder="Hotel name"
                        {...form.getInputProps('name')}
                    />
                    <Textarea
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
                        <Rating style={{ width: '100%' }} onClick={handleRating} ratingValue={rating} />
                    </Box>
                </Stack>
                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>

            </fetcher.Form>
        </div>
    )
}

export default Edit
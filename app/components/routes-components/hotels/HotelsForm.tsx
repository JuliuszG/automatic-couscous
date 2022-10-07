import * as Yup from "yup";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { TextInput, Button, Group, Image, Text, SimpleGrid, Stack, Box, Textarea, Notification } from '@mantine/core';
import { AboutHotelDto } from "~/dtos/hotel/about-hotel.dto";
import { Rating } from 'react-simple-star-rating'
import { useEffect, useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, yupResolver } from "@mantine/form";
import { IconCheck, IconX } from '@tabler/icons';
import If from "~/components/atoms/If/If";

const schema = Yup.object().shape({
    name: Yup.string().min(2).required(),
    description: Yup.string().min(50).required(),
    location: Yup.array().of(Yup.number()).required()
});

const HotelsForm = () => {
    const [rating, setRating] = useState(0)
    const [files, setFiles] = useState<File[]>([]);

    const fetcher = useFetcher();
    const hotelData = useLoaderData();

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

    const setFormValue = (): void => {
        setRating(hotelData?.rating * 20)
        form.setValues({
            name: hotelData?.name,
            description: hotelData?.description,
            location: hotelData?.location,
        })
    }

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

    useEffect(() => {
        hotelData && setFormValue();
    }, [hotelData])

    useEffect(() => {
        console.log(fetcher.data)
    }, [fetcher])

    return (
        <>
            <If query={fetcher.data?.error}>
                <div style={{ position: 'fixed', right: 0, top: 0 }}>
                    <Notification title="Error" icon={<IconX size={18} />} color="red" >
                        {Array.isArray(fetcher.data?.message) ? fetcher.data?.message[0] : fetcher.data?.message}
                    </Notification>
                    
                </div>
            </If>
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
                        <Rating onClick={handleRating} ratingValue={rating} />
                    </Box>
                </Stack>
                <Group position="right" mt="md">
                    <Button type="submit" loading={!!fetcher.submission}>Submit</Button>
                </Group>

            </fetcher.Form>
        </>
    )
}

export default HotelsForm
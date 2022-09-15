
import { fetchAboutHotelData } from '~/api/hotel-api.services';
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Text, Divider, Title, Grid, Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconPencil } from '@tabler/icons';
import { Link } from "@remix-run/react";
import { Rating } from 'react-simple-star-rating';

export const loader = async ({params, request}: any) => {
    const res = await fetchAboutHotelData(params.hotelId, request);
    const data = await res.json();
    return json(data)
};

const ratingToPercent = 20;

const About = () => {
    const hotelData = useLoaderData();
    const data = [
        {
            id: 1,
            title: 'Name:',
            name: 'name',
            size: 3
        },
        {
            id: 2,
            title: 'Description:',
            name: 'description',
            size: 9
        },
    ]

    return (
        <div>
            <Group position="apart">
                <Title order={1}>About Hotel</Title>
                <Link to={`../edit/${hotelData?.id}`}>
                    <ActionIcon size="lg" variant="light">
                        <IconPencil />
                    </ActionIcon>
                </Link>
            </Group>
            <Divider my="sm" />
            {data.map(({ id, title, name, size }) => (
                <Grid key={id}>
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">{title}</Text>
                    </Grid.Col>
                    <Grid.Col span={size}>
                        <Text size="md">{hotelData?.[name]}</Text>
                    </Grid.Col>
                </Grid>
            ))}
            <Grid >
                <Grid.Col span={2}>
                    <Text size="md" color="dimmed">Rating:</Text>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Rating ratingValue={hotelData?.rating * ratingToPercent} readonly={true}/>
                </Grid.Col>
            </Grid>
        </div>
    )
}

export default About
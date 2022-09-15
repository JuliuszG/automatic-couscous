import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Text, Divider, Title, Grid, Group, Paper } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconPencil } from '@tabler/icons';
import { Link } from "@remix-run/react";
import { Rating } from 'react-simple-star-rating';
import { fetchAboutGuestData } from '~/api/guests-api.services';
import If from "~/components/atoms/If/If";

export const loader = async ({ params, request }: any) => {
    console.log(params);
    const res = await fetchAboutGuestData(params.guestId, request);
    const data = await res.json();
    return json(data)
};

const ratingToPercent = 20;

const About = () => {
    const guestData = useLoaderData();
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
                <Title order={1}>About Guest</Title>
                <Link to={`../guests/edit/${guestData?.id}`}>
                    <ActionIcon size="lg" variant="light">
                        <IconPencil />
                    </ActionIcon>
                </Link>
            </Group>
            <Divider my="sm" />
            <Title order={3}>Tourists Details</Title>
            {guestData?.touristsDetails?.tourists?.map((item: any) => {
                return (
                    <Paper className="my-6 p-4">
                        <Grid >
                            <Grid.Col span={2}>
                                <Text size="md" color="dimmed">First name</Text>
                            </Grid.Col>
                            <Grid.Col span={2}>
                                <Text size="md">{item?.firstName}</Text>
                            </Grid.Col>
                        </Grid>
                        <Grid >
                            <Grid.Col span={2}>
                                <Text size="md" color="dimmed">Last name</Text>
                            </Grid.Col>
                            <Grid.Col span={2}>
                                <Text size="md">{item?.lastName}</Text>
                            </Grid.Col>
                        </Grid>
                        <Grid >
                            <Grid.Col span={2}>
                                <Text size="md" color="dimmed">Age</Text>
                            </Grid.Col>
                            <Grid.Col span={2}>
                                <Text size="md">{item?.age}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                )
            })}
            <If query={!guestData?.touristsDetails?.tourists?.length}>
                <Paper className="my-6 p-4">
                    <Text size="md" color="dimmed">-</Text>
                </Paper>
            </If>
            <Divider my="sm" />
            <Title order={3}>Room Details</Title>
            <Paper className="my-6 p-4">
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Room number</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.roomDetails?.roomNumber ?? '-'}</Text>
                    </Grid.Col>
                </Grid>
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Floor</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.roomDetails?.floor ?? '-'}</Text>
                    </Grid.Col>
                </Grid>
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Room Type</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.roomDetails?.roomType ?? '-'}</Text>
                    </Grid.Col>
                </Grid>
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Food</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.roomDetails?.food ?? '-'}</Text>
                    </Grid.Col>
                </Grid>
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Period Of Residence</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.roomDetails?.periodOfResidence ?? '-'}</Text>
                    </Grid.Col>
                </Grid>
            </Paper>
            <Divider my="sm" />
            <Title order={3}>Period of stay</Title>
            <Paper className="my-6 p-4">
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Arrival At</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.periodOfStay?.arrivalAt ? new Date(guestData.periodOfStay.arrivalAt).toLocaleDateString("en-US") : '-'}</Text>
                    </Grid.Col>
                </Grid>
                <Grid >
                    <Grid.Col span={2}>
                        <Text size="md" color="dimmed">Departure At</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="md">{guestData?.periodOfStay?.departureAt ? new Date(guestData.periodOfStay.departureAt).toLocaleDateString("en-US") : '-'}</Text>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}

export default About
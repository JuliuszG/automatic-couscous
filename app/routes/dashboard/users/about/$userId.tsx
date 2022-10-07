
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Text, Divider, Title, Grid, Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconPencil } from '@tabler/icons';
import { Link } from "@remix-run/react";
import { fetchAboutUserData } from '~/api/user-api.services';

export const loader = async ({params, request}: any) => {
    const res = await fetchAboutUserData(params.userId, request);
    const data = await res.json();
    return json(data)
};

const AboutUser = () => {
    const userData = useLoaderData();
    const data = [
        {
            id: 1,
            title: 'E-mail:',
            name: 'email',
            size: 3
        },
        {
            id: 2,
            title: 'Role:',
            name: 'role',
            size: 9
        },
    ]

    console.log(userData)

    return (
        <div>
            <Group position="apart">
                <Title order={1}>About User</Title>
                <Link to={`../edit/${userData?.id}`}>
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
                        <Text size="md">{userData?.[name]}</Text>
                    </Grid.Col>
                </Grid>
            ))}
        </div>
    )
}

export default AboutUser
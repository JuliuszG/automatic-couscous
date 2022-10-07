import { Button, Divider, Group, Stack, Title } from '@mantine/core';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { IconEdit, IconInfoSquare, IconList, IconPlus, IconSquarePlus } from '@tabler/icons';
import { v4 as uuidv4 } from 'uuid';

type Tab = {

}

type Tabs = {

}




const CustomTabs = ({ userData, title, tabs }: any) => {
    return (
        <Stack justify="center" align="center" className="custom__h-screen">
            {/* <Title order={2}>{title}</Title> */}
            <Title order={2}>User</Title>
            <Divider my="sm" className="w-52" />
            <Group spacing="xl">
                {tabs.map(({ id, title, path, icon, disabled, roles }: any) => {
                    if (!roles.includes(userData.role)) return null
                    return (
                        <Link 
                            key={id} 
                            to={`/dashboard/${path}`} 
                            prefetch="intent">
                            <Button
                                className="h-32 w-32 text-xl"
                                variant="light"
                                disabled={disabled}>
                                <Stack spacing="xs" justify="center" align="center">
                                    {title}
                                    {/* {icon} */}
                                </Stack>
                            </Button>
                        </Link>
                    )
                })}
            </Group>
        </Stack>
    )
}

export default CustomTabs
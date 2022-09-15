import { Outlet } from "@remix-run/react";
import { Box } from '@mantine/core';

export default function Index() {

    return (
        <Box mx="auto">
            <Outlet />
        </Box>

    )

}

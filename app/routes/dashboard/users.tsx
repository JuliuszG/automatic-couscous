import { Box } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function Index() {
    
    return (
        <Box mx="auto">
            <Outlet />
        </Box>
    )
}

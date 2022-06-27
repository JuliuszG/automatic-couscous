import {
    Anchor,
    Box,
    Group,
    LoadingOverlay,
    Mark,
    MediaQuery,
    Paper,
    Title,
} from "@mantine/core";
import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Link, Outlet, useTransition } from "@remix-run/react";
import { getUserData } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
    const userData = await getUserData(request);
    if (userData.token) {
        return redirect("/dashboard", { status: 301 });
    }
    return null;
};

export default function AuthPage() {
    const { submission } = useTransition();
    return (
        <Group align="center" position="center" style={{ height: "100vh" }}>
            <LoadingOverlay visible={!!submission} />
            <Group direction="column" spacing="xl">
                <MediaQuery smallerThan="xs" styles={{ textAlign: "center" }}>
                    <Title order={1}>Welcome to E-Concierge</Title>
                </MediaQuery>
                <MediaQuery smallerThan="xs" styles={{ width: "100%" }}>
                    <Paper
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[9],
                            width: 500,
                        })}
                        shadow="xs"
                        p="xl"
                    >
                        <Box mb="lg">
                            <Anchor component={Link} to="/auth/signin">
                                Sign in
                            </Anchor>{" "}
                            |{" "}
                            <Anchor component={Link} to="/auth/signup">
                                Sign up
                            </Anchor>
                        </Box>

                        <Outlet />
                    </Paper>
                </MediaQuery>
            </Group>
        </Group>
    );
}

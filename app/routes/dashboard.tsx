import {
    AppShell,
    Navbar,
    Header,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Title,
    Transition,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { fetch, json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { MainLinks } from "~/components/navigation/main-links";
import { User } from "~/components/navigation/user";
import { getUserData } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
    const apiEndpoint = process.env.API_ADRESS + "/auth/current-user";
    const userData = await getUserData(request);
    if (!userData.token) {
        return redirect("/auth/signin", { status: 302 });
    }
    const response = await fetch(apiEndpoint, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        return redirect("/auth/signin", { status: 302 });
    }
    return json(data);
};

export default function Dashboard() {
    const currentUser = useLoaderData();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const matches = useMediaQuery("(min-width: 900px)", false);
    useEffect(() => {
        if (matches) {
            setOpened(true);
        }
    }, [matches]);

    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
                <Transition
                    mounted={opened}
                    transition="slide-right"
                    duration={400}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <Navbar
                            p="md"
                            style={{ ...styles }}
                            width={{ sm: 200, lg: 300 }}
                        >
                            <Navbar.Section grow mt="md">
                                <MainLinks />
                            </Navbar.Section>
                            <Navbar.Section>
                                <User email={currentUser.email} />
                            </Navbar.Section>
                        </Navbar>
                    )}
                </Transition>
            }
            header={
                <Header height={70} p="md">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <MediaQuery
                            largerThan="sm"
                            styles={{ display: "none" }}
                        >
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <Title order={1}>
                            <Text size="xl" color="blue">
                                E-Concierge
                            </Text>
                        </Title>
                    </div>
                </Header>
            }
        >
            <Outlet />
        </AppShell>
    );
}

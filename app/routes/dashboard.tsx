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
import { useLoaderData, useLocation, useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MainLinks } from "~/components/navigation/main-links";
import { User } from "~/components/navigation/user";
import { UserProvider, useUserData } from "~/context/user-context";
import { getUserData } from "~/sessions.server";
import HttpStatusCode from "~/utils/enums/httpStatusCodes";

export const loader: LoaderFunction = async ({ request }) => {
    const apiEndpoint = process.env.API_ADRESS + "/auth/current-user";
    const userData = await getUserData(request);
    if (!userData.token) {
        return redirect("/auth/signin", {
            status: HttpStatusCode.UNAUTHORIZED,
        });
    }
    const response = await fetch(apiEndpoint, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        return redirect("/auth/signin", {
            status: HttpStatusCode.UNAUTHORIZED,
        });
    }
    return json({ ...data, token: userData.token });
};

export default function Dashboard() {
    const currentUser = useLoaderData();
    const { pathname } = useLocation();
    const outlet = useOutlet();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState<boolean>(false);
    const matches = useMediaQuery("(min-width: 768px)", false);

    useEffect(() => {
        if (matches) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }, [matches]);

    useEffect(() => {
        if (!matches) {
            setOpened(false);
        }
    }, [pathname]);

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
                            width={{ sm: 250, lg: 300 }}
                        >
                            <Navbar.Section grow mt="md">
                                <MainLinks userValue={currentUser}/>
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
                                onClick={() => setOpened((opened) => !opened)}
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
            <div style={{ overflow: "hidden" }}>
                <UserProvider userValue={currentUser}>
                    <AnimatePresence exitBeforeEnter initial={false}>
                        <motion.div
                            key={pathname}
                            initial={{ y: "-30%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-30%", opacity: 0 }}
                            transition={{ duration: matches ? 0.3 : 0.6 }}
                        >
                            {outlet}
                        </motion.div>
                    </AnimatePresence>
                </UserProvider>
            </div>
        </AppShell>
    );
}

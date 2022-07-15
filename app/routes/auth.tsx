import {
    Anchor,
    Box,
    Group,
    LoadingOverlay,
    MediaQuery,
    Paper,
    Title,
} from "@mantine/core";
import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Link, useLocation, useOutlet, useTransition } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { getUserData } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
    const userData = await getUserData(request);
    if (userData.token) {
        return redirect("/dashboard", { status: 301 });
    }
    return null;
};

export default function AuthPage() {
    const { pathname } = useLocation();
    const outlet = useOutlet();
    const { submission } = useTransition();
    return (
        <Group align="center" position="center" style={{ height: "100vh" }}>
            <LoadingOverlay visible={!!submission} />
            <Group
                direction="column"
                spacing="xl"
                style={{ overflow: "hidden" }}
            >
                <MediaQuery
                    smallerThan="xs"
                    styles={{
                        textAlign: "center",
                    }}
                >
                    <Title order={1}>Welcome to E-Concierge</Title>
                </MediaQuery>
                <MediaQuery smallerThan="xs" styles={{ width: "100%" }}>
                    <Paper
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[9],
                            height: pathname === "/auth/signin" ? 300 : 380,
                            width: 500,
                            maxHeight: 1000,
                            transition: "height 0.2s ease",
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

                        <AnimatePresence exitBeforeEnter initial={false}>
                            <motion.main
                                key={pathname}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                {outlet}
                            </motion.main>
                        </AnimatePresence>
                    </Paper>
                </MediaQuery>
            </Group>
        </Group>
    );
}

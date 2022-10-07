import { Global, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/app.css"
import customStyles from "./styles/custom.css"

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "E-Concierge",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: styles },
        { rel: "stylesheet", href: customStyles },
    ]
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <MantineProvider
                    theme={{ colorScheme: "dark", loader: "bars" }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <NotificationsProvider position="top-right" zIndex={2077}>
                        <ModalsProvider>
                            <Global
                                styles={(theme) => ({
                                    a: {
                                        textDecoration: "none",
                                        color: "inherit",
                                    },
                                })}
                            />
                            <Outlet />
                        </ModalsProvider>
                    </NotificationsProvider>
                </MantineProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}


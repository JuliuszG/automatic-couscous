import React from "react";
import { UserCircle, Users, Messages } from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "@remix-run/react";

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    to: string;
}

function MainLink({ icon, color, label, to }: MainLinkProps) {
    return (
        <Link to={to}>
            <UnstyledButton
                sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[0]
                            : theme.black,

                    "&:hover": {
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                    },
                })}
            >
                <Group>
                    <ThemeIcon color={color} variant="light">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{label}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    );
}

const data = [
    {
        icon: <UserCircle size={16} />,
        color: "blue",
        label: "Employees",
        to: "/dashboard/employees",
    },
    {
        icon: <Users size={16} />,
        color: "teal",
        label: "Clients",
        to: "/dashboard/clients",
    },
    {
        icon: <Messages size={16} />,
        color: "violet",
        label: "Messages",
        to: "/dashboard/messages",
    },
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div>{links}</div>;
}

import React, { useEffect } from "react";
import { UserCircle, Users, Messages, HotelService } from "tabler-icons-react";
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
        label: "User",
        to: "/dashboard/users/menu",
        roles: ['admin', 'user']
    },
    {
        icon: <Users size={16} />,
        color: "teal",
        label: "Guests",
        to: "/dashboard/guests/list",
        roles: ['admin', 'user']
    },
    {
        icon: <Messages size={16} />,
        color: "violet",
        label: "Messages",
        to: "/dashboard/messages",
        roles: ['admin', 'user']
    },
    {
        icon: <HotelService size={16} />,
        color: "orange",
        label: "Hotels",
        to: "/dashboard/hotels/list",
        roles: ['admin', 'user']
    },
];

type Props = {
    userValue: {
        role: string,
        token: string,
        username?: string
    }
}

export function MainLinks({userValue: {role}}: Props) {
    const links = data.map((link) => link.roles.includes(role) ? <MainLink {...link} key={link.label} /> : null);
    return <div>{links}</div>;
}

import React, { forwardRef } from "react";
import {
    ChevronRight,
    MessageCircle,
    Settings,
    Logout,
} from "tabler-icons-react";
import {
    UnstyledButton,
    Group,
    Avatar,
    Text,
    Box,
    useMantineTheme,
    Divider,
    Menu,
} from "@mantine/core";
import { Link, useSubmit } from "@remix-run/react";
import { useMediaQuery } from "@mantine/hooks";
interface UserProps {
    email: string;
    fullName?: string;
    avatar?: string;
}
export function User({ email, fullName, avatar }: UserProps) {
    const theme = useMantineTheme();
    const matches = useMediaQuery("(min-width: 768px)", false);
    const submit = useSubmit();
    function handleSignout() {
        submit(null, { method: "post", action: "/auth/signout" });
    }
    return (
        <Box
            sx={{
                paddingTop: theme.spacing.sm,
                width: "100%",
                borderTop: `1px solid ${
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[2]
                }`,
            }}
        >
            <Menu
                position={matches ? "right" : "top"}
                style={{ width: "100%" }}
                control={
                    <UserButton
                        fullName={fullName}
                        avatar={avatar}
                        email={email}
                    />
                }
            >
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                    component={Link}
                    to="/dashboard/account"
                    icon={<Settings size={14} />}
                >
                    Settings
                </Menu.Item>
                <Menu.Item
                    component={Link}
                    to="/dashboard/messages"
                    icon={<MessageCircle size={14} />}
                >
                    Messages
                </Menu.Item>

                <Divider />

                <Menu.Item
                    onClick={handleSignout}
                    color="red"
                    icon={<Logout size={14} />}
                >
                    <Text>Sign out</Text>
                </Menu.Item>
            </Menu>
        </Box>
    );
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    avatar?: string;
    fullName?: string;
    email?: string;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ avatar, fullName, email, ...others }: UserButtonProps, ref) => (
        <UnstyledButton
            ref={ref}
            {...others}
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
                <Avatar src={avatar} radius="xl" />
                <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {fullName}
                    </Text>
                    <Text color="dimmed" size="xs">
                        {email}
                    </Text>
                </Box>

                <ChevronRight size={18} />
            </Group>
        </UnstyledButton>
    )
);

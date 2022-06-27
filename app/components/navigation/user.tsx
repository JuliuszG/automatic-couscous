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
interface UserProps {
    email: string;
    fullName?: string;
    avatar?: string;
}
export function User({
    email,
    fullName = "Dzidosław Dzida",
    avatar = "data:image/jpeg;base64,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",
}: UserProps) {
    const theme = useMantineTheme();

    return (
        <Box
            sx={{
                paddingTop: theme.spacing.sm,
                borderTop: `1px solid ${
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[2]
                }`,
            }}
        >
            <Menu
                position="right"
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

                <Menu.Item color="red" icon={<Logout size={14} />}>
                    <SignoutButton />
                </Menu.Item>
            </Menu>
        </Box>
    );
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    avatar: string;
    fullName: string;
    email: string;
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

const SignoutButton = () => {
    const submit = useSubmit();
    function handleSignout() {
        submit(null, { method: "post", action: "/auth/signout" });
    }
    return <Text onClick={handleSignout}>Sign out</Text>;
};

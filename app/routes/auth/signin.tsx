import { Button, Stack, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import {
    ActionFunction,
    fetch,
    json,
    LoaderFunction,
    redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import * as Yup from "yup";
import { SignInDto } from "~/dtos/auth/signin.dto";
import { Responses } from "~/responses.server";
import { createUserSession } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
    const apiEndpoint = process.env.API_ADRESS + "/auth/signin";
    const formData = await request.formData();
    const values = JSON.parse(formData.get("data") as string);
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...values,
        }),
    });
    const responseData = await response.json();
    if (!response.ok) {
        return Responses.BAD_REQUEST(responseData);
    }
    return createUserSession(
        responseData.id,
        responseData.access_token,
        "/dashboard"
    );
};

const schema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
});

export default function SignIn() {
    const fetcher = useFetcher();

    const form = useForm({
        schema: yupResolver(schema),
        initialValues: {
            email: "",
            password: "",
        },
    });
    
    const handleSubmit = (body: SignInDto): void => {
        fetcher.submit({ data: JSON.stringify(body) }, { method: "post" });
    };

    return (
        <fetcher.Form
            method="post"
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
            <Stack spacing="xs">
                <TextInput
                    label="E-mail"
                    name="email"
                    {...form.getInputProps("email")}
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    visibilityToggleIcon={({ reveal, size }) =>
                        reveal ? (
                            <EyeOff size={size} />
                        ) : (
                            <EyeCheck size={size} />
                        )
                    }
                    {...form.getInputProps("password")}
                />
                {fetcher.type === "done" &&
                    +fetcher.data.statusCode >= 400 &&
                    +fetcher.data.statusCode < 500 && (
                        <Text size="sm" color="red">
                            Provided credential where incorrect
                        </Text>
                    )}
                <Button type="submit" mt="lg">
                    Sign In
                </Button>
            </Stack>
        </fetcher.Form>
    );
}

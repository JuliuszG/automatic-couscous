import {
    Button,
    Group,
    LoadingOverlay,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import * as Yup from "yup";
import { ActionFunction, fetch, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import { useForm, yupResolver } from "@mantine/form";
import { CreateUserDto } from "~/dtos/auth/create-user.dto";
import { Responses } from "~/responses.server";

export const action: ActionFunction = async ({ request }) => {
    const apiEndpoint = process.env.API_ADRESS + "/users";
    const formData = await request.formData();
    const { email, password } = JSON.parse(formData.get("data") as string);
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        return redirect("auth/signin");
    }
    return Responses.BAD_REQUEST(data);
};

const schema = Yup.object().shape({
    email: Yup.string().required().email("Invalid email"),
    password: Yup.string()
        .required()
        .min(8, "Password should have at least 8 letters"),
    passwordConfirmation: Yup.string()
        .required()
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export default function SignUp() {
    const fetcher = useFetcher();
    const form = useForm({
        schema: yupResolver(schema),
        initialValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const handleSubmit = (body: CreateUserDto): void => {
        fetcher.submit({ data: JSON.stringify(body) }, { method: "post" });
    };

    return (
        <fetcher.Form
            action="post"
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
            <Group grow={true} direction="column" spacing="sm">
                <LoadingOverlay visible={false} />
                <TextInput
                    label="E-mail"
                    required
                    {...form.getInputProps("email")}
                />
                <PasswordInput
                    label="Password"
                    required
                    visibilityToggleIcon={({ reveal, size }) =>
                        reveal ? (
                            <EyeOff size={size} />
                        ) : (
                            <EyeCheck size={size} />
                        )
                    }
                    {...form.getInputProps("password")}
                />
                <PasswordInput
                    label="Repeat password"
                    required
                    visibilityToggleIcon={({ reveal, size }) =>
                        reveal ? (
                            <EyeOff size={size} />
                        ) : (
                            <EyeCheck size={size} />
                        )
                    }
                    {...form.getInputProps("passwordConfirmation")}
                />
                {fetcher.type === "done" &&
                    +fetcher.data.statusCode >= 400 &&
                    +fetcher.data.statusCode < 500 && (
                        <Text size="sm" color="red">
                            {fetcher.data.message}
                        </Text>
                    )}
                <Button type="submit" mt="lg">
                    Sign Up
                </Button>
            </Group>
        </fetcher.Form>
    );
}

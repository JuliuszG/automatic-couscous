import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { signOut } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
    return signOut(request);
};

export const loader: LoaderFunction = async () => {
    return redirect("/");
};

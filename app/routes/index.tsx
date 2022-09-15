import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserData } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
    const userSession = await getUserData(request);
    if (!userSession) {
        return redirect("/auth");
    }
    return redirect("/dashboard");
};

export default function Index() {
    return <h1>Welcome</h1>;
}

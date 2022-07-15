import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: "econcierge_session",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function createUserSession(
    userId: string,
    auth_token: string,
    redirectTo: string
): Promise<Response> {
    const session = await storage.getSession();
    session.set("userId", userId);
    session.set("auth_token", auth_token);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

function getUserSession(request: Request): Promise<Session> {
    return storage.getSession(request.headers.get("Cookie"));
}

interface UserData {
    userId: string;
    token: string;
}

export async function getUserData(request: Request): Promise<UserData> {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    const token = session.get("auth_token");
    return { userId, token };
}

export async function signOut(request: Request): Promise<Response> {
    const session = await getUserSession(request);
    return redirect("/auth/signin", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

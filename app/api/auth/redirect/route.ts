import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3001"));
    }

    const role = session.user.role || "alumno";
    const redirectUrl = new URL(`/dashboard/${role}`, process.env.NEXTAUTH_URL || "http://localhost:3001");

    return NextResponse.redirect(redirectUrl);
}

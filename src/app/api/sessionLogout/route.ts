
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    cookies().set("session", "", { httpOnly: true, secure: true, expires: new Date(0) });
    return NextResponse.json({ status: "success" });
}

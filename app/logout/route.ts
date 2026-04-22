import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete("profile-app-auth");
  return response;
}

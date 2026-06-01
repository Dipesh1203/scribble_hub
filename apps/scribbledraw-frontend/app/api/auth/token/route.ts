import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET } from "@repo/common/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  const hasSecureCookie = request.cookies.has("__Secure-next-auth.session-token");
  const secureCookie = request.nextUrl.protocol === "https:" || hasSecureCookie;

  const token = await getToken({ 
    req: request,
    secret: secret,
    secureCookie: secureCookie
  });
  return NextResponse.json(token);
}

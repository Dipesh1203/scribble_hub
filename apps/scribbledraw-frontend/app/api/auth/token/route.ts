import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET } from "@repo/common/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || JWT_SECRET;
  const token = await getToken({ 
    req: request,
    secret: secret
  });
  return NextResponse.json(token);
}

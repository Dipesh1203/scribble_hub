import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// Middleware to handle authentication and route redirection
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "Dipesh"
  });
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from login/signup pages
  if (token && pathname === "/signin") {
    return NextResponse.redirect(new URL("/room", request.url));
  }
  console.log("Middleware executed. Token:", token, "Pathname:", pathname);

  if (!token && pathname.startsWith("/room")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If none of the conditions match, continue as normal
  return NextResponse.next();
}

// Configuring middleware to apply only to specific routes
export const config = {
  matcher: ["/dashboard", "/signin", "/room/:path*", "/signup", "/canvas/:path*", "/main-canvas/:path*", "/draw/:path*"], // Protect all auth-related and dynamic routes
};

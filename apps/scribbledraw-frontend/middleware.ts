import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { JWT_SECRET } from "@repo/common/server";
export { default } from "next-auth/middleware";

// Middleware to handle authentication and route redirection
export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || JWT_SECRET;
  
  // Debug logging - show which secret is being used
  console.log("DEBUG - Secret sources:", {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? `✓ (${process.env.NEXTAUTH_SECRET.substring(0, 5)}...)` : "✗",
    JWT_SECRET_env: process.env.JWT_SECRET ? `✓ (${process.env.JWT_SECRET.substring(0, 5)}...)` : "✗",
    JWT_SECRET_imported: `✓ (${JWT_SECRET.substring(0, 5)}...)`,
    using: secret ? `${secret.substring(0, 5)}...` : "✗ MISSING",
  });
  
  const cookieValue = request.cookies.get("next-auth.session-token")?.value || request.cookies.get("__Secure-next-auth.session-token")?.value;
  console.log("DEBUG - Cookie exists:", cookieValue ? "✓ Yes" : "✗ No");
  console.log("Secrect ",secret)
  
  const hasSecureCookie = request.cookies.has("__Secure-next-auth.session-token");
  const secureCookie = request.nextUrl.protocol === "https:" || hasSecureCookie;

  const token = await getToken({
    req: request,
    secret: secret,
    secureCookie: secureCookie
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

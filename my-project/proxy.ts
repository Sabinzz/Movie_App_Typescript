import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(pathname);

  // no token + trying to access protected route → kick to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // has token + trying to access login/register → kick to dashboard
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      // token is invalid/expired — let them through to login
      return NextResponse.next();
    }
  }

  // has token + accessing protected route → verify it's valid
  if (isProtectedRoute && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return NextResponse.next(); // valid → let through
    } catch {
      // token expired or tampered → clear cookie + redirect to login
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.set("token", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

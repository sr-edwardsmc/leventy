import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/auth";
import { type TUser } from "./types/users";
import { Role } from "@prisma/client";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/events"];
const authRoutes = ["/login", "/signup"];
const adminRoles = [
  "COLLECTIVE_ADMIN",
  "SYSTEM_ADMIN",
  "COLLECTIVE_MEMBER",
  "PROMOTER",
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // 3. Decrypt the session from the cookie
  const session = (await getSession()) as TUser;

  if (path.includes("/scanner") && session?.role === Role.DOORMAN) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !adminRoles.includes(session?.role)) {
    return NextResponse.redirect(new URL("/events", req.nextUrl));
  }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isAuthRoute && session?.id) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 6. Continue to the next middleware
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

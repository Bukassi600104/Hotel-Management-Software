import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabasePublicEnv } from "@/lib/supabase/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin and CMS routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/cms")) {
    return NextResponse.next();
  }

  // Login page is always publicly accessible — never redirect here
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (!hasSupabasePublicEnv()) {
    return NextResponse.next();
  }

  // Build the Supabase response using the official SSR pattern.
  // The request must be forwarded so cookies set by Supabase are visible
  // to server components on the same render.
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() is the only reliable way to check auth in middleware.
  // Never use getSession() here — it can't be trusted server-side.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — return the Supabase-managed response so session
  // cookies are refreshed on every request automatically.
  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/cms/:path*"],
};

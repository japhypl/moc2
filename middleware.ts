import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const redirect = await checkRedirect(request, pathname);
  if (redirect) return redirect;

  return await updateSession(request);
}

async function checkRedirect(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data } = await supabase
    .from("redirects")
    .select("target_path, status_code")
    .eq("source_path", pathname)
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const url = request.nextUrl.clone();
  url.pathname = data.target_path;
  return NextResponse.redirect(url, data.status_code);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

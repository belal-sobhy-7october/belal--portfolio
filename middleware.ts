import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-middleware"

const ADMIN_PREFIX = "/manage-portal"
const LOGIN_PATH = `${ADMIN_PREFIX}/login`

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabase, supabaseResponse } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = pathname === LOGIN_PATH

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = ADMIN_PREFIX
    return NextResponse.redirect(url)
  }

  supabaseResponse.headers.set("x-pathname", pathname)
  return supabaseResponse
}

export const config = {
  matcher: ["/manage-portal", "/manage-portal/:path*"],
}

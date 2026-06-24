import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.from("profile_settings").select("id").limit(1)
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

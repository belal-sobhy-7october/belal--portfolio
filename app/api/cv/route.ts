import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

const CV_BUCKET = "cv-files"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("cv_files")
      .select("*")
      .order("uploaded_at", { ascending: false })

    if (error) {
      console.error("GET /api/cv error:", error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    console.error("GET /api/cv exception:", message)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Please select a file." }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 })
    }

    const fileName = `Belal-Sobhy-CV.pdf`
    const filePath = `${Date.now()}-${fileName}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage.from(CV_BUCKET).upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    })

    if (uploadError) {
      console.error("POST /api/cv upload error:", uploadError.message)
      return NextResponse.json({ error: "Failed to upload file." }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from(CV_BUCKET).getPublicUrl(filePath)
    const fileUrl = publicUrlData.publicUrl

    await supabase.from("cv_files").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    const { data: inserted, error: insertError } = await supabase
      .from("cv_files")
      .insert({ file_url: fileUrl, file_name: fileName })
      .select()
      .single()

    if (insertError) {
      console.error("POST /api/cv insert error:", insertError.message)
      return NextResponse.json({ error: "Failed to save CV record." }, { status: 500 })
    }

    return NextResponse.json(inserted, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    console.error("POST /api/cv exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

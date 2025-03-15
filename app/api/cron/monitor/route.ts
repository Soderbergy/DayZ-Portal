import { type NextRequest, NextResponse } from "next/server"
import { monitorServers } from "@/lib/server-monitor"

export async function GET(request: NextRequest) {
  // Check for a secret key to prevent unauthorized access
  const authHeader = request.headers.get("authorization")

  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await monitorServers()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in monitor endpoint:", error)
    return NextResponse.json({ error: "Failed to run monitoring job" }, { status: 500 })
  }
}


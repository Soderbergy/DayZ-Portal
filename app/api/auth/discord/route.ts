import { NextResponse } from "next/server"

// This is a placeholder for the Discord OAuth route
// In a real implementation, you would use NextAuth.js or a similar library
export async function GET() {
  // Redirect to the dashboard for demo purposes
  // In a real implementation, this would redirect to Discord OAuth
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
}


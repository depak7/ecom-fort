import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"
import { authOptions } from "@/lib/auth"

export async function withAuth(handler: Function) {
  return async (request: NextRequestWithAuth) => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return handler(request, session)
  }
}
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return handler(req, res, session);
  };
}
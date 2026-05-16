import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { demoAuditLog } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(demoAuditLog);
  }

  try {
    const pool = (await import("../../lib/db")).default;
    const [rows] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT log_id, action_type, table_name, description, logged_at
       FROM auditlog
       ORDER BY logged_at DESC
       LIMIT 50`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/auditlog] DB error:", err);
    return NextResponse.json(demoAuditLog);
  }
}

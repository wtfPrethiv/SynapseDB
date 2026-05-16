import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT log_id, action_type, table_name, description, logged_at
       FROM auditlog
       ORDER BY logged_at DESC
       LIMIT 50`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/auditlog] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

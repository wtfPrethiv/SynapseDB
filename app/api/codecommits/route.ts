import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT commit_id, commit_hash, branch FROM codecommits ORDER BY commit_id DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/codecommits] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

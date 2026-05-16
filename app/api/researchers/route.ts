import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT researcher_id, name, email, institution FROM researchers ORDER BY name ASC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/researchers] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

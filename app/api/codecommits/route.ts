import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { demoCommits } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(demoCommits);
  }

  try {
    const pool = (await import("../../lib/db")).default;
    const [rows] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT commit_id, commit_hash, branch FROM codecommits ORDER BY commit_id DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/codecommits] DB error:", err);
    return NextResponse.json(demoCommits);
  }
}

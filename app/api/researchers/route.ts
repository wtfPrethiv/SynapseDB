import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { demoResearchers } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(demoResearchers);
  }

  try {
    const pool = (await import("../../lib/db")).default;
    const [rows] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT researcher_id, name, email, institution FROM researchers ORDER BY name ASC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/researchers] DB error:", err);
    return NextResponse.json(demoResearchers);
  }
}

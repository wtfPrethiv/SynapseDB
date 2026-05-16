import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [datasets] = await pool.query<RowDataPacket[]>(`
      SELECT
        d.dataset_id,
        d.dataset_name,
        d.version_tag,
        COUNT(e.experiment_id) AS usage_count
      FROM datasets d
      LEFT JOIN experiments e ON d.dataset_id = e.dataset_id
      GROUP BY d.dataset_id, d.dataset_name, d.version_tag
      ORDER BY usage_count DESC
    `);

    // Dataset usage by experiment (for the table)
    const [usageByExperiment] = await pool.query<RowDataPacket[]>(`
      SELECT
        e.experiment_id,
        e.experiment_name,
        e.status,
        d.dataset_name,
        d.version_tag,
        r.name AS researcher_name
      FROM experiments e
      JOIN datasets     d ON e.dataset_id     = d.dataset_id
      JOIN researchers  r ON e.researcher_id  = r.researcher_id
      ORDER BY e.experiment_id DESC
    `);

    return NextResponse.json({ datasets, usageByExperiment });
  } catch (err) {
    console.error("[/api/datasets] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

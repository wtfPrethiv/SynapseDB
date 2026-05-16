import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Main experiment detail with JOINs
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        e.experiment_id,
        e.experiment_name,
        e.random_seed,
        e.status,
        r.name        AS researcher_name,
        r.email       AS researcher_email,
        r.institution AS researcher_institution,
        h.gpu_type,
        h.cuda_version,
        c.commit_hash,
        c.branch,
        d.dataset_name,
        d.version_tag
      FROM experiments e
      JOIN researchers        r  ON e.researcher_id = r.researcher_id
      JOIN hardwareconfigs h  ON e.hardware_id   = h.hardware_id
      JOIN codecommits        c  ON e.commit_id      = c.commit_id
      JOIN datasets           d  ON e.dataset_id     = d.dataset_id
      WHERE e.experiment_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // All metrics for this experiment
    const [metrics] = await pool.query<RowDataPacket[]>(
      `SELECT result_id, metric_name, metric_value
       FROM results
       WHERE experiment_id = ?`,
      [id]
    );

    return NextResponse.json({ experiment: rows[0], metrics });
  } catch (err) {
    console.error(`[/api/experiments/${id}] DB error:`, err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

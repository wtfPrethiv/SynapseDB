import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoExperimentsList } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(getDemoExperimentsList());
  }

  try {
    const pool = (await import("../../lib/db")).default;

    const [rows] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        e.experiment_id,
        e.experiment_name,
        e.random_seed,
        e.status,
        r.researcher_id,
        r.name        AS researcher_name,
        r.email       AS researcher_email,
        r.institution AS researcher_institution,
        h.hardware_id,
        h.gpu_type,
        h.cuda_version,
        c.commit_id,
        c.commit_hash,
        c.branch,
        d.dataset_id,
        d.dataset_name,
        d.version_tag,
        MAX(CASE WHEN res.metric_name = 'accuracy' THEN res.metric_value END) AS accuracy,
        MAX(CASE WHEN res.metric_name = 'loss'     THEN res.metric_value END) AS loss
      FROM experiments e
      JOIN researchers       r ON e.researcher_id = r.researcher_id
      JOIN hardwareconfigs h ON e.hardware_id   = h.hardware_id
      JOIN codecommits        c ON e.commit_id      = c.commit_id
      JOIN datasets           d ON e.dataset_id     = d.dataset_id
      LEFT JOIN results       res ON e.experiment_id = res.experiment_id
      GROUP BY
        e.experiment_id, e.experiment_name, e.random_seed, e.status,
        r.researcher_id, r.name, r.email, r.institution,
        h.hardware_id, h.gpu_type, h.cuda_version,
        c.commit_id, c.commit_hash, c.branch,
        d.dataset_id, d.dataset_name, d.version_tag
      ORDER BY e.experiment_id DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/experiments] DB error:", err);
    return NextResponse.json(getDemoExperimentsList());
  }
}

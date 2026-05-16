import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoExperimentDetail } from "../../../lib/demoData";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    const data = getDemoExperimentDetail(Number(id));
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  try {
    const pool = (await import("../../../lib/db")).default;

    const [rows] = await pool.query<import("mysql2").RowDataPacket[]>(
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

    const [metrics] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT result_id, metric_name, metric_value
       FROM results
       WHERE experiment_id = ?`,
      [id]
    );

    return NextResponse.json({ experiment: rows[0], metrics });
  } catch (err) {
    console.error(`[/api/experiments/${id}] DB error:`, err);
    const data = getDemoExperimentDetail(Number(id));
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }
}

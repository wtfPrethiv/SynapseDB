import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoDatasetsData } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(getDemoDatasetsData());
  }

  try {
    const pool = (await import("../../lib/db")).default;

    const [datasets] = await pool.query<import("mysql2").RowDataPacket[]>(`
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

    const [usageByExperiment] = await pool.query<import("mysql2").RowDataPacket[]>(`
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
    return NextResponse.json(getDemoDatasetsData());
  }
}

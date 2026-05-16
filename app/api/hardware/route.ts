import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoHardwareData } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(getDemoHardwareData());
  }

  try {
    const pool = (await import("../../lib/db")).default;

    const [stats] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        h.hardware_id,
        h.gpu_type,
        h.cuda_version,
        COUNT(e.experiment_id) AS experiment_count
      FROM hardwareconfigs h
      LEFT JOIN experiments e ON h.hardware_id = e.hardware_id
      GROUP BY h.hardware_id, h.gpu_type, h.cuda_version
      ORDER BY experiment_count DESC
    `);

    const [assignments] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        e.experiment_id,
        e.experiment_name,
        e.status,
        h.gpu_type,
        h.cuda_version,
        r.name AS researcher_name,
        al.logged_at
      FROM experiments e
      JOIN hardwareconfigs h  ON e.hardware_id   = h.hardware_id
      JOIN researchers        r  ON e.researcher_id = r.researcher_id
      LEFT JOIN auditlog      al ON al.table_name = 'experiments'
      GROUP BY e.experiment_id, e.experiment_name, e.status, h.gpu_type, h.cuda_version, r.name, al.logged_at
      ORDER BY e.experiment_id DESC
      LIMIT 8
    `);

    return NextResponse.json({ stats, assignments });
  } catch (err) {
    console.error("[/api/hardware] DB error:", err);
    return NextResponse.json(getDemoHardwareData());
  }
}

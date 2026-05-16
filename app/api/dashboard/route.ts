import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoDashboard } from "../../lib/demoData";

export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const isDemo = !session || url.searchParams.get("demo") === "true";

  if (isDemo) {
    return NextResponse.json(getDemoDashboard());
  }

  // Authenticated — query real database
  try {
    const pool = (await import("../../lib/db")).default;


    const [[{ totalExperiments }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(*) AS totalExperiments FROM experiments"
    );

    const [[{ activeResearchers }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(DISTINCT researcher_id) AS activeResearchers FROM experiments"
    );

    const [[{ sotaModels }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT COUNT(DISTINCT experiment_id) AS sotaModels
       FROM results
       WHERE metric_name = 'accuracy' AND metric_value > 0.9`
    );

    const [[{ missingSeeds }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(*) AS missingSeeds FROM experiments WHERE random_seed = 0"
    );

    const [recentActivity] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        e.experiment_id,
        e.experiment_name,
        e.status,
        r.name                AS researcher_name,
        h.gpu_type,
        MAX(al.logged_at)     AS created_at
      FROM experiments e
      JOIN researchers     r  ON e.researcher_id = r.researcher_id
      JOIN hardwareconfigs h  ON e.hardware_id   = h.hardware_id
      LEFT JOIN auditlog   al ON al.table_name = 'experiments'
      GROUP BY e.experiment_id, e.experiment_name, e.status, r.name, h.gpu_type
      ORDER BY e.experiment_id DESC
      LIMIT 5
    `);

    const [performanceMetrics] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        e.experiment_id,
        e.experiment_name,
        MAX(CASE WHEN res.metric_name = 'accuracy' THEN res.metric_value END) AS accuracy,
        MAX(CASE WHEN res.metric_name = 'loss'     THEN res.metric_value END) AS loss
      FROM experiments e
      JOIN results res ON e.experiment_id = res.experiment_id
      WHERE e.status = 'Completed'
      GROUP BY e.experiment_id, e.experiment_name
      ORDER BY e.experiment_id ASC
      LIMIT 10
    `);

    const [hardwareStats] = await pool.query<import("mysql2").RowDataPacket[]>(`
      SELECT
        h.gpu_type,
        COUNT(e.experiment_id) AS count
      FROM hardwareconfigs h
      LEFT JOIN experiments e ON h.hardware_id = e.hardware_id
      GROUP BY h.hardware_id, h.gpu_type
      ORDER BY count DESC
    `);

    const [[{ completedCount }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(*) AS completedCount FROM experiments WHERE status = 'Completed'"
    );
    const [[{ failedCount }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      "SELECT COUNT(*) AS failedCount FROM experiments WHERE status = 'Failed'"
    );
    const [[{ avgAccuracy }]] = await pool.query<import("mysql2").RowDataPacket[]>(
      `SELECT AVG(metric_value) AS avgAccuracy
       FROM results WHERE metric_name = 'accuracy' AND metric_value > 0`
    );

    return NextResponse.json({
      kpi: { totalExperiments, activeResearchers, sotaModels, missingSeeds },
      recentActivity,
      performanceMetrics,
      hardwareStats,
      summary: {
        completedCount,
        failedCount,
        avgAccuracy: avgAccuracy ? Number(avgAccuracy) : 0,
      },
    });
  } catch (err) {
    console.error("[/api/dashboard] DB error:", err);
    // Fallback to demo data if DB is unavailable
    return NextResponse.json(getDemoDashboard());
  }
}

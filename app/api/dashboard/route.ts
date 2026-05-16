import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    // KPI: total experiments
    const [[{ totalExperiments }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS totalExperiments FROM experiments"
    );

    // KPI: active researchers (those with at least one experiment)
    const [[{ activeResearchers }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(DISTINCT researcher_id) AS activeResearchers FROM experiments"
    );

    // KPI: SOTA models (accuracy > 0.9)
    const [[{ sotaModels }]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT experiment_id) AS sotaModels
       FROM results
       WHERE metric_name = 'accuracy' AND metric_value > 0.9`
    );

    // KPI: missing seeds (random_seed = 0)
    const [[{ missingSeeds }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS missingSeeds FROM experiments WHERE random_seed = 0"
    );

    // Recent activity — last 5 experiments (one row per experiment, no duplicates)
    const [recentActivity] = await pool.query<RowDataPacket[]>(`
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

    // Performance metrics for line chart
    const [performanceMetrics] = await pool.query<RowDataPacket[]>(`
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

    // Hardware distribution for bar chart
    const [hardwareStats] = await pool.query<RowDataPacket[]>(`
      SELECT
        h.gpu_type,
        COUNT(e.experiment_id) AS count
      FROM hardwareconfigs h
      LEFT JOIN experiments e ON h.hardware_id = e.hardware_id
      GROUP BY h.hardware_id, h.gpu_type
      ORDER BY count DESC
    `);

    // Aggregate counts for bottom summary
    const [[{ completedCount }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS completedCount FROM experiments WHERE status = 'Completed'"
    );
    const [[{ failedCount }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS failedCount FROM experiments WHERE status = 'Failed'"
    );
    const [[{ avgAccuracy }]] = await pool.query<RowDataPacket[]>(
      `SELECT AVG(metric_value) AS avgAccuracy
       FROM results WHERE metric_name = 'accuracy' AND metric_value > 0`
    );

    return NextResponse.json({
      kpi: {
        totalExperiments,
        activeResearchers,
        sotaModels,
        missingSeeds,
      },
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
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

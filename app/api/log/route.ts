import { NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "../../lib/db";
import type { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required. Sign in to log experiments." },
      { status: 401 }
    );
  }

  let body: {
    experimentName: string;
    researcherId: number;
    hardwareId: number;
    commitId: number;
    datasetId: number;
    randomSeed: number;
    accuracy: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { experimentName, researcherId, hardwareId, commitId, datasetId, randomSeed, accuracy } = body;

  if (!experimentName || !researcherId || !hardwareId || !commitId || !datasetId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert into experiments
    const [expResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO experiments (researcher_id, hardware_id, commit_id, dataset_id, experiment_name, random_seed, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Running')`,
      [researcherId, hardwareId, commitId, datasetId, experimentName, randomSeed ?? 0]
    );
    const newExperimentId = expResult.insertId;

    // 2. Insert accuracy metric into results
    await conn.query(
      `INSERT INTO results (experiment_id, metric_name, metric_value) VALUES (?, 'accuracy', ?)`,
      [newExperimentId, accuracy ?? 0]
    );

    // 3. Write to auditlog
    await conn.query(
      `INSERT INTO auditlog (action_type, table_name, description)
       VALUES ('INSERT', 'experiments', ?)`,
      [`New experiment #${newExperimentId} "${experimentName}" logged via dashboard by ${session.user?.name || session.user?.email}`]
    );

    await conn.commit();

    return NextResponse.json({ success: true, experimentId: newExperimentId }, { status: 201 });
  } catch (err) {
    await conn.rollback();
    console.error("[/api/log] Transaction failed, rolled back:", err);
    return NextResponse.json({ error: "Transaction failed — rolled back" }, { status: 500 });
  } finally {
    conn.release();
  }
}

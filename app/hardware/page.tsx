"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import DemoBanner from "../components/DemoBanner";
import HardwareChart from "../components/charts/HardwareChart";
import { Cpu, Loader2 } from "lucide-react";

interface HardwareStat {
  hardware_id: number;
  gpu_type: string;
  cuda_version: string;
  experiment_count: number;
}

interface Assignment {
  experiment_id: number;
  experiment_name: string;
  status: string;
  gpu_type: string;
  cuda_version: string;
  researcher_name: string;
}

export default function HardwarePage() {
  const [stats, setStats] = useState<HardwareStat[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo") === "true";
  const isDemo = demoParam || status === "unauthenticated";

  useEffect(() => {
    if (status === "loading" && !demoParam) return;
    const url = isDemo ? "/api/hardware?demo=true" : "/api/hardware";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats ?? []);
        setAssignments(data.assignments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, isDemo, demoParam]);

  const totalExperiments = stats.reduce((sum, h) => sum + Number(h.experiment_count), 0);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container page-enter" style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
        {isDemo && <DemoBanner />}
        <div className="page-header">
          <div className="breadcrumb">
            <Link href="/dashboard">synapsedb</Link>
            <span className="breadcrumb-sep">/</span>
            <span>hardware</span>
          </div>
          <h1 className="page-title">Hardware Registry</h1>
          <p className="page-sub">GPU inventory and experiment load distribution across all compute resources.</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "var(--ink-4)" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <>
            <div className="grid-2 mb-8">
              <div>
                <HardwareChart data={stats.map(h => ({ gpu_type: h.gpu_type, count: Number(h.experiment_count) }))} />
              </div>

              <div>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>GPU Type</th>
                        <th>Experiments</th>
                        <th>Load Share</th>
                        <th>CUDA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((h) => (
                        <tr key={h.hardware_id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Cpu size={14} color="var(--accent)" />
                              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{h.gpu_type}</span>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                            {h.experiment_count}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                                <div
                                  style={{
                                    width: `${totalExperiments > 0 ? (Number(h.experiment_count) / totalExperiments) * 100 : 0}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                                    borderRadius: "2px",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: "36px" }}>
                                {totalExperiments > 0 ? ((Number(h.experiment_count) / totalExperiments) * 100).toFixed(0) : 0}%
                              </span>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--ink-4)" }}>
                            {h.cuda_version}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <div className="section-header mb-4">
                <div className="section-title">Recent Hardware Assignments</div>
              </div>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Experiment</th>
                      <th>GPU</th>
                      <th>CUDA</th>
                      <th>Researcher</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((e) => (
                      <tr key={e.experiment_id} style={{ cursor: "pointer" }} onClick={() => window.location.href = `/experiment/${e.experiment_id}`}>
                        <td>
                          <div className="exp-name">{e.experiment_name}</div>
                          <div className="exp-id">EXP-{String(e.experiment_id).padStart(3, "0")}</div>
                        </td>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {e.gpu_type.replace("NVIDIA ", "")}
                        </td>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--ink-4)" }}>
                          {e.cuda_version}
                        </td>
                        <td>
                          <div className="avatar-chip">
                            <div className="avatar-chip-dot">
                              {e.researcher_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span>{e.researcher_name.split(" ").slice(-1)[0]}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

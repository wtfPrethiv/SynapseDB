"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import DemoBanner from "../components/DemoBanner";
import { Database, BarChart3, Tag, Loader2 } from "lucide-react";

interface Dataset {
  dataset_id: number;
  dataset_name: string;
  version_tag: string;
  usage_count: number;
}

interface UsageRow {
  experiment_id: number;
  experiment_name: string;
  status: string;
  dataset_name: string;
  version_tag: string;
  researcher_name: string;
}

function DatasetsPageInner() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [usageByExperiment, setUsageByExperiment] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo") === "true";
  const isDemo = demoParam || status === "unauthenticated";

  useEffect(() => {
    if (status === "loading" && !demoParam) return;
    const url = isDemo ? "/api/datasets?demo=true" : "/api/datasets";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setDatasets(data.datasets ?? []);
        setUsageByExperiment(data.usageByExperiment ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, isDemo, demoParam]);

  const maxUsage = Math.max(...datasets.map((d) => Number(d.usage_count)), 1);
  const colors = ["#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
        {isDemo && <DemoBanner />}
        <div className="page-header">
          <div className="breadcrumb">
            <Link href="/dashboard">synapsedb</Link>
            <span className="breadcrumb-sep">/</span>
            <span>datasets</span>
          </div>
          <h1 className="page-title">Dataset Registry</h1>
          <p className="page-sub">Versioned dataset catalog used across all experiment runs.</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "var(--ink-4)" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <>
            <div className="grid-3 mb-8">
              {datasets.map((d, i) => {
                const c = colors[i % colors.length];
                return (
                  <div
                    key={d.dataset_id}
                    className="card"
                    style={{ border: `1px solid ${c}20`, cursor: "default" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Database size={18} color={c} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{d.dataset_name}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: c }}>{d.version_tag}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                        <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <BarChart3 size={12} /> Experiment Uses
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", color: c, fontWeight: 700 }}>{d.usage_count}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                        <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Tag size={12} /> Tag
                        </span>
                        <span className="badge" style={{ background: `${c}12`, color: c, border: `1px solid ${c}30` }}>
                          {d.dataset_name}-{d.version_tag}
                        </span>
                      </div>
                    </div>

                    {/* Usage bar */}
                    <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Usage</span>
                        <span style={{ fontSize: "0.7rem", color: c, fontFamily: "var(--font-mono)" }}>{d.usage_count} runs</span>
                      </div>
                      <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${(Number(d.usage_count) / maxUsage) * 100}%`, height: "100%", background: c, borderRadius: "2px" }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="section-header mb-4">
                <div className="section-title">Dataset Usage by Experiment</div>
              </div>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Experiment</th>
                      <th>Dataset</th>
                      <th>Version</th>
                      <th>Researcher</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageByExperiment.map((e) => (
                      <tr key={e.experiment_id} style={{ cursor: "pointer" }} onClick={() => window.location.href = `/experiment/${e.experiment_id}`}>
                        <td>
                          <div className="exp-name">{e.experiment_name}</div>
                          <div className="exp-id">EXP-{String(e.experiment_id).padStart(3, "0")}</div>
                        </td>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-2)" }}>{e.dataset_name}</td>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>{e.version_tag}</td>
                        <td>
                          <div className="avatar-chip">
                            <div className="avatar-chip-dot">
                              {e.researcher_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span>{e.researcher_name.split(" ").slice(-1)[0]}</span>
                          </div>
                        </td>
                        <td><span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
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

export default function DatasetsPage() {
  return (
    <Suspense>
      <DatasetsPageInner />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import DemoBanner from "../../components/DemoBanner";
import ProvenanceGraph from "../../components/ProvenanceGraph";
import { Clock, Cpu, Hash, Activity, ArrowLeft, CheckCircle, XCircle, Timer, AlertCircle, Loader2 } from "lucide-react";

interface ExperimentDetail {
  experiment_id: number;
  experiment_name: string;
  random_seed: number;
  status: string;
  researcher_name: string;
  researcher_email: string;
  researcher_institution: string;
  gpu_type: string;
  cuda_version: string;
  commit_hash: string;
  branch: string;
  dataset_name: string;
  version_tag: string;
}

interface Metric {
  result_id: number;
  metric_name: string;
  metric_value: number;
}

interface AuditEntry {
  log_id: number;
  action_type: string;
  table_name: string;
  description: string;
  logged_at: string;
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "Completed") return <CheckCircle size={15} color="var(--success)" />;
  if (status === "Failed") return <XCircle size={15} color="var(--danger)" />;
  if (status === "Running") return <Timer size={15} color="var(--running)" />;
  return <AlertCircle size={15} color="var(--warning)" />;
}

export default function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exp, setExp] = useState<ExperimentDetail | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo") === "true";
  const isDemo = demoParam || status === "unauthenticated";

  useEffect(() => {
    if (status === "loading" && !demoParam) return;
    const demoSuffix = isDemo ? "?demo=true" : "";
    Promise.all([
      fetch(`/api/experiments/${id}${demoSuffix}`).then((r) => r.json()),
      fetch(`/api/auditlog${demoSuffix}`).then((r) => r.json()),
    ]).then(([expData, auditData]) => {
      if (expData.error === "Not found") { setNotFound(true); setLoading(false); return; }
      setExp(expData.experiment);
      setMetrics(expData.metrics ?? []);
      setAuditLog(Array.isArray(auditData) ? auditData.slice(0, 6) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, status, isDemo, demoParam]);

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", padding: "6rem", color: "var(--ink-4)" }}>
          <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  if (notFound || !exp) {
    return (
      <div className="app-layout">
        <Navbar />
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
          Experiment #{id} not found.
        </div>
      </div>
    );
  }

  const accuracy = metrics.find((m) => m.metric_name === "accuracy")?.metric_value;
  const loss = metrics.find((m) => m.metric_name === "loss")?.metric_value;
  const otherMetrics = metrics.filter((m) => m.metric_name !== "accuracy" && m.metric_name !== "loss");

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
  };

  const configs = [
    { label: "CUDA Version", value: exp.cuda_version, icon: Cpu },
    { label: "Random Seed", value: String(exp.random_seed), icon: Hash },
    { label: "Researcher", value: exp.researcher_name, icon: Activity },
    { label: "Institution", value: exp.researcher_institution, icon: Activity },
    { label: "Branch", value: exp.branch, icon: Hash },
    { label: "Commit Hash", value: exp.commit_hash, icon: Timer },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>

        {isDemo && <DemoBanner />}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <Link
            href="/experiments"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              fontSize: "0.75rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)",
              marginBottom: "0.6rem", textDecoration: "none",
            }}
          >
            <ArrowLeft size={12} /> Back to Experiments
          </Link>
          <div className="breadcrumb">
            <Link href="/dashboard">synapsedb</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href={isDemo ? "/experiments?demo=true" : "/experiments"}>experiments</Link>
            <span className="breadcrumb-sep">/</span>
            <span>EXP-{String(exp.experiment_id).padStart(3, "0")}</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="detail-header mb-6">
          <div className="detail-avatar">
            {exp.researcher_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <h1 className="detail-name">{exp.experiment_name}</h1>
                <div className="detail-meta">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Cpu size={11} />{exp.gpu_type}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={11} />{exp.researcher_email}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <StatusIcon status={exp.status} />
                <StatusBadge status={exp.status} />
              </div>
            </div>

            {/* Metric strip */}
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
              {[
                { label: "Accuracy", value: accuracy != null && accuracy > 0 ? (Number(accuracy) * 100).toFixed(2) + "%" : "N/A" },
                { label: "Loss", value: loss != null && loss > 0 && loss < 9 ? Number(loss).toFixed(4) : "N/A" },
                { label: "Dataset", value: `${exp.dataset_name} ${exp.version_tag}` },
                { label: "Commit", value: exp.commit_hash, mono: true },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: "0.67rem", color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem", fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)", fontFamily: m.mono ? "var(--font-mono)" : "inherit" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Config + All Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem", marginBottom: "1.25rem" }}>
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <div className="section-header"><div className="section-title">Configuration</div></div>
            <div className="config-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {configs.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="config-item">
                    <div className="config-item-label">
                      <Icon size={10} color="var(--ink-4)" />{c.label}
                    </div>
                    <div className="config-item-value" style={{ fontFamily: c.label === "Commit Hash" ? "var(--font-mono)" : "inherit" }}>
                      {c.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <div className="section-header"><div className="section-title">All Metrics</div></div>
            <div className="card" style={{ height: "calc(100% - 38px)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Metric", "Value"].map((h) => (
                      <th key={h} style={{ textAlign: h === "Value" ? "right" : "left", fontSize: "0.67rem", color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", paddingBottom: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.result_id}>
                      <td style={{ padding: "0.45rem 0", fontSize: "0.78rem", color: "var(--ink-4)", borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>{m.metric_name}</td>
                      <td style={{ padding: "0.45rem 0", fontSize: "0.8rem", color: "var(--ink)", borderTop: "1px solid var(--border)", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {Number(m.metric_value).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                  {metrics.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: "1rem 0", fontSize: "0.78rem", color: "var(--ink-4)", textAlign: "center" }}>No metrics recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Provenance DAG */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <div className="section-header mb-4">
            <div>
              <div className="section-title">Provenance Graph</div>
              <div className="section-sub">Full lineage DAG — how this experiment was constructed</div>
            </div>
          </div>
          <ProvenanceGraph
            experimentName={exp.experiment_name}
            datasetTag={`${exp.dataset_name} ${exp.version_tag}`}
            codeCommit={exp.commit_hash}
            gpuType={exp.gpu_type}
          />
        </motion.div>

        {/* Audit trail */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" style={{ marginTop: "1.25rem" }}>
          <div className="section-header mb-4">
            <div>
              <div className="section-title">Audit Trail</div>
              <div className="section-sub">Immutable log of all actions recorded in the system</div>
            </div>
          </div>
          <div className="card" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            {auditLog.length > 0 ? auditLog.map((log, i) => (
              <div key={log.log_id} style={{ display: "flex", gap: "1rem", padding: "0.7rem 0", borderBottom: i < auditLog.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
                <span style={{ color: "var(--ink-4)", flexShrink: 0, fontSize: "0.68rem" }}>
                  {new Date(log.logged_at).toLocaleTimeString()}
                </span>
                <span style={{ color: "var(--success)", fontWeight: 600, flexShrink: 0, minWidth: "120px", fontSize: "0.72rem" }}>
                  {log.action_type}
                </span>
                <span style={{ color: "var(--ink-4)", flexShrink: 0, minWidth: "90px", fontSize: "0.68rem" }}>
                  [{log.table_name}]
                </span>
                <span style={{ color: "var(--ink-3)", fontSize: "0.72rem" }}>{log.description}</span>
              </div>
            )) : (
              <div style={{ padding: "1.5rem 0", color: "var(--ink-4)", textAlign: "center" }}>No audit entries found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import PerformanceChart from "../components/charts/PerformanceChart";
import HardwareChart from "../components/charts/HardwareChart";
import { FlaskConical, Users, Trophy, AlertTriangle, ArrowRight, Clock, Cpu, Loader2 } from "lucide-react";

interface DashboardData {
  kpi: {
    totalExperiments: number;
    activeResearchers: number;
    sotaModels: number;
    missingSeeds: number;
  };
  recentActivity: Array<{
    experiment_id: number;
    experiment_name: string;
    status: string;
    researcher_name: string;
    gpu_type: string;
    created_at: string | null;
  }>;
  performanceMetrics: Array<{
    experiment_id: number;
    experiment_name: string;
    accuracy: number | null;
    loss: number | null;
  }>;
  hardwareStats: Array<{ gpu_type: string; count: number }>;
  summary: { completedCount: number; failedCount: number; avgAccuracy: number };
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

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

  if (error || !data) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="container" style={{ paddingTop: "4rem", textAlign: "center", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
          ⚠️ Could not connect to database. Check your MySQL connection.
        </div>
      </div>
    );
  }

  const { kpi, recentActivity, performanceMetrics, hardwareStats, summary } = data;

  const kpis = [
    { label: "Total Experiments", value: kpi.totalExperiments, icon: FlaskConical, iconBg: "#f4f4f0", warning: false, sub: undefined },
    { label: "Active Researchers", value: kpi.activeResearchers, icon: Users, iconBg: "#f4f4f0", warning: false, sub: undefined },
    { label: "SOTA Models", value: kpi.sotaModels, icon: Trophy, iconBg: "#edfaf3", warning: false, sub: "Accuracy > 90%" },
    { label: "Missing Seeds", value: kpi.missingSeeds, icon: AlertTriangle, iconBg: "#fef9ed", warning: true, sub: "Reproducibility risk" },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>

        {/* Page header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="breadcrumb">
            <span>nexus</span>
            <span className="breadcrumb-sep">/</span>
            <span>dashboard</span>
          </div>
          <h1 className="page-title">Lab Overview</h1>
          <p className="page-sub">Real-time snapshot of experiment activity and system health.</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div className="grid-4 mb-8" variants={stagger} initial="hidden" animate="visible">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                className={`kpi-card${kpi.warning ? " kpi-card--warning" : ""}`}
                variants={fadeUp}
              >
                <div className="kpi-icon" style={{ background: kpi.iconBg }}>
                  <Icon size={16} color="var(--ink-2)" />
                </div>
                <div>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value">{kpi.value}</div>
                  {kpi.sub && <div className="kpi-sub">{kpi.sub}</div>}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid-2 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
        >
          <PerformanceChart data={performanceMetrics} />
          <HardwareChart data={hardwareStats} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
        >
          <div className="section-header">
            <div>
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-sub">5 most recently logged runs</p>
            </div>
            <Link
              href="/experiments"
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-3)", textDecoration: "none" }}
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Experiment</th>
                  <th>Researcher</th>
                  <th>GPU</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((exp) => (
                  <tr
                    key={exp.experiment_id}
                    style={{ cursor: "pointer" }}
                    onClick={() => { window.location.href = `/experiment/${exp.experiment_id}`; }}
                  >
                    <td>
                      <div className="exp-name">{exp.experiment_name}</div>
                      <div className="exp-id">EXP-{String(exp.experiment_id).padStart(3, "0")}</div>
                    </td>
                    <td>
                      <div className="avatar-chip">
                        <div className="avatar-chip-dot">
                          {exp.researcher_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--ink-2)" }}>{exp.researcher_name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.76rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
                        <Cpu size={11} />{exp.gpu_type.replace("NVIDIA ", "")}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.76rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
                        <Clock size={11} />
                        {exp.created_at
                          ? new Date(exp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "—"}
                      </span>
                    </td>
                    <td><span className={`badge badge-${exp.status.toLowerCase()}`}>{exp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bottom summary row */}
        <motion.div
          className="grid-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {[
            { label: "Avg Accuracy", value: summary.avgAccuracy > 0 ? (summary.avgAccuracy * 100).toFixed(1) + "%" : "—", sub: "Across completed runs" },
            { label: "Completed", value: summary.completedCount, sub: "Successful runs" },
            { label: "Failed", value: summary.failedCount, sub: "Require investigation" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {s.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--ink-4)", marginTop: "0.15rem" }}>{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

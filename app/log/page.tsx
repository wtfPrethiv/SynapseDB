"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { FlaskConical, Database, GitCommit, Cpu, Hash, Target, CheckCircle, Info, User, Loader2 } from "lucide-react";

interface Researcher { researcher_id: number; name: string; email: string; institution: string; }
interface Dataset { dataset_id: number; dataset_name: string; version_tag: string; }
interface Hardware { hardware_id: number; gpu_type: string; cuda_version: string; }
interface Commit { commit_id: number; commit_hash: string; branch: string; }

export default function LogRunPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [form, setForm] = useState({
    experimentName: "",
    researcherId: "",
    datasetId: "",
    commitId: "",
    hardwareId: "",
    seed: "",
    accuracy: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  // Load dropdown data on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/researchers").then((r) => r.json()),
      fetch("/api/datasets").then((r) => r.json()),
      fetch("/api/hardware").then((r) => r.json()),
      fetch("/api/codecommits").then((r) => r.json()),
    ]).then(([res, ds, hw, cc]) => {
      setResearchers(res ?? []);
      setDatasets(ds.datasets ?? []);
      setHardware(hw.stats ?? []);
      setCommits(cc ?? []);
      setLoadingDropdowns(false);
    }).catch(() => setLoadingDropdowns(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.experimentName.trim()) e.experimentName = "Required";
    if (!form.researcherId) e.researcherId = "Required";
    if (!form.datasetId) e.datasetId = "Required";
    if (!form.commitId) e.commitId = "Required";
    if (!form.hardwareId) e.hardwareId = "Required";
    if (!form.seed) e.seed = "Required";
    if (!form.accuracy || isNaN(+form.accuracy) || +form.accuracy < 0 || +form.accuracy > 1)
      e.accuracy = "Must be 0–1";
    return e;
  };

  const resetForm = () => setForm({ experimentName: "", researcherId: "", datasetId: "", commitId: "", hardwareId: "", seed: "", accuracy: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setServerError("");

    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentName: form.experimentName,
        researcherId: Number(form.researcherId),
        hardwareId: Number(form.hardwareId),
        commitId: Number(form.commitId),
        datasetId: Number(form.datasetId),
        randomSeed: Number(form.seed),
        accuracy: Number(form.accuracy),
      }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      resetForm();
    } else {
      const data = await res.json();
      setServerError(data.error ?? "Transaction failed");
    }
  };

  // Resolved names for SQL preview
  const selectedResearcher = researchers.find((r) => String(r.researcher_id) === form.researcherId);
  const selectedDataset = datasets.find((d) => String(d.dataset_id) === form.datasetId);
  const selectedHardware = hardware.find((h) => String(h.hardware_id) === form.hardwareId);
  const selectedCommit = commits.find((c) => String(c.commit_id) === form.commitId);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "820px" }}>

        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="breadcrumb">
            <Link href="/dashboard">nexus</Link>
            <span className="breadcrumb-sep">/</span>
            <span>log-run</span>
          </div>
          <h1 className="page-title">Log New Experiment</h1>
          <p className="page-sub">
            Executes an ACID-compliant transaction writing to experiments, results, and auditlog tables simultaneously.
          </p>
        </motion.div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          style={{
            display: "flex", alignItems: "flex-start", gap: "0.7rem",
            padding: "0.875rem 1.1rem",
            background: "var(--info-bg)", border: "1px solid var(--info-border)",
            borderRadius: "var(--radius-sm)", marginBottom: "1.5rem",
            fontSize: "0.8rem", color: "var(--ink-3)", lineHeight: 1.6,
          }}
        >
          <Info size={14} style={{ color: "var(--info)", flexShrink: 0, marginTop: "2px" }} />
          <span>
            This form triggers a <strong style={{ color: "var(--ink)" }}>BEGIN TRANSACTION</strong> that inserts into{" "}
            <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "0 3px", borderRadius: "2px" }}>experiments</code>,{" "}
            <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "0 3px", borderRadius: "2px" }}>results</code>, and{" "}
            <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "0 3px", borderRadius: "2px" }}>auditlog</code> atomically.
            Any failure triggers a full rollback.
          </span>
        </motion.div>

        {/* Form */}
        <motion.form
          className="form-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="form-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FlaskConical size={15} color="var(--ink-2)" />
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>Experiment Configuration</div>
                <div style={{ fontSize: "0.72rem", color: "var(--ink-4)" }}>All fields required for ACID compliance</div>
              </div>
            </div>
          </div>

          <div className="form-body">
            {/* Experiment Name - full width */}
            <div className="form-group form-group--full">
              <label className="form-label" htmlFor="exp-name">
                <FlaskConical size={11} /> Experiment Name
              </label>
              <input
                id="exp-name"
                type="text"
                className="form-input"
                placeholder="e.g. ResNet-50 Ablation Study v3"
                value={form.experimentName}
                onChange={(e) => handleChange("experimentName", e.target.value)}
              />
              {errors.experimentName && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.experimentName}</span>}
            </div>

            {/* Researcher */}
            <div className="form-group">
              <label className="form-label" htmlFor="researcher-id">
                <User size={11} /> Researcher
              </label>
              <select
                id="researcher-id"
                className="form-select"
                value={form.researcherId}
                onChange={(e) => handleChange("researcherId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">{loadingDropdowns ? "Loading…" : "Select researcher…"}</option>
                {researchers.map((r) => (
                  <option key={r.researcher_id} value={r.researcher_id}>
                    {r.name} — {r.institution}
                  </option>
                ))}
              </select>
              {errors.researcherId && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.researcherId}</span>}
            </div>

            {/* Dataset */}
            <div className="form-group">
              <label className="form-label" htmlFor="dataset-id">
                <Database size={11} /> Dataset
              </label>
              <select
                id="dataset-id"
                className="form-select"
                value={form.datasetId}
                onChange={(e) => handleChange("datasetId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">{loadingDropdowns ? "Loading…" : "Select dataset…"}</option>
                {datasets.map((d) => (
                  <option key={d.dataset_id} value={d.dataset_id}>
                    {d.dataset_name} {d.version_tag}
                  </option>
                ))}
              </select>
              {errors.datasetId && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.datasetId}</span>}
            </div>

            {/* Code Commit */}
            <div className="form-group">
              <label className="form-label" htmlFor="code-commit">
                <GitCommit size={11} /> Code Commit
              </label>
              <select
                id="code-commit"
                className="form-select mono-input"
                value={form.commitId}
                onChange={(e) => handleChange("commitId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">{loadingDropdowns ? "Loading…" : "Select commit…"}</option>
                {commits.map((c) => (
                  <option key={c.commit_id} value={c.commit_id}>
                    {c.commit_hash} — {c.branch}
                  </option>
                ))}
              </select>
              {errors.commitId && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.commitId}</span>}
            </div>

            {/* Hardware */}
            <div className="form-group">
              <label className="form-label" htmlFor="hardware-target">
                <Cpu size={11} /> Hardware Target
              </label>
              <select
                id="hardware-target"
                className="form-select"
                value={form.hardwareId}
                onChange={(e) => handleChange("hardwareId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">{loadingDropdowns ? "Loading…" : "Select GPU…"}</option>
                {hardware.map((h) => (
                  <option key={h.hardware_id} value={h.hardware_id}>
                    {h.gpu_type} — CUDA {h.cuda_version}
                  </option>
                ))}
              </select>
              {errors.hardwareId && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.hardwareId}</span>}
            </div>

            {/* Random Seed */}
            <div className="form-group">
              <label className="form-label" htmlFor="random-seed">
                <Hash size={11} /> Random Seed
              </label>
              <input
                id="random-seed"
                type="number"
                className="form-input mono-input"
                placeholder="42"
                value={form.seed}
                onChange={(e) => handleChange("seed", e.target.value)}
              />
              {errors.seed && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.seed}</span>}
            </div>

            {/* Accuracy */}
            <div className="form-group">
              <label className="form-label" htmlFor="init-accuracy">
                <Target size={11} /> Initial Accuracy (0–1)
              </label>
              <input
                id="init-accuracy"
                type="number"
                step="0.0001"
                min="0"
                max="1"
                className="form-input mono-input"
                placeholder="0.9432"
                value={form.accuracy}
                onChange={(e) => handleChange("accuracy", e.target.value)}
              />
              {errors.accuracy && <span style={{ fontSize: "0.7rem", color: "var(--danger)" }}>{errors.accuracy}</span>}
            </div>
          </div>

          {serverError && (
            <div style={{ margin: "0 1.5rem", padding: "0.65rem 1rem", background: "var(--danger-bg, #fff1f0)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--danger)" }}>
              ⚠️ {serverError}
            </div>
          )}

          <div className="form-footer">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Clear</button>
            <button
              id="execute-transaction"
              type="submit"
              className="btn btn-primary"
              disabled={loading || loadingDropdowns}
              style={{ minWidth: "190px" }}
            >
              {loading ? (
                <><div className="spinner" />Executing…</>
              ) : (
                <><FlaskConical size={14} />Execute Transaction</>
              )}
            </button>
          </div>
        </motion.form>

        {/* SQL preview */}
        <motion.div
          className="card mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ background: "var(--surface-2)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
        >
          <div style={{ color: "var(--ink-4)", marginBottom: "0.75rem", fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
            SQL Preview — ACID Transaction
          </div>
          <pre style={{ color: "var(--ink-3)", lineHeight: 1.9, overflowX: "auto", whiteSpace: "pre-wrap" }}>
{`BEGIN;

INSERT INTO experiments (researcher_id, hardware_id, commit_id, dataset_id, experiment_name, random_seed, status)
  VALUES (${form.researcherId || "<researcher_id>"}, ${form.hardwareId || "<hardware_id>"},
          ${form.commitId || "<commit_id>"}, ${form.datasetId || "<dataset_id>"},
          '${form.experimentName || "<name>"}', ${form.seed || 0}, 'Running');
  -- ${selectedResearcher ? `→ ${selectedResearcher.name}` : ""}  ${selectedDataset ? `| ${selectedDataset.dataset_name} ${selectedDataset.version_tag}` : ""}
  -- ${selectedHardware ? `→ ${selectedHardware.gpu_type} (CUDA ${selectedHardware.cuda_version})` : ""}  ${selectedCommit ? `| commit: ${selectedCommit.commit_hash} [${selectedCommit.branch}]` : ""}

INSERT INTO results (experiment_id, metric_name, metric_value)
  VALUES (LAST_INSERT_ID(), 'accuracy', ${form.accuracy || "0.0000"});

INSERT INTO auditlog (action_type, table_name, description)
  VALUES ('INSERT', 'experiments', 'New experiment logged via dashboard');

COMMIT; -- Rollback on any failure`}
          </pre>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="toast-wrap"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <div className="toast">
              <div className="toast-icon"><CheckCircle size={14} /></div>
              <div>
                <div className="toast-title">Transaction committed</div>
                <div className="toast-subtitle">Logged to experiments, results, and auditlog.</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

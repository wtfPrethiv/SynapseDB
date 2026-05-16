"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import DemoBanner from "../components/DemoBanner";
import { Search, ExternalLink, Filter, Loader2 } from "lucide-react";

interface Experiment {
  experiment_id: number;
  experiment_name: string;
  status: string;
  researcher_name: string;
  gpu_type: string;
  commit_hash: string;
  dataset_name: string;
  version_tag: string;
  accuracy: number | null;
  loss: number | null;
  random_seed: number;
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}

export default function ExperimentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo") === "true";
  const isDemo = demoParam || status === "unauthenticated";
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [datasetFilter, setDatasetFilter] = useState("All");

  useEffect(() => {
    if (status === "loading" && !demoParam) return;
    const url = isDemo ? "/api/experiments?demo=true" : "/api/experiments";
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setExperiments(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [status, isDemo, demoParam]);

  const uniqueDatasets = useMemo(
    () => [...new Set(experiments.map((e) => e.dataset_name))],
    [experiments]
  );

  const filtered = useMemo(() => {
    return experiments.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.experiment_name.toLowerCase().includes(q) ||
        String(e.experiment_id).includes(q) ||
        e.researcher_name.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      const matchDataset = datasetFilter === "All" || e.dataset_name === datasetFilter;
      return matchSearch && matchStatus && matchDataset;
    });
  }, [experiments, search, statusFilter, datasetFilter]);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="container page-enter" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>

        {isDemo && <DemoBanner />}

        <div className="page-header">
          <div className="breadcrumb">
            <Link href="/dashboard">synapsedb</Link>
            <span className="breadcrumb-sep">/</span>
            <span>experiments</span>
          </div>
          <h1 className="page-title">Experiment Directory</h1>
          <p className="page-sub">
            {loading ? "Loading…" : `${experiments.length} total experiments — complete historical record of all ML runs.`}
          </p>
        </div>

        {/* Filter bar */}
        <div className="filter-bar mb-6">
          <div className="search-wrap">
            <Search size={13} className="search-icon" />
            <input
              id="exp-search"
              type="text"
              className="search-input"
              placeholder="Search by name, ID, or researcher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Filter size={13} style={{ color: "var(--ink-4)" }} />
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Running">Running</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              id="dataset-filter"
              className="filter-select"
              value={datasetFilter}
              onChange={(e) => setDatasetFilter(e.target.value)}
            >
              <option value="All">All Datasets</option>
              {uniqueDatasets.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
            {loading ? "…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Loading / error states */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "var(--ink-4)" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
        {error && (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--ink-4)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
            ⚠️ Could not load experiments. Check your database connection.
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Experiment Name</th>
                  <th>Researcher</th>
                  <th>Dataset</th>
                  <th>GPU</th>
                  <th>Accuracy</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp) => (
                  <tr
                    key={exp.experiment_id}
                    onClick={() => router.push(`/experiment/${exp.experiment_id}${isDemo ? '?demo=true' : ''}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td><span className="exp-id">EXP-{String(exp.experiment_id).padStart(3, "0")}</span></td>
                    <td><span className="exp-name">{exp.experiment_name}</span></td>
                    <td>
                      <div className="avatar-chip">
                        <div className="avatar-chip-dot">
                          {exp.researcher_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span style={{ color: "var(--ink-2)" }}>{exp.researcher_name.split(" ").slice(-1)[0]}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--ink-2)" }}>
                        {exp.dataset_name}{" "}
                        <span style={{ color: "var(--ink-4)" }}>{exp.version_tag}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--ink-3)" }}>
                        {exp.gpu_type.replace("NVIDIA ", "")}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 600, color: exp.accuracy && exp.accuracy > 0 ? "var(--ink)" : "var(--ink-4)" }}>
                        {exp.accuracy && exp.accuracy > 0 ? (Number(exp.accuracy) * 100).toFixed(2) + "%" : "—"}
                      </span>
                    </td>
                    <td><StatusBadge status={exp.status} /></td>
                    <td>
                      <Link
                        href={`/experiment/${exp.experiment_id}${isDemo ? '?demo=true' : ''}`}
                        onClick={(ev) => ev.stopPropagation()}
                        style={{ color: "var(--ink-4)", display: "flex" }}
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--ink-4)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                No experiments match your filters.
              </div>
            )}
          </div>
        )}

        {/* Summary badges */}
        {!loading && !error && (
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {(["Completed", "Running", "Failed", "Pending"] as const).map((s) => {
              const count = experiments.filter((e) => e.status === s).length;
              return (
                <button
                  key={s}
                  className={`badge badge-${s.toLowerCase()}`}
                  style={{ cursor: "pointer", border: "1px solid transparent" }}
                  onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
                >
                  {s}: {count}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

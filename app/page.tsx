"use client";
import "./homepage.css";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Preloader from "./components/Preloader";
import {
  GitBranch,
  ShieldCheck,
  Network,
  ArrowRight,
  FlaskConical,
  Lock,
  Cpu,
  BarChart3,
  ChevronRight,
  Info,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const features = [
  { icon: GitBranch, name: "Full Lineage Tracking", desc: "Every model links to the exact dataset version, code commit, and hardware. No ambiguity, ever." },
  { icon: ShieldCheck, name: "ACID Transactions", desc: "Experiments write to multiple tables atomically. Any failure rolls back the entire operation." },
  { icon: Lock, name: "Tamper-Proof Audits", desc: "High-performing results are locked from deletion. Every action is logged with a timestamp." },
  { icon: Network, name: "Provenance DAG", desc: "Visualize the exact dependency graph of any model, from dataset to final metric." },
  { icon: FlaskConical, name: "Reproducibility Checks", desc: "Automatic alerts for missing seeds, CUDA mismatches, and hardware drift between runs." },
  { icon: Cpu, name: "Hardware Telemetry", desc: "Track GPU utilization across all runs to optimize compute spend and identify bottlenecks." },
];

const steps = [
  { step: "01", title: "Log a Run", desc: "Fill in the experiment parameters: dataset version, commit hash, hardware, and initial metrics." },
  { step: "02", title: "ACID Transaction", desc: "SynapseDB writes to all tables atomically. Any failure triggers a complete rollback." },
  { step: "03", title: "Provenance DAG", desc: "An immutable lineage graph is constructed linking every upstream dependency." },
  { step: "04", title: "Verify & Audit", desc: "Any researcher can replay the exact experiment using the stored configuration snapshot." },
];

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [showDemoToast, setShowDemoToast] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleLaunchDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      router.push("/dashboard");
    } else {
      setShowDemoToast(true);
      setTimeout(() => {
        router.push("/dashboard?demo=true");
      }, 1800);
      setTimeout(() => setShowDemoToast(false), 4000);
    }
  };

  return (
    <>
      <AnimatePresence mode="popLayout">
        {!loaded && <Preloader key="preloader-root" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ background: "var(--bg)", minHeight: "100vh" }}
          >
            {/* ── NAVBAR ── */}
            <motion.header
              className="homepage-nav"
              initial={{ y: -56, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", width: "100%", maxWidth: "1320px", margin: "0 auto", padding: "0 2rem" }}>
                <Link href="/" className="navbar-logo">
                  <span className="logo-text">SynapseDB</span>
                </Link>

                <nav style={{ display: "flex", gap: "0.15rem", alignItems: "center" }}>
                  {/* Nav links removed per user request */}
                </nav>

                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <Link href="/auth/signin" className="btn-hero-secondary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
                    Sign in
                  </Link>
                  <button onClick={handleLaunchDashboard} className="btn-hero-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
                    Launch Dashboard
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.header>

            {/* ── HERO ── */}
            <section className="hero">
              <div className="hero-grid-bg" />
              <div className="container" style={{ position: "relative" }}>

                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                  <span className="hero-eyebrow">
                    <span className="hero-eyebrow-dot" />
                    Solving the ML Reproducibility Crisis
                  </span>
                </motion.div>

                <motion.h1 className="hero-title" custom={1} variants={fadeUp} initial="hidden" animate="visible">
                  Your AI experiments,{" "}
                  <span className="hero-title-dim">provably reproducible.</span>
                </motion.h1>

                <motion.p className="hero-desc" custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  SynapseDB is a strict audit trail for machine learning labs. Link every model to the exact
                  dataset, code commit, and GPU config — and prevent benchmark tampering forever.
                </motion.p>

                <motion.div className="hero-actions" custom={3} variants={fadeUp} initial="hidden" animate="visible">
                  <button onClick={handleLaunchDashboard} className="btn-hero-primary">
                    <FlaskConical size={15} />
                    Enter the Lab
                  </button>
                  <button onClick={handleLaunchDashboard} className="btn-hero-secondary">
                    Browse Experiments
                    <ChevronRight size={14} />
                  </button>
                </motion.div>

                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                  <div className="hero-stats-row">
                    {[
                      { num: "1,247", label: "Experiments Logged" },
                      { num: "99.4%", label: "Reproducibility Rate" },
                      { num: "38", label: "Active Researchers" },
                      { num: "91", label: "SOTA Models" },
                    ].map((s) => (
                      <div key={s.label} className="hero-stat-card">
                        <span className="hero-stat-num">{s.num}</span>
                        <span className="hero-stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="features-section" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                >
                  <span className="features-tag">Platform Features</span>
                  <h2 className="features-title">Every layer of your pipeline,{" "}
                    <span style={{ color: "var(--ink-4)" }}>tracked.</span>
                  </h2>
                  <p className="features-desc">
                    From dataset versioning to GPU telemetry, SynapseDB captures the full provenance
                    chain so you can reproduce any result, any time.
                  </p>
                </motion.div>

                <motion.div
                  className="features-grid"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                >
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.name} className="feature-card">
                        <div className="feature-icon">
                          <Icon size={17} color="var(--ink-2)" />
                        </div>
                        <h3 className="feature-name">{f.name}</h3>
                        <p className="feature-desc">{f.desc}</p>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: "5rem 0", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                  style={{ marginBottom: "2.5rem" }}
                >
                  <span className="features-tag">How It Works</span>
                  <h2 className="features-title">From commit to{" "}
                    <span style={{ color: "var(--ink-4)" }}>certified result.</span>
                  </h2>
                </motion.div>

                <motion.div
                  className="steps-row"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                >
                  {steps.map((s) => (
                    <div key={s.step} className="step-card">
                      <div className="step-number">{s.step}</div>
                      <h3 className="step-title">{s.title}</h3>
                      <p className="step-desc">{s.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                >
                  <span className="features-tag">Get Started</span>
                  <h2 className="cta-title">
                    Ready to make your research{" "}
                    <span style={{ color: "var(--ink-4)" }}>reproducible?</span>
                  </h2>
                  <p className="cta-desc">
                    Join 38 researchers already using SynapseDB to build trusted, verifiable ML pipelines.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={handleLaunchDashboard} className="btn-hero-primary">
                      <BarChart3 size={15} />
                      Launch Dashboard
                    </button>
                    <Link href="/auth/signin" className="btn-hero-secondary">
                      Sign In
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="site-footer">
              <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <Link href="/" className="navbar-logo">
                  <span className="logo-text">SynapseDB</span>
                </Link>
                <p style={{ fontSize: "0.72rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>
                  AI Provenance &amp; Reproducibility Tracker
                </p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  {[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Sign In", href: "/auth/signin" },
                  ].map((l) => (
                    <Link key={l.label} href={l.href} style={{ fontSize: "0.78rem", color: "var(--ink-4)" }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo mode toast */}
      <AnimatePresence>
        {showDemoToast && (
          <motion.div
            className="toast-wrap"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <div className="toast" style={{ borderColor: "var(--warning-border)", background: "var(--warning-bg)" }}>
              <div className="toast-icon" style={{ color: "var(--warning)" }}><Info size={14} /></div>
              <div>
                <div className="toast-title" style={{ color: "var(--warning)" }}>Not signed in</div>
                <div className="toast-subtitle">Launching demo mode with sample data…</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

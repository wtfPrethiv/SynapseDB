"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, FlaskConical, ArrowLeft, Loader2 } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = (provider: string) => {
    setLoading(provider);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const handleDemo = () => {
    setLoading("demo");
    signIn("credentials", { email: "demo@synapsedb.dev", callbackUrl: "/dashboard" });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "80px 80px", opacity: 0.4, pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", padding: "0 1.5rem" }}
      >
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            fontSize: "0.75rem", color: "var(--ink-4)", fontFamily: "var(--font-mono)",
            marginBottom: "2rem", textDecoration: "none",
          }}
        >
          <ArrowLeft size={12} /> Back to home
        </Link>

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)", padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontWeight: 700,
              letterSpacing: "0.08em", color: "var(--ink)", marginBottom: "0.5rem",
            }}>
              SynapseDB
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--ink-3)", lineHeight: 1.6 }}>
              Sign in to access your lab dashboard and experiment data.
            </p>
          </div>

          {/* OAuth buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              onClick={() => handleOAuth("github")}
              disabled={!!loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                padding: "0.75rem 1rem", background: "var(--ink)", color: "white",
                border: "none", borderRadius: "var(--radius-sm)", fontSize: "0.85rem",
                fontWeight: 500, cursor: "pointer", transition: "background 0.15s",
                opacity: loading && loading !== "github" ? 0.5 : 1,
              }}
            >
              {loading === "github" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <GitHubIcon size={16} />}
              Continue with GitHub
            </button>

            <button
              onClick={() => handleOAuth("google")}
              disabled={!!loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                padding: "0.75rem 1rem", background: "var(--surface)",
                border: "1px solid var(--border-2)", borderRadius: "var(--radius-sm)",
                fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)",
                cursor: "pointer", transition: "border-color 0.15s",
                opacity: loading && loading !== "google" ? 0.5 : 1,
              }}
            >
              {loading === "google" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Mail size={16} />}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            margin: "1.5rem 0", color: "var(--ink-4)", fontSize: "0.72rem",
            fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            or
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemo}
            disabled={!!loading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              padding: "0.75rem 1rem", width: "100%",
              background: "var(--surface-2)", border: "1px dashed var(--border-2)",
              borderRadius: "var(--radius-sm)", fontSize: "0.82rem", fontWeight: 500,
              color: "var(--ink-3)", cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
              opacity: loading && loading !== "demo" ? 0.5 : 1,
            }}
          >
            {loading === "demo" ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <FlaskConical size={15} />}
            Try Demo Mode
          </button>

          <p style={{
            textAlign: "center", marginTop: "1.5rem",
            fontSize: "0.7rem", color: "var(--ink-4)", lineHeight: 1.7,
          }}>
            Demo mode uses sample data — no sign-up required.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FlaskConical, LogIn } from "lucide-react";

export default function DemoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        padding: "0.55rem 1rem",
        background: "linear-gradient(135deg, #fef9ed 0%, #fff7e0 100%)",
        border: "1px solid var(--warning-border)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "1rem",
        fontSize: "0.78rem",
        color: "var(--warning)",
        fontWeight: 500,
        flexWrap: "wrap",
      }}
    >
      <FlaskConical size={13} />
      <span>
        <strong>Demo Mode</strong> — You&apos;re viewing sample data. Sign in to access your own experiments.
      </span>
      <Link
        href="/auth/signin"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.25rem 0.6rem",
          background: "var(--surface)",
          border: "1px solid var(--warning-border)",
          borderRadius: "var(--radius-xs)",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: "var(--warning)",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        <LogIn size={11} /> Sign In
      </Link>
    </motion.div>
  );
}

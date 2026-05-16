"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

interface KPI {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  sub?: string;
  warning?: boolean;
}

export default function DashboardClient({ kpis }: { kpis: KPI[] }) {
  return (
    <motion.div
      className="grid-4 mb-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
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
  );
}

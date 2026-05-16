"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface HardwareStat {
  gpu_type: string;
  count: number;
}

const FILLS = ["#111110", "#3c3c38", "#6b6b65", "#9c9c94", "#c8c8c0"];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value" style={{ color: "#111110" }}>
          {payload[0].value} experiments
        </p>
      </div>
    );
  }
  return null;
};

export default function HardwareChart({ data }: { data: HardwareStat[] }) {
  const chartData = data.map((d) => ({
    label: d.gpu_type.replace("NVIDIA ", ""),
    count: Number(d.count),
  }));

  return (
    <div className="chart-wrap">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Hardware Utilization</h3>
          <p className="chart-subtitle">Experiments distributed by GPU type</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9c9c94", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
            axisLine={{ stroke: "#e5e5e0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9c9c94", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={FILLS[i % FILLS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

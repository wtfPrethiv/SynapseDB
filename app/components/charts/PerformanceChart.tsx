"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformancePoint {
  experiment_id: number;
  experiment_name: string;
  accuracy: number | null;
  loss: number | null;
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="chart-tooltip-value">
            {p.name}: {(p.value * 100).toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  const chartData = data.map((d) => ({
    id: `#${d.experiment_id}`,
    accuracy: d.accuracy ?? 0,
    loss: d.loss ?? 0,
  }));

  return (
    <div className="chart-wrap">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Performance Tracking</h3>
          <p className="chart-subtitle">Accuracy &amp; Loss across experiment runs</p>
        </div>
        <div className="chart-legend">
          <span className="legend-dot" style={{ background: "#111110" }} />
          <span>Accuracy</span>
          <span className="legend-dot" style={{ background: "#c0392b" }} />
          <span>Loss</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" vertical={false} />
          <XAxis
            dataKey="id"
            tick={{ fill: "#9c9c94", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
            axisLine={{ stroke: "#e5e5e0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fill: "#9c9c94", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#111110"
            strokeWidth={1.5}
            dot={{ fill: "#111110", r: 2.5, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#111110", strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="loss"
            stroke="#c0392b"
            strokeWidth={1.5}
            dot={{ fill: "#c0392b", r: 2.5, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#c0392b", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

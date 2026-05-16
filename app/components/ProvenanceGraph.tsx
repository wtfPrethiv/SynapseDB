"use client";

interface ProvenanceGraphProps {
  experimentName?: string;
  datasetTag?: string;
  codeCommit?: string;
  gpuType?: string;
}

const PAL = {
  indigo: "#5b6cf0",
  green:  "#16a34a",
  amber:  "#d97706",
  teal:   "#0891b2",
  stone:  "#78716c",
  slate:  "#334155",
  violet: "#7c3aed",
  rose:   "#e11d48",
};

const W = 130, H = 66;

export default function ProvenanceGraph({
  experimentName = "ResNet-50 Baseline",
  datasetTag     = "CIFAR-10 v2.1",
  codeCommit     = "a3f9e21",
  gpuType        = "NVIDIA A100",
}: ProvenanceGraphProps) {
  const gpu = gpuType.replace("NVIDIA ", "").replace("Tesla ", "");

  // cx/cy = centre of each card
  // Columns: 100 | 300 | 490 | 680
  const nodes = [
    { id:"dataset",    label:"DATASET",       val1: datasetTag,                val2:"170 MB · 60k imgs",    color: PAL.indigo, cx:100, cy: 95  },
    { id:"commit",     label:"CODE COMMIT",   val1: codeCommit,                val2:"branch · main",        color: PAL.green,  cx:100, cy:210  },
    { id:"hardware",   label:"HARDWARE",      val1: gpu,                       val2:"CUDA 12.1",            color: PAL.amber,  cx:100, cy:325  },
    { id:"pipeline",   label:"DATA PIPELINE", val1:"norm · augment",           val2:"224×224 · fp16",       color: PAL.teal,   cx:300, cy:152  },
    { id:"hparams",    label:"HYPERPARAMS",   val1:"lr=1e-3 · bs=128",         val2:"wd=0.01 · warmup=5ep", color: PAL.stone,  cx:300, cy:298  },
    { id:"experiment", label:"EXPERIMENT",    val1: experimentName,            val2:"25.6M params · fp16",  color: PAL.slate,  cx:490, cy:210  },
    { id:"checkpoint", label:"CHECKPOINT",    val1:`ckpt·${codeCommit}`,       val2:"epoch 100 · 482 MB",   color: PAL.violet, cx:680, cy:130  },
    { id:"metrics",    label:"METRICS",       val1:"acc · loss · F1 · mAP",    val2:"acc=94.3% · F1=0.941", color: PAL.rose,   cx:680, cy:305  },
  ];

  // Edges: [from-id, to-id]
  const edgePairs: [string,string][] = [
    ["dataset",   "pipeline"],
    ["commit",    "pipeline"],
    ["commit",    "hparams"],
    ["hardware",  "hparams"],
    ["pipeline",  "experiment"],
    ["hparams",   "experiment"],
    ["experiment","checkpoint"],
    ["experiment","metrics"],
  ];

  const nMap: Record<string, { cx:number; cy:number }> = {};
  nodes.forEach(n => { nMap[n.id] = { cx: n.cx, cy: n.cy }; });

  return (
    <div className="provenance-graph page-enter">
      <svg
        viewBox="0 0 820 420"
        width="100%"
        height="auto"
        style={{ display: "block", overflow: "visible" }}
        aria-label="Provenance DAG"
      >
        <defs>
          <marker id="pg-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,1 L0,7 L7,4 z" fill="#c0c0b8" />
          </marker>
        </defs>

        {/* ── Edges ── */}
        {edgePairs.map(([fId, tId]) => {
          const f = nMap[fId], t = nMap[tId];
          const x1 = f.cx + W / 2;
          const y1 = f.cy;
          const x2 = t.cx - W / 2;
          const y2 = t.cy;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={`${fId}-${tId}`}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              stroke="#d0cfc8"
              strokeWidth="1.6"
              fill="none"
              markerEnd="url(#pg-arrow)"
            />
          );
        })}

        {/* ── Nodes ── */}
        {nodes.map((node) => {
          const tx = node.cx - W / 2;
          const ty = node.cy - H / 2;
          return (
            <g
              key={node.id}
              transform={`translate(${tx}, ${ty})`}
            >
              {/* Shadow */}
              <rect x={2} y={3} width={W} height={H} rx={8} fill="rgba(0,0,0,0.07)" />
              {/* Body */}
              <rect x={0} y={0} width={W} height={H} rx={8}
                fill="#ffffff" stroke={node.color} strokeWidth="1.3" strokeOpacity="0.45" />
              {/* Status dot */}
              <circle cx={W - 11} cy={13} r={3.8} fill={node.color} fillOpacity="0.75" />
              {/* Label */}
              <text x={W / 2} y={24}
                textAnchor="middle" fill="#a8a8a0"
                fontSize="7.8" fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em">
                {node.label}
              </text>
              {/* Primary value */}
              <text x={W / 2} y={42}
                textAnchor="middle" fill="#111110"
                fontSize={node.val1.length > 18 ? "9" : "10.5"}
                fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {node.val1.length > 22 ? node.val1.slice(0, 21) + "…" : node.val1}
              </text>
              {/* Sub value */}
              <text x={W / 2} y={57}
                textAnchor="middle" fill={node.color}
                fontSize="7.8" fontFamily="JetBrains Mono, monospace" fillOpacity="0.9">
                {node.val2}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="provenance-legend" style={{ flexWrap:"wrap", gap:"0.35rem 1rem", marginTop:"0.6rem" }}>
        {nodes.map(n => (
          <div key={n.id} className="provenance-legend-item">
            <span className="prov-dot" style={{ background: n.color }} />
            <span style={{ textTransform:"capitalize" }}>{n.label.toLowerCase().replace(/\b\w/g, c=>c.toUpperCase())}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

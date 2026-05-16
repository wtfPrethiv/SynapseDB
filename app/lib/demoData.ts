/**
 * Static demo data — mirrors the MySQL seed data.
 * Used when the user is NOT authenticated (demo mode).
 */

// ── Researchers ──
export const demoResearchers = [
  { researcher_id: 1, name: "Dr. Sarah Chen", email: "sarah.chen@mit.edu", institution: "MIT CSAIL" },
  { researcher_id: 2, name: "Marcus Webb", email: "marcus.webb@stanford.edu", institution: "Stanford AI Lab" },
  { researcher_id: 3, name: "Priya Nair", email: "priya.nair@deepmind.com", institution: "Google DeepMind" },
  { researcher_id: 4, name: "Tomás Rivera", email: "tomas.rivera@cmu.edu", institution: "CMU LTI" },
  { researcher_id: 5, name: "Jin Park", email: "jin.park@berkeley.edu", institution: "UC Berkeley" },
  { researcher_id: 6, name: "Amara Osei", email: "amara.osei@oxford.ac.uk", institution: "Oxford Future of Humanity" },
  { researcher_id: 7, name: "Lena Hoffmann", email: "lena.hoffmann@ethz.ch", institution: "ETH Zürich" },
  { researcher_id: 8, name: "Ravi Shankar", email: "ravi.shankar@iitb.ac.in", institution: "IIT Bombay" },
  { researcher_id: 9, name: "Yuki Tanaka", email: "yuki.tanaka@riken.jp", institution: "RIKEN AIP" },
  { researcher_id: 10, name: "Fatima Al-Hassan", email: "fatima.alhassan@kaust.edu.sa", institution: "KAUST" },
];

// ── Datasets ──
export const demoDatasets = [
  { dataset_id: 1, dataset_name: "CIFAR-10", version_tag: "v2.1" },
  { dataset_id: 2, dataset_name: "ImageNet", version_tag: "v3.0" },
  { dataset_id: 3, dataset_name: "MNIST", version_tag: "v1.0" },
  { dataset_id: 4, dataset_name: "COCO", version_tag: "v4.2" },
  { dataset_id: 5, dataset_name: "WikiText-103", version_tag: "v2.0" },
  { dataset_id: 6, dataset_name: "OpenWebText", version_tag: "v1.4" },
  { dataset_id: 7, dataset_name: "BDD100K", version_tag: "v1.0" },
  { dataset_id: 8, dataset_name: "ShapeNet", version_tag: "v2.0" },
  { dataset_id: 9, dataset_name: "LibriSpeech", version_tag: "v1.0" },
  { dataset_id: 10, dataset_name: "MS-MARCO", version_tag: "v2.1" },
];

// ── Hardware Configs ──
export const demoHardware = [
  { hardware_id: 1, gpu_type: "NVIDIA A100", cuda_version: "12.1" },
  { hardware_id: 2, gpu_type: "NVIDIA RTX 4090", cuda_version: "12.2" },
  { hardware_id: 3, gpu_type: "Tesla V100", cuda_version: "11.8" },
  { hardware_id: 4, gpu_type: "NVIDIA RTX 3080", cuda_version: "12.0" },
  { hardware_id: 5, gpu_type: "RTX 3090 Ti", cuda_version: "12.1" },
  { hardware_id: 6, gpu_type: "NVIDIA A10G", cuda_version: "11.7" },
  { hardware_id: 7, gpu_type: "NVIDIA H100", cuda_version: "12.3" },
  { hardware_id: 8, gpu_type: "AMD MI250X", cuda_version: "5.5" },
];

// ── Code Commits ──
export const demoCommits = [
  { commit_id: 1, commit_hash: "a3f9e21", branch: "main" },
  { commit_id: 2, commit_hash: "b7c2d45", branch: "feature/vit-large" },
  { commit_id: 3, commit_hash: "c4a7f33", branch: "main" },
  { commit_id: 4, commit_hash: "d2e8b91", branch: "feature/gpt2-finetune" },
  { commit_id: 5, commit_hash: "e1f3a89", branch: "fix/gradient-clip" },
  { commit_id: 6, commit_hash: "f9d0b12", branch: "release/v2.0" },
  { commit_id: 7, commit_hash: "a9c3e57", branch: "feature/yolo-v8" },
  { commit_id: 8, commit_hash: "b5f1d84", branch: "feature/mobilenet-quant" },
  { commit_id: 9, commit_hash: "e7a2c19", branch: "experiments/xgboost" },
  { commit_id: 10, commit_hash: "f3b8e72", branch: "feature/swin-seg" },
  { commit_id: 11, commit_hash: "c6d1a45", branch: "main" },
  { commit_id: 12, commit_hash: "h2k9m31", branch: "experiments/lstm-anomaly" },
  { commit_id: 13, commit_hash: "g4n1p87", branch: "feature/diffusion-v2" },
  { commit_id: 14, commit_hash: "k8r3t52", branch: "feature/clip-contrastive" },
  { commit_id: 15, commit_hash: "m2x9q64", branch: "research/sparse-attention" },
];

// ── Experiments (full join data) ──
interface DemoExperiment {
  experiment_id: number;
  experiment_name: string;
  random_seed: number;
  status: string;
  researcher_id: number;
  researcher_name: string;
  researcher_email: string;
  researcher_institution: string;
  hardware_id: number;
  gpu_type: string;
  cuda_version: string;
  commit_id: number;
  commit_hash: string;
  branch: string;
  dataset_id: number;
  dataset_name: string;
  version_tag: string;
}

function buildExperiment(
  id: number, name: string, seed: number, status: string,
  rId: number, hId: number, cId: number, dId: number
): DemoExperiment {
  const r = demoResearchers.find(x => x.researcher_id === rId)!;
  const h = demoHardware.find(x => x.hardware_id === hId)!;
  const c = demoCommits.find(x => x.commit_id === cId)!;
  const d = demoDatasets.find(x => x.dataset_id === dId)!;
  return {
    experiment_id: id, experiment_name: name, random_seed: seed, status,
    researcher_id: r.researcher_id, researcher_name: r.name, researcher_email: r.email, researcher_institution: r.institution,
    hardware_id: h.hardware_id, gpu_type: h.gpu_type, cuda_version: h.cuda_version,
    commit_id: c.commit_id, commit_hash: c.commit_hash, branch: c.branch,
    dataset_id: d.dataset_id, dataset_name: d.dataset_name, version_tag: d.version_tag,
  };
}

export const demoExperiments: DemoExperiment[] = [
  buildExperiment(1, "ResNet-50 Baseline", 42, "Completed", 1, 1, 1, 1),
  buildExperiment(2, "ViT-Large Fine-tune", 1337, "Completed", 2, 2, 2, 2),
  buildExperiment(3, "BERT Sentiment Probe", 2048, "Running", 3, 3, 5, 5),
  buildExperiment(4, "EfficientNet-B7 Ablation", 0, "Failed", 5, 4, 6, 4),
  buildExperiment(5, "DenseNet-121 Transfer", 999, "Completed", 4, 1, 3, 1),
  buildExperiment(6, "GPT-2 Fine-tune NLP", 2023, "Completed", 1, 2, 4, 5),
  buildExperiment(7, "YOLOv8 Object Detection", 777, "Pending", 2, 3, 7, 4),
  buildExperiment(8, "MobileNetV3 Quantization", 512, "Completed", 3, 4, 8, 1),
  buildExperiment(9, "XGBoost Tabular Benchmark", 101, "Completed", 4, 5, 9, 3),
  buildExperiment(10, "Swin-T Semantic Segmentation", 3141, "Completed", 5, 1, 10, 4),
  buildExperiment(11, "ConvNeXt-XL Pretrain", 42, "Completed", 1, 1, 11, 2),
  buildExperiment(12, "LSTM Anomaly Detection", 0, "Failed", 2, 3, 12, 5),
  buildExperiment(13, "Stable Diffusion v2 Finetune", 9999, "Completed", 6, 7, 13, 6),
  buildExperiment(14, "CLIP Contrastive Learning", 7777, "Completed", 7, 1, 14, 2),
  buildExperiment(15, "Sparse Attention Transformer", 1024, "Running", 8, 6, 15, 5),
  buildExperiment(16, "BDD100K Lane Detection", 256, "Completed", 9, 7, 1, 7),
  buildExperiment(17, "ImageNet ViT-B/16 Scratch", 0, "Failed", 10, 1, 2, 2),
  buildExperiment(18, "3D Point Cloud PointNet++", 8888, "Completed", 1, 2, 3, 8),
  buildExperiment(19, "Wav2Vec 2.0 Speech", 314, "Completed", 3, 7, 4, 9),
  buildExperiment(20, "BERT Dense Retrieval MS-MARCO", 42, "Completed", 5, 1, 5, 10),
  buildExperiment(21, "EfficientDet-D7 CIFAR", 555, "Completed", 2, 2, 6, 1),
  buildExperiment(22, "Mask R-CNN Instance Seg", 1111, "Running", 4, 5, 7, 4),
  buildExperiment(23, "LLaMA-2 Instruction Tuning", 4242, "Completed", 6, 7, 8, 6),
  buildExperiment(24, "TabNet Financial Fraud", 2222, "Completed", 7, 1, 9, 3),
  buildExperiment(25, "ResNet-101 Knowledge Distill", 333, "Completed", 8, 3, 10, 1),
  buildExperiment(26, "Stereo Depth Estimation", 0, "Failed", 9, 7, 11, 7),
  buildExperiment(27, "T5-Large Summarization", 6789, "Completed", 10, 2, 12, 5),
  buildExperiment(28, "DiT Image Generation", 1234, "Pending", 1, 7, 13, 2),
  buildExperiment(29, "HuBERT Audio Classification", 9876, "Completed", 3, 1, 14, 9),
  buildExperiment(30, "ColBERT v2 Retrieval", 5555, "Completed", 5, 7, 15, 10),
];

// ── Results (metrics per experiment) ──
interface DemoResult {
  result_id: number;
  experiment_id: number;
  metric_name: string;
  metric_value: number;
}

let _rid = 0;
function r(eid: number, name: string, value: number): DemoResult {
  return { result_id: ++_rid, experiment_id: eid, metric_name: name, metric_value: value };
}

export const demoResults: DemoResult[] = [
  r(1, "accuracy", 0.9432), r(1, "loss", 0.1823), r(1, "f1_score", 0.9418), r(1, "precision", 0.9451), r(1, "recall", 0.9385),
  r(2, "accuracy", 0.9127), r(2, "loss", 0.2341), r(2, "f1_score", 0.9109), r(2, "precision", 0.9198),
  r(3, "accuracy", 0.8714), r(3, "loss", 0.3102),
  r(4, "loss", 9.9999),
  r(5, "accuracy", 0.9289), r(5, "loss", 0.2056), r(5, "f1_score", 0.9271), r(5, "recall", 0.9240),
  r(6, "accuracy", 0.9611), r(6, "loss", 0.1442), r(6, "perplexity", 18.34),
  r(8, "accuracy", 0.8923), r(8, "loss", 0.2788), r(8, "f1_score", 0.8901),
  r(9, "accuracy", 0.9745), r(9, "loss", 0.0981), r(9, "f1_score", 0.9731), r(9, "precision", 0.9788), r(9, "recall", 0.9674),
  r(10, "accuracy", 0.9053), r(10, "loss", 0.2234), r(10, "mIoU", 0.5812),
  r(11, "accuracy", 0.9512), r(11, "loss", 0.1634), r(11, "top5_acc", 0.9921),
  r(12, "loss", 8.4512),
  r(13, "FID", 12.43), r(13, "CLIP_score", 0.3218), r(13, "loss", 0.0921),
  r(14, "accuracy", 0.9634), r(14, "loss", 0.1187), r(14, "zero_shot", 0.7620),
  r(15, "loss", 0.4421), r(15, "perplexity", 31.12),
  r(16, "accuracy", 0.8876), r(16, "loss", 0.2991), r(16, "mAP", 0.4321),
  r(17, "loss", 7.3321),
  r(18, "accuracy", 0.8734), r(18, "loss", 0.3341), r(18, "mAP", 0.5621),
  r(19, "accuracy", 0.9234), r(19, "WER", 0.0421), r(19, "loss", 0.1823),
  r(20, "accuracy", 0.9456), r(20, "MRR", 0.3812), r(20, "loss", 0.1543),
  r(21, "accuracy", 0.9356), r(21, "loss", 0.1987), r(21, "mAP", 0.6123),
  r(22, "loss", 0.5234), r(22, "mAP", 0.3421),
  r(23, "accuracy", 0.9789), r(23, "loss", 0.0812), r(23, "perplexity", 6.43),
  r(24, "accuracy", 0.9823), r(24, "loss", 0.0721), r(24, "f1_score", 0.9801), r(24, "AUC_ROC", 0.9934),
  r(25, "accuracy", 0.9276), r(25, "loss", 0.2134), r(25, "f1_score", 0.9243),
  r(26, "loss", 5.9921),
  r(27, "ROUGE_L", 0.4312), r(27, "loss", 0.1654), r(27, "BLEU", 0.3821),
  r(29, "accuracy", 0.9134), r(29, "loss", 0.2312), r(29, "WER", 0.0634),
  r(30, "accuracy", 0.9567), r(30, "MRR", 0.4123), r(30, "loss", 0.1234),
];

// ── Audit Log ──
export const demoAuditLog = [
  { log_id: 1, action_type: "INSERT", table_name: "experiments", description: 'Experiment #1 "ResNet-50 Baseline" created by Dr. Sarah Chen', logged_at: "2026-04-05T08:15:00Z" },
  { log_id: 2, action_type: "INSERT", table_name: "results", description: "Metrics recorded for experiment #1: accuracy=0.9432, loss=0.1823", logged_at: "2026-04-05T12:47:00Z" },
  { log_id: 3, action_type: "UPDATE", table_name: "experiments", description: "Experiment #1 status changed to Completed", logged_at: "2026-04-05T12:47:30Z" },
  { log_id: 4, action_type: "INSERT", table_name: "experiments", description: 'Experiment #2 "ViT-Large Fine-tune" created by Marcus Webb', logged_at: "2026-04-06T14:20:00Z" },
  { log_id: 5, action_type: "INSERT", table_name: "results", description: "Metrics recorded for experiment #2: accuracy=0.9127, loss=0.2341", logged_at: "2026-04-06T22:37:00Z" },
  { log_id: 6, action_type: "UPDATE", table_name: "experiments", description: "Experiment #2 status changed to Completed", logged_at: "2026-04-06T22:37:30Z" },
  { log_id: 7, action_type: "INSERT", table_name: "experiments", description: 'Experiment #3 "BERT Sentiment Probe" created by Priya Nair', logged_at: "2026-04-07T07:00:00Z" },
  { log_id: 8, action_type: "INSERT", table_name: "experiments", description: 'Experiment #4 "EfficientNet-B7 Ablation" created by Jin Park', logged_at: "2026-04-08T22:10:00Z" },
  { log_id: 9, action_type: "UPDATE", table_name: "experiments", description: "Experiment #4 status changed to Failed — OOM error on RTX 3080", logged_at: "2026-04-08T22:14:00Z" },
  { log_id: 10, action_type: "INSERT", table_name: "experiments", description: 'Experiment #6 "GPT-2 Fine-tune NLP" created by Dr. Sarah Chen', logged_at: "2026-04-10T08:30:00Z" },
  { log_id: 11, action_type: "LOCK", table_name: "experiments", description: "Experiment #6 record LOCKED — accuracy > 0.96 (SOTA threshold)", logged_at: "2026-04-10T20:32:00Z" },
  { log_id: 12, action_type: "INSERT", table_name: "experiments", description: 'Experiment #23 "LLaMA-2 Instruction Tuning" created by Amara Osei', logged_at: "2026-04-23T07:00:00Z" },
  { log_id: 13, action_type: "LOCK", table_name: "experiments", description: "Experiment #23 record LOCKED — accuracy > 0.97 (SOTA threshold)", logged_at: "2026-04-23T19:01:00Z" },
  { log_id: 14, action_type: "INSERT", table_name: "experiments", description: 'Experiment #24 "TabNet Financial Fraud" created by Lena Hoffmann', logged_at: "2026-04-24T09:00:00Z" },
  { log_id: 15, action_type: "LOCK", table_name: "experiments", description: "Experiment #24 record LOCKED — accuracy > 0.98 (SOTA threshold)", logged_at: "2026-04-24T10:31:00Z" },
  { log_id: 16, action_type: "SELECT", table_name: "experiments", description: "Dashboard KPI query executed — 30 total experiments", logged_at: "2026-05-01T08:00:00Z" },
];

// ── Pre-computed Dashboard Data ──
export function getDemoDashboard() {
  const totalExperiments = demoExperiments.length;
  const activeResearchers = new Set(demoExperiments.map(e => e.researcher_id)).size;
  const sotaModels = new Set(
    demoResults.filter(r => r.metric_name === "accuracy" && r.metric_value > 0.9).map(r => r.experiment_id)
  ).size;
  const missingSeeds = demoExperiments.filter(e => e.random_seed === 0).length;

  const recentActivity = [...demoExperiments]
    .sort((a, b) => b.experiment_id - a.experiment_id)
    .slice(0, 5)
    .map(e => ({
      experiment_id: e.experiment_id,
      experiment_name: e.experiment_name,
      status: e.status,
      researcher_name: e.researcher_name,
      gpu_type: e.gpu_type,
      created_at: "2026-04-15T08:00:00Z",
    }));

  const completedExps = demoExperiments.filter(e => e.status === "Completed");
  const performanceMetrics = completedExps.slice(0, 10).map(e => {
    const acc = demoResults.find(r => r.experiment_id === e.experiment_id && r.metric_name === "accuracy");
    const loss = demoResults.find(r => r.experiment_id === e.experiment_id && r.metric_name === "loss");
    return {
      experiment_id: e.experiment_id,
      experiment_name: e.experiment_name,
      accuracy: acc?.metric_value ?? null,
      loss: loss?.metric_value ?? null,
    };
  });

  // Hardware distribution
  const hwCounts: Record<string, number> = {};
  demoExperiments.forEach(e => { hwCounts[e.gpu_type] = (hwCounts[e.gpu_type] || 0) + 1; });
  const hardwareStats = Object.entries(hwCounts)
    .map(([gpu_type, count]) => ({ gpu_type, count }))
    .sort((a, b) => b.count - a.count);

  const completedCount = demoExperiments.filter(e => e.status === "Completed").length;
  const failedCount = demoExperiments.filter(e => e.status === "Failed").length;
  const accValues = demoResults.filter(r => r.metric_name === "accuracy" && r.metric_value > 0);
  const avgAccuracy = accValues.length > 0 ? accValues.reduce((s, r) => s + r.metric_value, 0) / accValues.length : 0;

  return {
    kpi: { totalExperiments, activeResearchers, sotaModels, missingSeeds },
    recentActivity,
    performanceMetrics,
    hardwareStats,
    summary: { completedCount, failedCount, avgAccuracy },
  };
}

// ── Pre-computed Experiments list (for /api/experiments) ──
export function getDemoExperimentsList() {
  return demoExperiments.map(e => {
    const acc = demoResults.find(r => r.experiment_id === e.experiment_id && r.metric_name === "accuracy");
    const loss = demoResults.find(r => r.experiment_id === e.experiment_id && r.metric_name === "loss");
    return { ...e, accuracy: acc?.metric_value ?? null, loss: loss?.metric_value ?? null };
  }).sort((a, b) => b.experiment_id - a.experiment_id);
}

// ── Single experiment detail ──
export function getDemoExperimentDetail(id: number) {
  const exp = demoExperiments.find(e => e.experiment_id === id);
  if (!exp) return null;
  const metrics = demoResults.filter(r => r.experiment_id === id);
  return { experiment: exp, metrics };
}

// ── Datasets page data ──
export function getDemoDatasetsData() {
  const datasets = demoDatasets.map(d => {
    const usage_count = demoExperiments.filter(e => e.dataset_id === d.dataset_id).length;
    return { ...d, usage_count };
  }).sort((a, b) => b.usage_count - a.usage_count);

  const usageByExperiment = demoExperiments.map(e => ({
    experiment_id: e.experiment_id,
    experiment_name: e.experiment_name,
    status: e.status,
    dataset_name: e.dataset_name,
    version_tag: e.version_tag,
    researcher_name: e.researcher_name,
  })).sort((a, b) => b.experiment_id - a.experiment_id);

  return { datasets, usageByExperiment };
}

// ── Hardware page data ──
export function getDemoHardwareData() {
  const stats = demoHardware.map(h => {
    const experiment_count = demoExperiments.filter(e => e.hardware_id === h.hardware_id).length;
    return { ...h, experiment_count };
  }).sort((a, b) => b.experiment_count - a.experiment_count);

  const assignments = [...demoExperiments]
    .sort((a, b) => b.experiment_id - a.experiment_id)
    .slice(0, 8)
    .map(e => ({
      experiment_id: e.experiment_id,
      experiment_name: e.experiment_name,
      status: e.status,
      gpu_type: e.gpu_type,
      cuda_version: e.cuda_version,
      researcher_name: e.researcher_name,
    }));

  return { stats, assignments };
}

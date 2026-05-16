-- ============================================================
--  NEXUS AI Provenance DB — Full Seed Script
-- ============================================================
USE ai_provenance_db;

-- ────────────────────────────────────────────────────────────
-- 1. RESEARCHERS  (10 total)
-- ────────────────────────────────────────────────────────────
INSERT IGNORE INTO researchers (researcher_id, name, email, institution) VALUES
(1,  'Dr. Sarah Chen',     'sarah.chen@mit.edu',          'MIT CSAIL'),
(2,  'Marcus Webb',        'marcus.webb@stanford.edu',     'Stanford AI Lab'),
(3,  'Priya Nair',         'priya.nair@deepmind.com',      'Google DeepMind'),
(4,  'Tomás Rivera',       'tomas.rivera@cmu.edu',         'CMU LTI'),
(5,  'Jin Park',           'jin.park@berkeley.edu',        'UC Berkeley'),
(6,  'Amara Osei',         'amara.osei@oxford.ac.uk',      'Oxford Future of Humanity'),
(7,  'Lena Hoffmann',      'lena.hoffmann@ethz.ch',        'ETH Zürich'),
(8,  'Ravi Shankar',       'ravi.shankar@iitb.ac.in',      'IIT Bombay'),
(9,  'Yuki Tanaka',        'yuki.tanaka@riken.jp',         'RIKEN AIP'),
(10, 'Fatima Al-Hassan',   'fatima.alhassan@kaust.edu.sa', 'KAUST');

-- ────────────────────────────────────────────────────────────
-- 2. DATASETS  (10 total)
-- ────────────────────────────────────────────────────────────
INSERT IGNORE INTO datasets (dataset_id, dataset_name, version_tag) VALUES
(1,  'CIFAR-10',        'v2.1'),
(2,  'ImageNet',        'v3.0'),
(3,  'MNIST',           'v1.0'),
(4,  'COCO',            'v4.2'),
(5,  'WikiText-103',    'v2.0'),
(6,  'OpenWebText',     'v1.4'),
(7,  'BDD100K',         'v1.0'),
(8,  'ShapeNet',        'v2.0'),
(9,  'LibriSpeech',     'v1.0'),
(10, 'MS-MARCO',        'v2.1');

-- ────────────────────────────────────────────────────────────
-- 3. HARDWARE CONFIGS  (8 GPUs)
-- ────────────────────────────────────────────────────────────
INSERT IGNORE INTO hardwareconfigs (hardware_id, gpu_type, cuda_version) VALUES
(1, 'NVIDIA A100',      '12.1'),
(2, 'NVIDIA RTX 4090',  '12.2'),
(3, 'Tesla V100',       '11.8'),
(4, 'NVIDIA RTX 3080',  '12.0'),
(5, 'RTX 3090 Ti',      '12.1'),
(6, 'NVIDIA A10G',      '11.7'),
(7, 'NVIDIA H100',      '12.3'),
(8, 'AMD MI250X',       '5.5');

-- ────────────────────────────────────────────────────────────
-- 4. CODE COMMITS  (15 commits)
-- ────────────────────────────────────────────────────────────
INSERT IGNORE INTO codecommits (commit_id, commit_hash, branch) VALUES
(1,  'a3f9e21', 'main'),
(2,  'b7c2d45', 'feature/vit-large'),
(3,  'c4a7f33', 'main'),
(4,  'd2e8b91', 'feature/gpt2-finetune'),
(5,  'e1f3a89', 'fix/gradient-clip'),
(6,  'f9d0b12', 'release/v2.0'),
(7,  'a9c3e57', 'feature/yolo-v8'),
(8,  'b5f1d84', 'feature/mobilenet-quant'),
(9,  'e7a2c19', 'experiments/xgboost'),
(10, 'f3b8e72', 'feature/swin-seg'),
(11, 'c6d1a45', 'main'),
(12, 'h2k9m31', 'experiments/lstm-anomaly'),
(13, 'g4n1p87', 'feature/diffusion-v2'),
(14, 'k8r3t52', 'feature/clip-contrastive'),
(15, 'm2x9q64', 'research/sparse-attention');

-- ────────────────────────────────────────────────────────────
-- 5. EXPERIMENTS  (30 total)
-- ────────────────────────────────────────────────────────────
INSERT IGNORE INTO experiments (experiment_id, researcher_id, hardware_id, commit_id, dataset_id, experiment_name, random_seed, status) VALUES
(1,  1, 1, 1,  1,  'ResNet-50 Baseline',           42,   'Completed'),
(2,  2, 2, 2,  2,  'ViT-Large Fine-tune',           1337, 'Completed'),
(3,  3, 3, 5,  5,  'BERT Sentiment Probe',          2048, 'Running'),
(4,  5, 4, 6,  4,  'EfficientNet-B7 Ablation',      0,    'Failed'),
(5,  4, 1, 3,  1,  'DenseNet-121 Transfer',         999,  'Completed'),
(6,  1, 2, 4,  5,  'GPT-2 Fine-tune NLP',           2023, 'Completed'),
(7,  2, 3, 7,  4,  'YOLOv8 Object Detection',       777,  'Pending'),
(8,  3, 4, 8,  1,  'MobileNetV3 Quantization',      512,  'Completed'),
(9,  4, 5, 9,  3,  'XGBoost Tabular Benchmark',     101,  'Completed'),
(10, 5, 1, 10, 4,  'Swin-T Semantic Segmentation',  3141, 'Completed'),
(11, 1, 1, 11, 2,  'ConvNeXt-XL Pretrain',          42,   'Completed'),
(12, 2, 3, 12, 5,  'LSTM Anomaly Detection',        0,    'Failed'),
(13, 6, 7, 13, 6,  'Stable Diffusion v2 Finetune',  9999, 'Completed'),
(14, 7, 1, 14, 2,  'CLIP Contrastive Learning',     7777, 'Completed'),
(15, 8, 6, 15, 5,  'Sparse Attention Transformer',  1024, 'Running'),
(16, 9, 7, 1,  7,  'BDD100K Lane Detection',        256,  'Completed'),
(17, 10,1, 2,  2,  'ImageNet ViT-B/16 Scratch',     0,    'Failed'),
(18, 1, 2, 3,  8,  '3D Point Cloud PointNet++',     8888, 'Completed'),
(19, 3, 7, 4,  9,  'Wav2Vec 2.0 Speech',            314,  'Completed'),
(20, 5, 1, 5,  10, 'BERT Dense Retrieval MS-MARCO', 42,   'Completed'),
(21, 2, 2, 6,  1,  'EfficientDet-D7 CIFAR',        555,  'Completed'),
(22, 4, 5, 7,  4,  'Mask R-CNN Instance Seg',       1111, 'Running'),
(23, 6, 7, 8,  6,  'LLaMA-2 Instruction Tuning',    4242, 'Completed'),
(24, 7, 1, 9,  3,  'TabNet Financial Fraud',        2222, 'Completed'),
(25, 8, 3, 10, 1,  'ResNet-101 Knowledge Distill',  333,  'Completed'),
(26, 9, 7, 11, 7,  'Stereo Depth Estimation',       0,    'Failed'),
(27, 10,2, 12, 5,  'T5-Large Summarization',        6789, 'Completed'),
(28, 1, 7, 13, 2,  'DiT Image Generation',          1234, 'Pending'),
(29, 3, 1, 14, 9,  'HuBERT Audio Classification',  9876, 'Completed'),
(30, 5, 7, 15, 10, 'ColBERT v2 Retrieval',          5555, 'Completed');

-- ────────────────────────────────────────────────────────────
-- 6. RESULTS  (multiple metrics per experiment)
-- ────────────────────────────────────────────────────────────
INSERT INTO results (experiment_id, metric_name, metric_value) VALUES
-- EXP-1 ResNet-50 Baseline
(1,  'accuracy',  0.9432),
(1,  'loss',      0.1823),
(1,  'f1_score',  0.9418),
(1,  'precision', 0.9451),
(1,  'recall',    0.9385),
-- EXP-2 ViT-Large
(2,  'accuracy',  0.9127),
(2,  'loss',      0.2341),
(2,  'f1_score',  0.9109),
(2,  'precision', 0.9198),
-- EXP-3 BERT (running — partial)
(3,  'accuracy',  0.8714),
(3,  'loss',      0.3102),
-- EXP-4 EfficientNet-B7 (failed)
(4,  'loss',      9.9999),
-- EXP-5 DenseNet-121
(5,  'accuracy',  0.9289),
(5,  'loss',      0.2056),
(5,  'f1_score',  0.9271),
(5,  'recall',    0.9240),
-- EXP-6 GPT-2
(6,  'accuracy',  0.9611),
(6,  'loss',      0.1442),
(6,  'perplexity',18.34),
-- EXP-7 YOLOv8 (pending — no results yet)
-- EXP-8 MobileNetV3
(8,  'accuracy',  0.8923),
(8,  'loss',      0.2788),
(8,  'f1_score',  0.8901),
-- EXP-9 XGBoost
(9,  'accuracy',  0.9745),
(9,  'loss',      0.0981),
(9,  'f1_score',  0.9731),
(9,  'precision', 0.9788),
(9,  'recall',    0.9674),
-- EXP-10 Swin-T
(10, 'accuracy',  0.9053),
(10, 'loss',      0.2234),
(10, 'mIoU',      0.5812),
-- EXP-11 ConvNeXt-XL
(11, 'accuracy',  0.9512),
(11, 'loss',      0.1634),
(11, 'top5_acc',  0.9921),
-- EXP-12 LSTM Anomaly (failed)
(12, 'loss',      8.4512),
-- EXP-13 Stable Diffusion
(13, 'FID',       12.43),
(13, 'CLIP_score',0.3218),
(13, 'loss',      0.0921),
-- EXP-14 CLIP
(14, 'accuracy',  0.9634),
(14, 'loss',      0.1187),
(14, 'zero_shot', 0.7620),
-- EXP-15 Sparse Attention (running)
(15, 'loss',      0.4421),
(15, 'perplexity',31.12),
-- EXP-16 BDD100K
(16, 'accuracy',  0.8876),
(16, 'loss',      0.2991),
(16, 'mAP',       0.4321),
-- EXP-17 ImageNet ViT (failed)
(17, 'loss',      7.3321),
-- EXP-18 PointNet++
(18, 'accuracy',  0.8734),
(18, 'loss',      0.3341),
(18, 'mAP',       0.5621),
-- EXP-19 Wav2Vec
(19, 'accuracy',  0.9234),
(19, 'WER',       0.0421),
(19, 'loss',      0.1823),
-- EXP-20 BERT Dense Retrieval
(20, 'accuracy',  0.9456),
(20, 'MRR',       0.3812),
(20, 'loss',      0.1543),
-- EXP-21 EfficientDet-D7
(21, 'accuracy',  0.9356),
(21, 'loss',      0.1987),
(21, 'mAP',       0.6123),
-- EXP-22 Mask R-CNN (running)
(22, 'loss',      0.5234),
(22, 'mAP',       0.3421),
-- EXP-23 LLaMA-2
(23, 'accuracy',  0.9789),
(23, 'loss',      0.0812),
(23, 'perplexity',6.43),
-- EXP-24 TabNet Fraud
(24, 'accuracy',  0.9823),
(24, 'loss',      0.0721),
(24, 'f1_score',  0.9801),
(24, 'AUC_ROC',   0.9934),
-- EXP-25 ResNet-101 Distill
(25, 'accuracy',  0.9276),
(25, 'loss',      0.2134),
(25, 'f1_score',  0.9243),
-- EXP-26 Stereo Depth (failed)
(26, 'loss',      5.9921),
-- EXP-27 T5-Large
(27, 'ROUGE_L',   0.4312),
(27, 'loss',      0.1654),
(27, 'BLEU',      0.3821),
-- EXP-28 DiT (pending)
-- EXP-29 HuBERT
(29, 'accuracy',  0.9134),
(29, 'loss',      0.2312),
(29, 'WER',       0.0634),
-- EXP-30 ColBERT v2
(30, 'accuracy',  0.9567),
(30, 'MRR',       0.4123),
(30, 'loss',      0.1234);

-- ────────────────────────────────────────────────────────────
-- 7. AUDIT LOG  (rich history)
-- ────────────────────────────────────────────────────────────
INSERT INTO auditlog (action_type, table_name, description, logged_at) VALUES
('INSERT', 'experiments', 'Experiment #1 "ResNet-50 Baseline" created by Dr. Sarah Chen',                   '2026-04-05 08:15:00'),
('INSERT', 'results',     'Metrics recorded for experiment #1: accuracy=0.9432, loss=0.1823',               '2026-04-05 12:47:00'),
('UPDATE', 'experiments', 'Experiment #1 status changed to Completed',                                      '2026-04-05 12:47:30'),
('INSERT', 'experiments', 'Experiment #2 "ViT-Large Fine-tune" created by Marcus Webb',                     '2026-04-06 14:20:00'),
('INSERT', 'results',     'Metrics recorded for experiment #2: accuracy=0.9127, loss=0.2341',               '2026-04-06 22:37:00'),
('UPDATE', 'experiments', 'Experiment #2 status changed to Completed',                                      '2026-04-06 22:37:30'),
('INSERT', 'experiments', 'Experiment #3 "BERT Sentiment Probe" created by Priya Nair',                     '2026-04-07 07:00:00'),
('INSERT', 'experiments', 'Experiment #4 "EfficientNet-B7 Ablation" created by Jin Park',                   '2026-04-08 22:10:00'),
('UPDATE', 'experiments', 'Experiment #4 status changed to Failed — OOM error on RTX 3080',                 '2026-04-08 22:14:00'),
('INSERT', 'experiments', 'Experiment #5 "DenseNet-121 Transfer" created by Tomás Rivera',                  '2026-04-09 10:45:00'),
('INSERT', 'results',     'Metrics recorded for experiment #5: accuracy=0.9289, loss=0.2056',               '2026-04-09 14:43:00'),
('UPDATE', 'experiments', 'Experiment #5 status changed to Completed',                                      '2026-04-09 14:43:30'),
('INSERT', 'experiments', 'Experiment #6 "GPT-2 Fine-tune NLP" created by Dr. Sarah Chen',                  '2026-04-10 08:30:00'),
('INSERT', 'results',     'Metrics recorded for experiment #6: accuracy=0.9611, perplexity=18.34',          '2026-04-10 20:31:00'),
('UPDATE', 'experiments', 'Experiment #6 status changed to Completed',                                      '2026-04-10 20:31:30'),
('LOCK',   'experiments', 'Experiment #6 record LOCKED — accuracy > 0.96 (SOTA threshold)',                 '2026-04-10 20:32:00'),
('INSERT', 'experiments', 'Experiment #7 "YOLOv8 Object Detection" queued by Marcus Webb',                  '2026-04-11 20:00:00'),
('INSERT', 'experiments', 'Experiment #8 "MobileNetV3 Quantization" created by Priya Nair',                 '2026-04-12 09:20:00'),
('INSERT', 'experiments', 'Experiment #9 "XGBoost Tabular Benchmark" created by Tomás Rivera',              '2026-04-13 11:00:00'),
('INSERT', 'results',     'Metrics recorded for experiment #9: accuracy=0.9745, AUC=0.9934',                '2026-04-13 11:28:00'),
('INSERT', 'experiments', 'Experiment #10 "Swin-T Semantic Segmentation" created by Jin Park',              '2026-04-13 09:00:00'),
('INSERT', 'experiments', 'Experiment #11 "ConvNeXt-XL Pretrain" created by Dr. Sarah Chen',               '2026-04-14 06:30:00'),
('INSERT', 'experiments', 'Experiment #12 "LSTM Anomaly Detection" created by Marcus Webb',                 '2026-04-14 18:00:00'),
('UPDATE', 'experiments', 'Experiment #12 status changed to Failed — vanishing gradient',                   '2026-04-14 18:12:00'),
('INSERT', 'experiments', 'Experiment #13 "Stable Diffusion v2" created by Amara Osei',                     '2026-04-15 10:00:00'),
('INSERT', 'results',     'Metrics recorded for experiment #13: FID=12.43, CLIP_score=0.3218',              '2026-04-15 22:15:00'),
('INSERT', 'experiments', 'Experiment #14 "CLIP Contrastive" created by Lena Hoffmann',                     '2026-04-16 08:00:00'),
('LOCK',   'experiments', 'Experiment #14 record LOCKED — accuracy > 0.96 (SOTA threshold)',                '2026-04-16 16:30:00'),
('INSERT', 'experiments', 'Experiment #15 "Sparse Attention Transformer" created by Ravi Shankar',          '2026-04-17 09:00:00'),
('INSERT', 'experiments', 'Experiment #16 "BDD100K Lane Detection" created by Yuki Tanaka',                 '2026-04-18 11:00:00'),
('INSERT', 'experiments', 'Experiment #17 "ImageNet ViT-B/16 Scratch" created by Fatima Al-Hassan',         '2026-04-18 14:00:00'),
('UPDATE', 'experiments', 'Experiment #17 status changed to Failed — diverged at epoch 3',                  '2026-04-18 15:30:00'),
('INSERT', 'experiments', 'Experiment #18 "3D Point Cloud PointNet++" created by Dr. Sarah Chen',           '2026-04-19 08:00:00'),
('INSERT', 'experiments', 'Experiment #19 "Wav2Vec 2.0 Speech" created by Priya Nair',                      '2026-04-19 13:00:00'),
('INSERT', 'experiments', 'Experiment #20 "BERT Dense Retrieval" created by Jin Park',                      '2026-04-20 09:00:00'),
('INSERT', 'experiments', 'Experiment #21 "EfficientDet-D7 CIFAR" created by Marcus Webb',                  '2026-04-21 10:00:00'),
('INSERT', 'experiments', 'Experiment #22 "Mask R-CNN Instance Seg" created by Tomás Rivera',               '2026-04-22 08:00:00'),
('INSERT', 'experiments', 'Experiment #23 "LLaMA-2 Instruction Tuning" created by Amara Osei',              '2026-04-23 07:00:00'),
('INSERT', 'results',     'Metrics recorded for experiment #23: accuracy=0.9789, perplexity=6.43',          '2026-04-23 19:00:00'),
('LOCK',   'experiments', 'Experiment #23 record LOCKED — accuracy > 0.97 (SOTA threshold)',                '2026-04-23 19:01:00'),
('INSERT', 'experiments', 'Experiment #24 "TabNet Financial Fraud" created by Lena Hoffmann',               '2026-04-24 09:00:00'),
('INSERT', 'results',     'Metrics recorded for experiment #24: accuracy=0.9823, AUC_ROC=0.9934',           '2026-04-24 10:30:00'),
('LOCK',   'experiments', 'Experiment #24 record LOCKED — accuracy > 0.98 (SOTA threshold)',                '2026-04-24 10:31:00'),
('INSERT', 'experiments', 'Experiment #25 "ResNet-101 Knowledge Distill" created by Ravi Shankar',          '2026-04-25 08:00:00'),
('INSERT', 'experiments', 'Experiment #26 "Stereo Depth Estimation" created by Yuki Tanaka',                '2026-04-26 09:00:00'),
('UPDATE', 'experiments', 'Experiment #26 status changed to Failed — NaN loss at epoch 1',                  '2026-04-26 09:05:00'),
('INSERT', 'experiments', 'Experiment #27 "T5-Large Summarization" created by Fatima Al-Hassan',            '2026-04-27 10:00:00'),
('INSERT', 'experiments', 'Experiment #28 "DiT Image Generation" queued by Dr. Sarah Chen',                 '2026-04-28 08:00:00'),
('INSERT', 'experiments', 'Experiment #29 "HuBERT Audio Classification" created by Priya Nair',             '2026-04-29 09:00:00'),
('INSERT', 'experiments', 'Experiment #30 "ColBERT v2 Retrieval" created by Jin Park',                      '2026-04-30 10:00:00'),
('INSERT', 'results',     'Metrics recorded for experiment #30: accuracy=0.9567, MRR=0.4123',               '2026-04-30 14:22:00'),
('SELECT', 'experiments', 'Dashboard KPI query executed — 30 total experiments',                            '2026-05-01 08:00:00'),
('SELECT', 'results',     'Performance chart data fetched — 10 completed experiments plotted',               '2026-05-01 08:00:01'),
('INSERT', 'experiments', 'New experiment logged via dashboard by Dr. Sarah Chen',                           NOW());

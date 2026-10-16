import React, { useState } from 'react';
import { 
  Cpu, Sparkles, AlertTriangle, CheckCircle2, Search, Sliders, 
  Layers, ShieldAlert, FileText, ZoomIn, Eye, Activity 
} from 'lucide-react';
import { AiForgeryMetrics } from '../types';

interface AiAnalysisViewProps {
  metrics: AiForgeryMetrics;
  studentName?: string;
  certificateId?: string;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  metrics,
  studentName = 'Kaviya Priya',
  certificateId = 'CERT-2026-IT-101',
}) => {
  const [activeLayer, setActiveLayer] = useState<'normal' | 'noise' | 'heatmap' | 'contours'>('heatmap');

  const categories = [
    { name: 'Document Layout Analysis', score: metrics.layoutAnalysisScore, desc: 'Checks margins, alignment grids, and spacing against university templates' },
    { name: 'Text Consistency', score: metrics.textConsistencyScore, desc: 'Detects character spacing, anti-aliasing variations, and baseline shifts' },
    { name: 'Font Analysis', score: metrics.fontAnalysisScore, desc: 'Identifies font family deviations, kerning anomalies, and weight discrepancies' },
    { name: 'Logo/Seal Analysis', score: metrics.logoSealScore, desc: 'Inspects embossed micro-seal patterns, resolution consistency, and vector edges' },
    { name: 'Image Manipulation Detection', score: metrics.manipulationDetectionScore, desc: 'Error Level Analysis (ELA) and copy-move clone detection for spliced pixels' },
    { name: 'Metadata Analysis', score: metrics.metadataScore, desc: 'Validates PDF XMP metadata timestamps, creator software signatures, and versioning' },
  ];

  const isHighQuality = metrics.genuinenessScore >= 85;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Neural Forensic Document Pipeline (v4.8)
          </div>
          <h2 className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            AI Forgery Detection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyzing candidate: <strong className="text-white">{studentName}</strong> • Certificate ID: <span className="font-mono text-cyan-300">{certificateId}</span>
          </p>
        </div>

        {/* Circular Genuineness Gauge */}
        <div className="flex items-center gap-4 bg-[#090e1a] p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isHighQuality ? 'text-sky-400' : 'text-amber-400'}
                strokeDasharray={`${metrics.genuinenessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-white">
              {metrics.genuinenessScore}%
            </span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Genuineness Score
            </div>
            <div className={`text-xl font-bold font-['Space_Grotesk'] ${isHighQuality ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics.genuinenessScore}% Genuine
            </div>
            <div className="text-[11px] text-slate-400">
              {isHighQuality ? 'Zero manipulation detected' : 'Inspection warnings flagged'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900/60 border border-sky-500/20 shadow-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
              AI Analysis Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              “{metrics.summary}”
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Forensic Visualizer + Progress Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Forensic Layer Viewer (Interactive simulation of ELA, Heatmap, Bounding Contours) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              Document Forensic Layer Scanner
            </h3>
            <span className="text-[11px] text-slate-400">Resolution: 300 DPI</span>
          </div>

          <div className="relative aspect-4/3 rounded-2xl border border-slate-800 bg-[#020617] overflow-hidden shadow-2xl flex items-center justify-center p-4">
            {/* Visual simulation based on active layer */}
            {activeLayer === 'heatmap' && (
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 p-4 flex flex-col justify-between border border-sky-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                
                {/* Visual heat zones */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-sky-300">
                  <span className="bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">HEATMAP: GRADIENT CONSISTENCY</span>
                  <span>CONFIDENCE: 99.8%</span>
                </div>

                <div className="relative z-10 space-y-3 text-center my-auto">
                  <div className="inline-block p-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-mono">
                    ✓ University Crest: Edge Geometry Consistent (0.02 delta)
                  </div>
                  <div className="p-2 rounded-lg border border-sky-500/40 bg-sky-950/30 text-sky-200 text-xs font-mono max-w-sm mx-auto">
                    ✓ Name Field: Anti-Aliasing Profile Matches Template
                  </div>
                  <div className="inline-block p-2 rounded-lg border border-indigo-500/40 bg-indigo-950/30 text-indigo-200 text-xs font-mono">
                    ✓ Registrar Signature: Genuine Ink Flow Pattern Validated
                  </div>
                </div>

                <div className="relative z-10 text-[10px] text-slate-400 flex justify-between font-mono">
                  <span>Pixel Delta: 0.003%</span>
                  <span>Gaussian Blur Variance: 0.12</span>
                </div>
              </div>
            )}

            {activeLayer === 'noise' && (
              <div className="relative w-full h-full rounded-xl bg-black p-4 flex flex-col justify-between border border-slate-800 text-slate-300">
                <div className="text-[11px] font-mono text-amber-400">
                  ERROR LEVEL ANALYSIS (ELA) NOISE FREQUENCY
                </div>
                <div className="text-center my-auto">
                  <Activity className="w-16 h-16 text-sky-400 mx-auto animate-pulse opacity-70 mb-2" />
                  <p className="text-xs text-slate-300 font-mono">
                    Uniform compression noise across canvas. No spliced high-frequency regions found.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Resampling Artifact Matrix: CLEAN
                </div>
              </div>
            )}

            {activeLayer === 'contours' && (
              <div className="relative w-full h-full rounded-xl bg-slate-900 p-4 flex flex-col justify-between border border-emerald-500/30">
                <div className="text-[11px] font-mono text-emerald-400">
                  OPTICAL CHARACTER BOUNDING CONTOURS
                </div>
                <div className="text-center my-auto space-y-2">
                  <div className="border border-dashed border-emerald-400/60 p-2 rounded max-w-xs mx-auto text-xs font-mono text-emerald-300">
                    [Kaviya Priya] - Bounding Box Angle: 0.00° (Perfect Horizon)
                  </div>
                  <div className="border border-dashed border-sky-400/60 p-2 rounded max-w-xs mx-auto text-xs font-mono text-sky-300">
                    [22IT101] - Kerning Pitch: 1.42mm (Baseline Aligned)
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  OCR Engine: Tesseract-Vision v5.2
                </div>
              </div>
            )}

            {activeLayer === 'normal' && (
              <div className="relative w-full h-full rounded-xl bg-[#020617] p-4 flex flex-col justify-between border border-slate-800">
                <div className="text-[11px] font-mono text-slate-300">
                  RAW DOCUMENT INGESTION BUFFER
                </div>
                <div className="text-center my-auto text-xs text-slate-400">
                  Raw uncompressed vector rasterization stream
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Color Space: sRGB 8-bit
                </div>
              </div>
            )}
          </div>

          {/* Layer Switcher Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'heatmap'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveLayer('noise')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'noise'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ELA Noise
            </button>
            <button
              onClick={() => setActiveLayer('contours')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'contours'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Contours
            </button>
            <button
              onClick={() => setActiveLayer('normal')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'normal'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Raw Buffer
            </button>
          </div>
        </div>

        {/* Right: 6 Analysis Category Progress Meters */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Analysis Metrics Breakdown
          </h3>

          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#090e1a]/95 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{cat.name}</span>
                  <span className="font-mono font-bold text-sky-300">{cat.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.score >= 90
                        ? 'bg-gradient-to-r from-sky-500 to-emerald-400'
                        : cat.score >= 65
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-red-400'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

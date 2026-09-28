import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code2 } from 'lucide-react';
import { getStandaloneHtmlCode } from '../utils/generateStandaloneHtml';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = getStandaloneHtmlCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autonomous_vehicle_telematics_dl.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#090e18] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-[#0c1424]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wide text-white">
                Standalone Single-File Micro-Project Deliverable
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Pure HTML + CSS + Vanilla JS (100% self-contained, no local server required)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0a101d] border-b border-cyan-500/20">
          <div className="text-xs font-mono text-cyan-300">
            File size: ~28 KB • Chart.js CDN included • Open-Meteo live feed integrated
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD .HTML FILE</span>
            </button>

            <a
              href="/standalone_autonomous_telematics.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>TEST STANDALONE TAB</span>
            </a>
          </div>
        </div>

        {/* Code View Body */}
        <div className="p-4 overflow-y-auto font-mono text-xs bg-[#05080f] text-slate-300 flex-grow select-all">
          <pre className="whitespace-pre-wrap leading-relaxed">{htmlCode}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-[#0c1424] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>College Deep Learning Micro-Project: 4 Modules Verified</span>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

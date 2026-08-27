import React from 'react';
import { X, GitCompare, Check } from 'lucide-react';

export default function DiffViewerModal({ isOpen, onClose, originalCode, modifiedCode, onApply }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-5xl rounded-3xl bg-[#090B16] border border-cyan-500/30 p-6 shadow-2xl space-y-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Code Diff & Architecture Comparison</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
          {/* Original */}
          <div className="flex flex-col border border-rose-500/30 rounded-2xl overflow-hidden bg-[#07080F]">
            <div className="px-3 py-2 bg-rose-950/40 border-b border-rose-500/20 text-rose-300 font-mono text-xs font-bold">
              Original Code
            </div>
            <pre className="p-3 text-xs font-mono text-gray-300 overflow-auto flex-1 leading-relaxed">
              <code>{originalCode || '// No original code'}</code>
            </pre>
          </div>

          {/* AI Refactored */}
          <div className="flex flex-col border border-emerald-500/30 rounded-2xl overflow-hidden bg-[#07080F]">
            <div className="px-3 py-2 bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              AI Optimized / Proposed Code
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-100 overflow-auto flex-1 leading-relaxed">
              <code>{modifiedCode || '// Proposed code'}</code>
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-300 text-xs">
            Cancel
          </button>
          {onApply && (
            <button
              onClick={() => { onApply(); onClose(); }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Check className="w-4 h-4" />
              <span>Apply Code Changes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

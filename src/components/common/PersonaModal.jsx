import React from 'react';
import { X, UserCheck, Sparkles, Code2, Sigma, Film, Atom } from 'lucide-react';
import { PERSONAS, storage } from '../../services/storage';

export default function PersonaModal({ isOpen, onClose, activePersona, onSelectPersona }) {
  if (!isOpen) return null;

  const getIcon = (id) => {
    switch (id) {
      case 'architect': return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'mathematician': return <Sigma className="w-5 h-5 text-emerald-400" />;
      case 'cinematographer': return <Film className="w-5 h-5 text-amber-400" />;
      case 'physicist': return <Atom className="w-5 h-5 text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#0C0E1B] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">AI Role & Persona Selector</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {PERSONAS.map((p) => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPersona(p.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/40 shadow-glow-cyan text-white'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-gray-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-white/10 flex-shrink-0">
                  {getIcon(p.id)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    {isSelected && <span className="text-[10px] font-mono text-cyan-400 font-semibold">Active</span>}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

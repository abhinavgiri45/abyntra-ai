import React, { useState } from 'react';
import { X, Sparkles, Wand2, Copy, Check, ArrowRight } from 'lucide-react';
import { openrouter } from '../../services/openrouter';

export default function PromptEnhancerModal({ isOpen, onClose, onApplyPrompt, activeModel }) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedResult, setEnhancedResult] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [domain, setDomain] = useState('coding'); // 'coding' | 'math' | 'art' | 'creative'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEnhance = async () => {
    if (!inputPrompt.trim()) return;
    setIsEnhancing(true);

    try {
      let fullText = '';
      await openrouter.streamChat({
        messages: [
          {
            role: 'system',
            content: `You are the Girionix Master Prompt Architect specializing in ${domain}. Transform the user's prompt into an ultra-detailed, precise, production-grade master instruction with clear objectives, constraints, architectural guidelines, and edge cases. Output ONLY the optimized prompt.`
          },
          { role: 'user', content: `Original Prompt: "${inputPrompt}"` }
        ],
        model: activeModel.id,
        onChunk: (chunk, acc) => {
          fullText = acc;
          setEnhancedResult(acc);
        }
      });
    } catch (err) {
      setEnhancedResult('Error: ' + err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApply = () => {
    if (enhancedResult.trim()) {
      onApplyPrompt(enhancedResult.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#0C0E1B] border border-cyan-500/30 p-6 shadow-2xl space-y-4 shadow-glow-cyan">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Prompt Forge & Enhancer</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Domain presets */}
        <div className="flex items-center gap-2">
          {['coding', 'math', 'art', 'general'].map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-3 py-1 rounded-xl text-xs font-mono uppercase transition-all ${
                domain === d 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div>
          <label className="text-[11px] text-gray-400 font-mono block mb-1">Your Concept or Rough Idea:</label>
          <textarea
            rows={3}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="e.g. build a stock ticker dashboard with chart or solve wave equation..."
            className="w-full p-3 rounded-xl bg-[#07080F] border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !inputPrompt.trim()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-90 disabled:opacity-40 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isEnhancing ? 'Synthesizing Master Prompt...' : '✨ Enhance Prompt'}</span>
        </button>

        {enhancedResult && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-cyan-400 font-mono font-semibold">Optimized Master Prompt:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(enhancedResult);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs font-sans text-gray-200 max-h-40 overflow-y-auto leading-relaxed">
              {enhancedResult}
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Use in Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

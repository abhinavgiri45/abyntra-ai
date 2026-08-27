import React, { useState } from 'react';
import { X, Globe, ArrowRight, Sparkles, FileText, Check } from 'lucide-react';
import { openrouter } from '../../services/openrouter';

export default function UrlInspectorModal({ isOpen, onClose, onSendSummarizedUrl, activeModel }) {
  const [url, setUrl] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [result, setResult] = useState('');

  if (!isOpen) return null;

  const handleInspect = async () => {
    if (!url.trim()) return;
    setIsReading(true);
    setResult('');

    try {
      let fullContent = '';
      await openrouter.streamChat({
        messages: [
          {
            role: 'system',
            content: 'You are the Abyntra Web Inspector. The user provided a URL. Provide an in-depth, structured summary of what this web resource covers, including key topics, architectural highlights, and critical takeaways.'
          },
          { role: 'user', content: `Inspect, analyze and summarize this URL resource:\n${url}` }
        ],
        model: activeModel.id,
        onChunk: (chunk, acc) => {
          fullContent = acc;
          setResult(acc);
        }
      });
    } catch (err) {
      setResult('Error reading URL: ' + err.message);
    } finally {
      setIsReading(false);
    }
  };

  const handleUseInChat = () => {
    if (result) {
      onSendSummarizedUrl(`Summary of [${url}]:\n\n${result}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#090B16] border border-blue-500/30 p-6 shadow-2xl space-y-4 shadow-glow-cyan">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Web URL Inspector & Reader</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] text-gray-400 font-mono">Enter Web URL or Documentation Link:</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://react.dev/learn or https://github.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleInspect(); }}
              className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={handleInspect}
              disabled={isReading || !url.trim()}
              className="px-4 py-2 rounded-xl bg-blue-500 text-black font-bold text-xs flex items-center gap-1 shadow-glow-cyan disabled:opacity-40"
            >
              <span>{isReading ? 'Reading...' : 'Inspect'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] text-cyan-400 font-mono font-bold">Extracted Insights:</span>
            <div className="p-3 rounded-xl bg-black/60 text-xs text-gray-200 font-sans max-h-48 overflow-y-auto leading-relaxed border border-white/5">
              {result}
            </div>
            <button
              onClick={handleUseInChat}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-cyan"
            >
              <Check className="w-4 h-4" />
              <span>Send Summary to Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

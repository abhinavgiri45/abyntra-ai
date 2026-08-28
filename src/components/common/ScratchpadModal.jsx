import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  Save, 
  Eye, 
  Edit3 
} from 'lucide-react';
import { openrouter } from '../../services/openrouter';

export default function ScratchpadModal({ isOpen, onClose, activeModel }) {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('girionix_scratchpad_notes') || '# Girionix Quick Scratchpad\n\n- Jot down ideas, prompts, or snippets here\n- Automatically saved in real-time\n';
  });
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
  const [copied, setCopied] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    localStorage.setItem('girionix_scratchpad_notes', content);
  }, [content]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Girionix_Notes_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAiSummarize = async () => {
    if (!content.trim() || isSummarizing) return;
    setIsSummarizing(true);
    try {
      let result = '';
      await openrouter.streamChat({
        messages: [
          { role: 'system', content: 'You are Girionix AI Executive Editor. Format and polish these notes into clean, structured Markdown bullet points with key insights.' },
          { role: 'user', content }
        ],
        model: activeModel.id,
        onChunk: (chunk, acc) => { result = acc; }
      });
      if (result) setContent(result);
    } catch (err) {
      console.warn('AI summarize error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl bg-[#090B16] border border-cyan-500/30 shadow-2xl flex flex-col h-[75vh] overflow-hidden shadow-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>AI Smart Scratchpad</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  Auto-Saved
                </span>
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                {wordCount} words • {charCount} chars
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/5 text-xs font-mono">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'edit' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'preview' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            {/* AI Polish */}
            <button
              onClick={handleAiSummarize}
              disabled={isSummarizing}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all shadow-glow-purple disabled:opacity-40"
              title="Clean & Structure with AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{isSummarizing ? 'Polishing...' : 'AI Polish'}</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Copy notes"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Download Markdown file (.md)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed bg-[#05060A]">
          {viewMode === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes, copy code, or jot down thoughts..."
              className="w-full h-full bg-transparent border-0 outline-none resize-none font-mono text-cyan-100 text-xs sm:text-sm leading-relaxed focus:outline-none placeholder-gray-600"
              spellCheck="false"
              autoFocus
            />
          ) : (
            <div className="prose prose-invert max-w-none text-xs text-gray-200 whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span>Synced locally in browser storage</span>
          <button
            onClick={() => setContent('')}
            className="flex items-center gap-1 text-gray-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
